import { reportClosedTasks, taskCompletedLastWeek, taskPending } from "../controller/reportController.js";

import express from "express";

const router = express.Router();

router.get('/last-week',taskCompletedLastWeek)
router.get('/pending',taskPending)
router.get('/closed-tasks',reportClosedTasks)

export default router;