import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { enhanceProfessionalSummary, enhanceJobDescription, uploadResumeDatabase } from "../controllers/aiController.js";

const aiRouter = express.Router();

aiRouter.post('/enhance-pro-sum', protect, enhanceProfessionalSummary);
aiRouter.post('/enhance-job-desc', protect, enhanceJobDescription);
aiRouter.post('/generate-resume', protect, uploadResumeDatabase);

export default aiRouter;