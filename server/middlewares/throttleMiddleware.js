// Rate-limits Gemini-backed AI routes via the Throttle service (rlk_ project
// API key), keyed per logged-in user so one user's usage can't exhaust
// everyone else's Gemini quota.

const THROTTLE_URL = process.env.THROTTLE_API_URL || "http://localhost:4000";
const THROTTLE_API_KEY = process.env.THROTTLE_API_KEY;

if (!THROTTLE_API_KEY) {
    console.warn("Throttle API key is not configured. Set THROTTLE_API_KEY to rate-limit Gemini calls.");
}

// If Throttle itself is unreachable or misconfigured, fail open (let the
// request through) rather than taking down every AI feature over a
// third-party outage — worst case we temporarily lose the rate limit.
const rateLimitAI = async (req, res, next) => {
    if (!THROTTLE_API_KEY) return next();

    const identifier = req.userId || req.ip;

    try {
        const response = await fetch(`${THROTTLE_URL}/v1/check`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${THROTTLE_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ identifier }),
        });

        if (response.status === 429) {
            return res.status(429).json({ message: "Too many AI requests — please slow down and try again shortly." });
        }

        if (!response.ok) {
            console.error(`Throttle check failed with status ${response.status}`);
            return next();
        }

        const data = await response.json();
        if (data.allowed === false) {
            return res.status(429).json({ message: "Too many AI requests — please slow down and try again shortly." });
        }

        return next();
    } catch (error) {
        console.error("Throttle check request failed:", error.message);
        return next();
    }
};

export default rateLimitAI;
