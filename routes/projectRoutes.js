import express from "express";
import { createProject, getAllProjects, getAllProjectsNames } from "../controller/projectController.js";


const router = express.Router();

router.post('/',createProject);
router.get('/',getAllProjects);
router.get('/names',getAllProjectsNames);

export default router;