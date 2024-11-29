import express from "express";
import { createTeam, getAllTeam } from "../controller/teamController.js";

const router = express.Router();

router.post('/',createTeam);
router.get('/',getAllTeam);

export default router;