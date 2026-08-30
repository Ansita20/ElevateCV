import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;

if (!apiKey) {
    console.warn("Gemini API key is not configured. Set GEMINI_API_KEY (or OPENAI_API_KEY fallback).");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

const getModelCandidates = () => {
    const configured = process.env.GEMINI_MODEL || process.env.OPENAI_MODEL || "";
    const candidates = [
        configured,
        "gemini-3.6-flash",
        "gemini-flash-latest",
    ].filter(Boolean);
    return [...new Set(candidates)];
};

const toErrorWithStatus = (error, model) => {
    const rawMessage = error?.message || "Gemini request failed";
    let message = rawMessage;

    if (/reported as leaked|PERMISSION_DENIED/i.test(rawMessage)) {
        message = "Gemini API key is invalid or leaked. Generate a new key and update GEMINI_API_KEY in server/.env.";
    } else if (/API key not valid|invalid api key/i.test(rawMessage)) {
        message = "Gemini API key is invalid. Update GEMINI_API_KEY in server/.env and restart backend.";
    } else if (/not found|is not found for API version|unsupported/i.test(rawMessage)) {
        message = `Configured Gemini model '${model}' is not available for this key.`;
    }

    const wrapped = new Error(message);
    wrapped.status = error?.status || error?.response?.status;
    wrapped.model = model;
    wrapped.originalMessage = rawMessage;
    return wrapped;
};

const stripCodeFences = (value = "") => {
    const text = String(value || "").trim();
    if (!text.startsWith("```") && !text.endsWith("```")) {
        return text;
    }
    return text
        .replace(/^```(?:json|javascript|typescript|python)?\s*/i, "")
        .replace(/```\s*$/, "")
        .trim();
};

export const parseStructuredJson = (value = "") => {
    const text = stripCodeFences(value);
    if (!text) return null;

    try {
        return JSON.parse(text);
    } catch {
        // Try to recover from text that wraps JSON in prose.
    }

    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");
    if (firstBrace >= 0 && lastBrace > firstBrace) {
        const candidate = text.slice(firstBrace, lastBrace + 1);
        try {
            return JSON.parse(candidate);
        } catch {
            return null;
        }
    }

    return null;
};

// Newer Gemini models often ignore "return only plain text" and reply with
// multiple headed options / markdown. Keep just the first option and strip formatting.
export const sanitizePlainText = (value = "") => {
    let text = String(value || "").trim();
    if (!text) return "";

    const optionSplit = text.split(/\n(?=\s*(?:\*\*|#{1,6}\s*)?(?:option|version)\s*\d+)/i);
    if (optionSplit.length > 1) {
        text = optionSplit[0];
    }

    const lines = [];
    for (const rawLine of text.split("\n")) {
        const line = rawLine.trim();
        if (!line) continue;
        if (/^#{1,6}\s*/.test(line)) continue;
        if (/^(\*\*)?(option|version)\s*\d+/i.test(line)) continue;
        if (/^ats keywords/i.test(line)) break;
        lines.push(line);
    }

    return lines
        .join(" ")
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/\*(.*?)\*/g, "$1")
        .replace(/^>\s*/gm, "")
        .replace(/\s+/g, " ")
        .trim();
};

export const generateTextWithGemini = async ({ systemPrompt = "", userPrompt = "", responseMimeType } = {}) => {
    const models = getModelCandidates();
    let lastError;

    for (const model of models) {
        try {
            const modelClient = genAI.getGenerativeModel({
                model,
                generationConfig: responseMimeType ? { responseMimeType } : undefined,
            });

            const prompt = `${systemPrompt ? `${systemPrompt}\n\n` : ""}${userPrompt}`;
            const result = await modelClient.generateContent(prompt);
            const text = stripCodeFences(result?.response?.text?.() || "");
            if (!text) {
                throw new Error("Gemini returned empty content");
            }
            return { text, model };
        } catch (error) {
            lastError = toErrorWithStatus(error, model);
            // Permission or leaked-key errors should fail fast and not be masked by later model 404s.
            if (lastError.status === 401 || lastError.status === 403) {
                throw lastError;
            }
            if (![400, 403, 404, 429, 500, 502, 503].includes(lastError.status)) {
                break;
            }
        }
    }

    throw lastError || new Error("Gemini request failed");
};