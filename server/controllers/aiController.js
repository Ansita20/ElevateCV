import Resume from "../models/Resume.js";
import { generateTextWithGemini, parseStructuredJson, sanitizePlainText } from "../configs/ai.js";

const splitIntoSections = (text) => {
    const lines = String(text || "")
        .replace(/\r/g, "")
        .split("\n")
        .map((line) => line.trim());

    const sections = {
        summary: [],
        experience: [],
        education: [],
        skills: [],
        projects: [],
        other: [],
    };

    let active = "other";
    for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line) continue;
        const normalized = line.toLowerCase().replace(/[:\-]/g, "").trim();
        // Resume templates often render headers with visual letter-spacing
        // ("S U M M A RY"), which PDF extraction reproduces literally. Also try
        // the fully space-stripped form so those still get recognized.
        const collapsed = normalized.replace(/\s+/g, "");

        if (/^(professional summary|summary|profile|objective)$/.test(normalized) || /^(professionalsummary|summary|profile|objective)$/.test(collapsed)) {
            active = "summary";
            continue;
        }
        if (/^(work experience|experience|employment|professional experience)$/.test(normalized) || /^(workexperience|experience|employment|professionalexperience)$/.test(collapsed)) {
            active = "experience";
            continue;
        }
        if (/^(education|academic background|academics)$/.test(normalized) || /^(education|academicbackground|academics)$/.test(collapsed)) {
            active = "education";
            continue;
        }
        if (/^(skills|technical skills|core skills|technologies)$/.test(normalized) || /^(skills|technicalskills|coreskills|technologies)$/.test(collapsed)) {
            active = "skills";
            continue;
        }
        if (/^(projects|project experience|personal projects)$/.test(normalized) || /^(projects|projectexperience|personalprojects)$/.test(collapsed)) {
            active = "projects";
            continue;
        }

        sections[active].push(line);
    }

    return sections;
};

const extractDateRange = (line = "") => {
    const yearPattern = /(19|20)\d{2}|present|current|now/gi;
    const found = line.match(yearPattern) || [];
    return {
        start: found[0] || "",
        end: found[1] || "",
        isCurrent: /present|current|now/i.test(line),
    };
};

const parseSkills = (lines = []) => {
    const tokenized = lines
        .join("\n")
        .split(/[,|;•\u2022\n\t]/g)
        .map((token) => token.trim())
        .filter(Boolean);

    const cleaned = [];
    const seen = new Set();
    for (const token of tokenized) {
        if (token.length < 2 || token.length > 40) continue;
        if (/^(skills?|technologies|tools)$/i.test(token)) continue;
        const key = token.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        cleaned.push(token);
        if (cleaned.length >= 30) break;
    }
    return cleaned;
};

const parseExperience = (lines = []) => {
    const entries = [];
    let current = null;

    const pushCurrent = () => {
        if (!current) return;
        if (!current.position && !current.company && !current.description) {
            current = null;
            return;
        }
        current.description = current.description.trim();
        entries.push(current);
        current = null;
    };

    for (const line of lines) {
        const isRoleLine = /\sat\s/i.test(line) || /\|/.test(line) || /\s-\s/.test(line);
        const hasDate = /(19|20)\d{2}|present|current|now/i.test(line);

        if (isRoleLine && (!current || current.description)) {
            pushCurrent();
            current = { company: "", position: "", start_date: "", end_date: "", description: "", is_current: false };

            if (/\sat\s/i.test(line)) {
                const [position, company] = line.split(/\sat\s/i);
                current.position = (position || "").trim();
                current.company = (company || "").trim();
            } else {
                const [left, right] = line.split(/\||\s-\s/);
                current.position = (left || "").trim();
                current.company = (right || "").trim();
            }
        } else if (!current) {
            current = { company: "", position: "", start_date: "", end_date: "", description: "", is_current: false };
            current.description = line;
        } else {
            current.description += `${current.description ? " " : ""}${line}`;
        }

        if (hasDate && current) {
            const range = extractDateRange(line);
            if (!current.start_date) current.start_date = range.start;
            if (!current.end_date) current.end_date = range.end;
            current.is_current = range.isCurrent;
        }
    }

    pushCurrent();
    return entries.slice(0, 6);
};

