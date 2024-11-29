import express from "express";
import { createTag, getAllTags } from "../controller/tagController.js";

const router = express.Router();

router.post('/',createTag);
router.get('/',getAllTags);

export default router;