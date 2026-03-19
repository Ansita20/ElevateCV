import Resume from "../models/Resume.js";
import { generateTextWithGemini } from "../configs/ai.js";

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

        if (/^(professional summary|summary|profile|objective)$/.test(normalized)) {
            active = "summary";
            continue;
        }
        if (/^(work experience|experience|employment|professional experience)$/.test(normalized)) {
            active = "experience";
            continue;
        }
        if (/^(education|academic background|academics)$/.test(normalized)) {
            active = "education";
            continue;
        }
        if (/^(skills|technical skills|core skills|technologies)$/.test(normalized)) {
            active = "skills";
            continue;
        }
        if (/^(projects|project experience|personal projects)$/.test(normalized)) {
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

const normalizeImportedData = (parsedData, fallbackData) => {
    const parsed = parsedData && typeof parsedData === "object" ? parsedData : {};
    const fallback = fallbackData || buildFallbackResumeData("");

    return {
        professional_summary: parsed.professional_summary || fallback.professional_summary || "",
        skills: Array.isArray(parsed.skills) && parsed.skills.length ? parsed.skills : fallback.skills,
        personal_info: {
            ...(fallback.personal_info || {}),
            ...((parsed.personal_info && typeof parsed.personal_info === "object") ? parsed.personal_info : {}),
        },
        experience: Array.isArray(parsed.experience) && parsed.experience.length ? parsed.experience : fallback.experience,
        project: Array.isArray(parsed.project) && parsed.project.length ? parsed.project : fallback.project,
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

        const systemPrompt = "You are an expert in resume writing. Enhance the professional summary into 1-2 compelling ATS-friendly sentences highlighting key skills, experience, and career objectives. Return only plain text.";
        const { text: enhancedContent } = await generateTextWithGemini({
            systemPrompt,
            userPrompt: userContent,
        });

        return res.status(200).json({enhancedContent})
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

        const systemPrompt = "You are an expert in resume writing. Enhance the job description to be detailed and ATS-friendly, highlighting responsibilities, impact, and skills. Return only plain text.";
        const { text: enhancedContent } = await generateTextWithGemini({
            systemPrompt,
            userPrompt: userContent,
        });

        return res.status(200).json({enhancedContent})
    } catch (error){
        const message = error?.status
            ? `AI provider error (${error.status}): ${error.message}`
            : error.message;
        return res.status(400).json({message});
    }
}

// controller for uploading the resume's database
// POST: /api/ai/upload-resume-db
export const uploadResumeDatabase = async (req,res) => {
    try{
        const { resumeText, title } = req.body;
        const userId = req.userId;

        if(!resumeText){
            return res.status(400).json({message: 'Missing required fields'})
        }

        const systemPrompt = `You are an expert in resume writing. Your task is to extract data from resumes and store it in a structured database format. The database should include sections such as Personal Information, Professional Summary, Work Experience, Education, Skills, Certifications, and Projects. Each section should contain relevant details extracted from the resume text. Ensure that the data is organized and easy to retrieve for future use.`;
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
    experience: [
        {
            company: {type: String},
            position: {type: String},
            start_date: {type: String},
            end_date: {type: String},
            description: {type: String},
            is_current: {type: Boolean},
        }
    ],
    project:[
        {
            name: {type: String},
            type: {type: String},
            description: {type: String},
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
            parsedData = normalizeImportedData(JSON.parse(enhancedContent), fallbackData);
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