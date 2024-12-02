import express from "express";
import { createTag, getAllTagNames, getAllTags } from "../controller/tagController.js";

const router = express.Router();

router.post('/',createTag);
router.get('/',getAllTags);
router.get('/names',getAllTagNames);

export default router;