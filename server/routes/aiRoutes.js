import express from "express";
import protect from "../middlewares/authMiddleware.js";
import rateLimitAI from "../middlewares/throttleMiddleware.js";
import { enhanceProfessionalSummary, enhanceJobDescription, uploadResumeDatabase, checkAtsMatch } from "../controllers/aiController.js";

const aiRouter = express.Router();

aiRouter.post('/enhance-pro-sum', protect, rateLimitAI, enhanceProfessionalSummary);
aiRouter.post('/enhance-job-desc', protect, rateLimitAI, enhanceJobDescription);
aiRouter.post('/generate-resume', protect, rateLimitAI, uploadResumeDatabase);
aiRouter.post('/ats-match', protect, rateLimitAI, checkAtsMatch);

export default aiRouter;