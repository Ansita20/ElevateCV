import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { matchCities } from "../controllers/cityfitController.js";

const cityfitRouter = express.Router();

cityfitRouter.post('/match-cities', protect, matchCities);

export default cityfitRouter;
