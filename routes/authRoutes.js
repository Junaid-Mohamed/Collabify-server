import express from "express";
import { getAllUsers, getUserDetails, login, signUp } from "../controller/authController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get('/',(req,res)=>res.send('auth route'))

router.post('/signup',signUp);
router.post('/login',login);
router.get('/me',verifyToken,getUserDetails)
router.get('/users',verifyToken,getAllUsers)


export default router;