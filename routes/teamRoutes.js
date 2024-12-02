import express from "express";
import { createTeam, getAllTeam, getAllTeamNames } from "../controller/teamController.js";

const router = express.Router();

router.post('/',createTeam);
router.get('/',getAllTeam);
router.get('/names',getAllTeamNames);

export default router;