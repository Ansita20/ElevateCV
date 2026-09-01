const CITYFIT_BRIDGE_URL = (process.env.CITYFIT_BRIDGE_URL || "").replace(/\/$/, "");
const CITYFIT_BRIDGE_TOKEN = process.env.CITYFIT_BRIDGE_TOKEN;

// Best-effort total years of experience from free-text start/end dates
// (resumes don't store these as real dates, just whatever text the user
// typed or an AI import extracted, so this is an estimate, not a fact).
const YEAR_PATTERN = /(19|20)\d{2}/;

const parseYear = (value) => {
    const match = String(value || "").match(YEAR_PATTERN);
    return match ? Number(match[0]) : null;
};

const estimateYearsOfExperience = (experience = []) => {
    const currentYear = new Date().getFullYear();
    let totalYears = 0;

    for (const entry of experience) {
        const startYear = parseYear(entry?.start_date);
        if (!startYear) continue;

        const isOngoing = entry?.is_current || /present|current|now/i.test(entry?.end_date || "");
        const endYear = isOngoing ? currentYear : parseYear(entry?.end_date) || startYear;

        const span = endYear - startYear;
        if (span > 0) totalYears += span;
    }

    return Math.min(60, Math.round(totalYears));
};

// controller for finding which cities best match a resume's skills/role,
// via CityFit's job-market dataset (3500+ listings scraped weekly)
// POST: /api/cityfit/match-cities
export const matchCities = async (req, res) => {
    try {
        if (!CITYFIT_BRIDGE_URL || !CITYFIT_BRIDGE_TOKEN) {
            return res.status(503).json({ message: "City matching is not configured on this server." });
        }

        const { resumeData, homeCity } = req.body;
        if (!resumeData) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const profile = {
            skills: Array.isArray(resumeData.skills) ? resumeData.skills.slice(0, 100) : [],
            years: estimateYearsOfExperience(resumeData.experience),
            targetRole: resumeData?.personal_info?.profession || "",
            homeCity: homeCity || resumeData?.personal_info?.location || null,
        };

        const response = await fetch(`${CITYFIT_BRIDGE_URL}/api/public/match-cities`, {
            method: "POST",
            headers: {
                "x-bridge-token": CITYFIT_BRIDGE_TOKEN,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(profile),
        });

        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({}));
            return res.status(502).json({ message: errorBody?.error || "City matching service returned an error." });
        }

        const { report } = await response.json();
        return res.status(200).json({ report });
    } catch (error) {
        console.error("City matching request failed:", error.message);
        return res.status(502).json({ message: "Could not reach the city matching service." });
    }
};