const parseEducation = (lines = []) => {
    const entries = [];
    for (const line of lines) {
        const date = extractDateRange(line).start;
        const degreeMatch = line.match(/(b\.tech|btech|b\.e|be|bsc|b\.sc|msc|m\.sc|mba|phd|high school|secondary|diploma)/i);
        const fieldMatch = line.match(/(computer science|information technology|engineering|business|science|arts|commerce)/i);

        entries.push({
            institution: line,
            degree: degreeMatch?.[0] || "",
            field: fieldMatch?.[0] || "",
            graduation_date: date || "",
            gpa: "",
        });
        if (entries.length >= 4) break;
    }
    return entries;
};

const parseProjects = (lines = []) => {
    const entries = [];
    for (const line of lines) {
        const [name, rest] = line.split(/:|\||\s-\s/);
        entries.push({
            name: (name || line).trim(),
            type: "",
            description: (rest || "").trim(),
        });
        if (entries.length >= 5) break;
    }
    return entries;
};

const buildFallbackResumeData = (resumeText = "") => {
    const text = String(resumeText || "").replace(/\r/g, "");
    const lines = text
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
    const sections = splitIntoSections(text);

    const emailMatch = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
    const phoneMatch = text.match(/(?:\+?\d[\d\s\-()]{7,}\d)/);
    const linkedInMatch = text.match(/https?:\/\/(?:www\.)?linkedin\.com\/[\w\-./?=&%]+/i);
    const allUrls = text.match(/https?:\/\/[\w\-._~:/?#[\]@!$&'()*+,;=%]+/gi) || [];
    const website = allUrls.find((url) => !/linkedin\.com/i.test(url)) || "";

    const guessedName = lines.find((line) => /^[a-zA-Z .'-]{3,60}$/.test(line) && !/@|http/i.test(line)) || lines[0] || "";
    const guessedProfession = lines.find((line) => /(developer|engineer|manager|designer|analyst|consultant|intern)/i.test(line)) || "";
    const guessedLocation = lines.find((line) => /,/.test(line) && !/@|http/i.test(line) && line.length < 80) || "";

    const summarySource = sections.summary.length ? sections.summary : sections.other.slice(0, 6);
    const summary = summarySource.join(" ").slice(0, 900);

    return {
        professional_summary: summary,
        skills: parseSkills(sections.skills),
        personal_info: {
            image: "",
            full_name: guessedName,
            profession: guessedProfession,
            email: emailMatch?.[0] || "",
            phone: phoneMatch?.[0] || "",
            location: guessedLocation,
            linkedin: linkedInMatch?.[0] || "",
            website,
        },
        experience: parseExperience(sections.experience),
        project: parseProjects(sections.projects),
        education: parseEducation(sections.education),
    };
};

// A well-formed name/profession/etc. is always short. If the AI (or a bad
// extraction upstream) dumps a huge slab of raw text into one of these
// fields, reject it and keep whatever the fallback parser or existing value
// had, rather than letting it blow up the resume preview UI.
const PERSONAL_INFO_MAX_LENGTHS = {
    image: 2000,
    full_name: 100,
    profession: 100,
    email: 100,
    phone: 40,
    location: 100,
    linkedin: 200,
    website: 200,
};

const sanitizePersonalInfo = (parsedInfo, fallbackInfo) => {
    const result = { ...(fallbackInfo || {}) };
    if (!parsedInfo || typeof parsedInfo !== "object") return result;

    for (const field of Object.keys(PERSONAL_INFO_MAX_LENGTHS)) {
        const value = parsedInfo[field];
        if (typeof value !== "string") continue;
        const trimmed = value.trim();
        if (!trimmed || trimmed.length > PERSONAL_INFO_MAX_LENGTHS[field]) continue;
        result[field] = trimmed;
    }
    return result;
};

const MAX_SUMMARY_LENGTH = 1200;

const capString = (value, maxLength) => {
    if (typeof value !== "string") return "";
    const trimmed = value.trim();
    return trimmed.length <= maxLength ? trimmed : "";
};

// Same over-long-value guard as sanitizePersonalInfo, applied to the link
// fields on each experience/project entry so a misbehaving AI response can't
// dump a huge slab of text into what should be a short URL/label.
const sanitizeEntryLinks = (entries) => {
    if (!Array.isArray(entries)) return entries;
    return entries.map((entry) => ({
        ...entry,
        link: capString(entry?.link, 500),
        link_label: capString(entry?.link_label, 100),
    }));
};

const sanitizeProfiles = (profiles) => {
    if (!Array.isArray(profiles)) return [];
    return profiles
        .map((p) => ({ label: capString(p?.label, 50), url: capString(p?.url, 500) }))
        .filter((p) => p.url)
        .slice(0, 10);
};

const normalizeImportedData = (parsedData, fallbackData) => {
    const parsed = parsedData && typeof parsedData === "object" ? parsedData : {};
    const fallback = fallbackData || buildFallbackResumeData("");

    const summary = typeof parsed.professional_summary === "string" ? parsed.professional_summary.trim() : "";
    const experience = Array.isArray(parsed.experience) && parsed.experience.length ? parsed.experience : fallback.experience;
    const project = Array.isArray(parsed.project) && parsed.project.length ? parsed.project : fallback.project;

    return {
        professional_summary: (summary && summary.length <= MAX_SUMMARY_LENGTH ? summary : "") || fallback.professional_summary || "",
        skills: Array.isArray(parsed.skills) && parsed.skills.length ? parsed.skills : fallback.skills,
        personal_info: sanitizePersonalInfo(parsed.personal_info, fallback.personal_info),
        profiles: sanitizeProfiles(parsed.profiles),
        experience: sanitizeEntryLinks(experience),
        project: sanitizeEntryLinks(project),
        education: Array.isArray(parsed.education) && parsed.education.length ? parsed.education : fallback.education,
    };
};

// controller for enhacing a resumes professional summary
// POST: /api/ai/enhance-pro-sum
export const enhanceProfessionalSummary = async (req,res) => {
    try{
        const { userContent } = req.body;

        if(!userContent){
            return res.status(400).json({message: 'Missing required fields'})
        }

        const systemPrompt = "You are an expert in resume writing. Enhance the professional summary into 1-2 compelling ATS-friendly sentences highlighting key skills, experience, and career objectives. Reply with ONLY the final enhanced summary as plain prose - no headers, no multiple options, no markdown, no bullet points, no preamble or explanation.";
        const { text: enhancedContent } = await generateTextWithGemini({
            systemPrompt,
            userPrompt: userContent,
        });

        return res.status(200).json({enhancedContent: sanitizePlainText(enhancedContent)})
    } catch (error){
        const message = error?.status
            ? `AI provider error (${error.status}): ${error.message}`
            : error.message;
        return res.status(400).json({message});
    }
}

// controller for enhancing the resume's job description
// POST: /api/ai/enhance-job-desc
export const enhanceJobDescription = async (req,res) => {
    try{
        const { userContent } = req.body;

        if(!userContent){
            return res.status(400).json({message: 'Missing required fields'})
        }

        const systemPrompt = "You are an expert in resume writing. Enhance the job description to be detailed and ATS-friendly, highlighting responsibilities, impact, and skills. Reply with ONLY the final enhanced description as plain prose - no headers, no multiple options, no markdown, no bullet points, no preamble or explanation.";
        const { text: enhancedContent } = await generateTextWithGemini({
            systemPrompt,
            userPrompt: userContent,
        });

        return res.status(200).json({enhancedContent: sanitizePlainText(enhancedContent)})
    } catch (error){
        const message = error?.status
            ? `AI provider error (${error.status}): ${error.message}`
            : error.message;
        return res.status(400).json({message});
    }
}

const serializeResumeForAts = (resumeData = {}) => {
    const lines = [];
    const info = resumeData.personal_info || {};

    if (info.profession) lines.push(`Target role/profession: ${info.profession}`);
    if (resumeData.professional_summary) lines.push(`Summary: ${resumeData.professional_summary}`);
    if (Array.isArray(resumeData.skills) && resumeData.skills.length) {
        lines.push(`Skills: ${resumeData.skills.join(', ')}`);
    }
    if (Array.isArray(resumeData.experience)) {
        for (const exp of resumeData.experience) {
            const header = [exp?.position, exp?.company].filter(Boolean).join(' at ');
            if (header || exp?.description) lines.push(`Experience - ${header}: ${exp?.description || ''}`);
        }
    }
    if (Array.isArray(resumeData.project)) {
        for (const proj of resumeData.project) {
            if (proj?.name || proj?.description) lines.push(`Project - ${proj?.name || ''}: ${proj?.description || ''}`);
        }
    }
    if (Array.isArray(resumeData.education)) {
        for (const edu of resumeData.education) {
            const header = [edu?.degree, edu?.field, edu?.institution].filter(Boolean).join(', ');
            if (header) lines.push(`Education: ${header}`);
        }
    }

    return lines.join('\n') || 'No resume content provided.';
};

// controller for scoring how well a resume matches a target job description,
// ATS-style (keyword/skill overlap), plus concrete gaps to fix
// POST: /api/ai/ats-match
export const checkAtsMatch = async (req, res) => {
    try {
        const { resumeData, jobDescription } = req.body;

        if (!jobDescription || !String(jobDescription).trim()) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const resumeText = serializeResumeForAts(resumeData);

        const systemPrompt = `You are an ATS (Applicant Tracking System) resume matching expert. Compare the given resume against the given job description and evaluate how it would score in an automated ATS keyword/skill match, plus give concrete, actionable improvements.

Respond with ONLY a JSON object in this exact shape, no extra text before or after:
{
  "matchScore": <integer 0-100>,
  "matchedKeywords": ["..."],
  "missingKeywords": ["..."],
  "suggestions": ["...", "..."]
}

Rules:
- matchScore reflects realistic ATS keyword/skill overlap, not vague enthusiasm - a resume missing most of the job's core required skills should score low even if well-written.
- matchedKeywords: specific skills/tools/qualifications from the job description that the resume already demonstrates.
- missingKeywords: specific skills/tools/qualifications the job description asks for that are absent or unclear in the resume. Use real, concrete terms taken from the job description - don't invent generic ones.
- suggestions: 3-5 short, concrete, actionable bullet points (e.g. "Add 'Kubernetes' to your skills section since it's a required qualification" not "improve your skills section").`;

        const userPrompt = `RESUME:\n${resumeText}\n\nJOB DESCRIPTION:\n${jobDescription}`;

        const { text } = await generateTextWithGemini({
            systemPrompt,
            userPrompt,
            responseMimeType: "application/json",
        });

        const parsed = parseStructuredJson(text);
        if (!parsed || typeof parsed !== 'object') {
            throw new Error('AI response did not contain valid JSON.');
        }

        const matchScore = Number.isFinite(parsed.matchScore)
            ? Math.max(0, Math.min(100, Math.round(parsed.matchScore)))
            : null;
        if (matchScore === null) {
            throw new Error('AI response did not include a valid matchScore.');
        }

        const matchedKeywords = Array.isArray(parsed.matchedKeywords)
            ? parsed.matchedKeywords.filter((k) => typeof k === 'string').slice(0, 30)
            : [];
        const missingKeywords = Array.isArray(parsed.missingKeywords)
            ? parsed.missingKeywords.filter((k) => typeof k === 'string').slice(0, 30)
            : [];
        const suggestions = Array.isArray(parsed.suggestions)
            ? parsed.suggestions.filter((s) => typeof s === 'string').slice(0, 8)
            : [];

        return res.status(200).json({ matchScore, matchedKeywords, missingKeywords, suggestions });
    } catch (error) {
        const message = error?.status
            ? `AI provider error (${error.status}): ${error.message}`
            : error.message;
        return res.status(400).json({ message });
    }
};

// controller for uploading the resume's database
// POST: /api/ai/upload-resume-db
export const uploadResumeDatabase = async (req,res) => {
    try{
        const { resumeText, title } = req.body;
        const userId = req.userId;

        if(!resumeText){
            return res.status(400).json({message: 'Missing required fields'})
        }

        const systemPrompt = `You are an expert in resume writing. Your task is to extract data from resumes and store it in a structured database format. The database should include sections such as Personal Information, Professional Summary, Work Experience, Education, Skills, Certifications, and Projects. Each section should contain relevant details extracted from the resume text. Ensure that the data is organized and easy to retrieve for future use.

Important: the input text may have inconsistent line breaks or spacing from PDF extraction. Use your judgment to identify the actual document structure regardless. Every field must contain ONLY its own specific value - full_name must be just the person's name (2-4 words), profession must be just their job title (a few words), and professional_summary must be only the summary/objective paragraph. Never copy large blocks of raw resume text into full_name, profession, or any field other than the one it actually belongs to. Split multi-line resume content into the correct experience/education/project entries instead of leaving those arrays empty.

Also extract every hyperlink and named profile mentioned in the resume:
- Any standalone profile/handle mentioned near the contact info that is not LinkedIn or a personal website/portfolio (e.g. GitHub, LeetCode, Codeforces, HackerRank, Kaggle, Twitter/X, Behance, Medium) goes into the top-level "profiles" array as { "label": "<platform name>", "url": "<full https:// URL - construct it from the handle if only a username was given, e.g. LeetCode handle "ansita20" -> "https://leetcode.com/ansita20"> }. Do not put these in linkedin or website.
- If an experience entry mentions a credential such as "Internship Completion Letter", "Offer Letter", "Certificate of Completion", etc. (with or without an actual URL attached), put the URL in that experience's "link" field and the exact label text (e.g. "Internship Completion Letter") in "link_label". If no URL is present for it, leave link/link_label empty rather than guessing one.
- If a project mentions "Link", "Live Demo", "GitHub", a repo, or a deployed URL, put the URL in that project's "link" field and a short label (e.g. "GitHub", "Live Demo") in "link_label".
- Never invent a URL that isn't present or clearly derivable from a stated handle/username in the text.`;
        const userPrompt = `extract data from this resume: ${resumeText}
        
        Provide data in the following JSON format with no additional text before or after:
        professional_summary: {type: String, default:''},
    skills: [{type: String}],
    personal_info: {
        image: {type: String, default: ''},
        full_name: {type: String, default: ''},
        profession: {type: String, default: ''},
        email: {type: String, default: ''},
        phone: {type: String, default: ''},
        location: {type: String, default: ''},
        linkedin: {type: String, default: ''},
        website: {type: String, default: ''},
    },
    profiles: [
        { label: {type: String}, url: {type: String} }
    ],
    experience: [
        {
            company: {type: String},
            position: {type: String},
            start_date: {type: String},
            end_date: {type: String},
            description: {type: String},
            is_current: {type: Boolean},
            link: {type: String, default: ''},
            link_label: {type: String, default: ''},
        }
    ],
    project:[
        {
            name: {type: String},
            type: {type: String},
            description: {type: String},
            link: {type: String, default: ''},
            link_label: {type: String, default: ''},
        }
    ],
    education: [
        {
            institution: {type: String},
            degree: {type: String},
            field: {type: String},
            graduation_date: {type: String},
            gpa: {type: String},
        }
    ],
        
        `;

        const fallbackData = buildFallbackResumeData(resumeText);
        let parsedData;
        let importMode = "ai";

        try {
            const { text: enhancedContent } = await generateTextWithGemini({
                systemPrompt,
                userPrompt,
                responseMimeType: "application/json",
            });

            const extractedJson = parseStructuredJson(enhancedContent);
            if (!extractedJson || typeof extractedJson !== "object") {
                throw new Error("AI response did not contain valid JSON.");
            }

            parsedData = normalizeImportedData(extractedJson, fallbackData);
        } catch (aiError) {
            importMode = "fallback";
            parsedData = fallbackData;
            console.error("AI parsing failed, using fallback parser:", aiError?.message || aiError);
        }

        const newResume = await Resume.create({
            userId,
            title,
            ...parsedData,
        });

        res.json({
            resumeId: newResume._id,
            importMode,
            message: importMode === "ai" ? "Resume imported successfully" : "Resume imported with basic parser",
        })
    } catch (error){
        return res.status(400).json({message: error.message});
    }
}