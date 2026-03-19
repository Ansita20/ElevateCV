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
        "gemini-2.0-flash",
        "gemini-1.5-flash",
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
    return text.replace(/^```[a-zA-Z]*\n?/, "").replace(/```$/, "").trim();
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