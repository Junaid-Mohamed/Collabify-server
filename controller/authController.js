import bcrypt from "bcrypt";
import User from "../models/user.models.js";

import JWTService from "../services/JWTService.js";

export const signUp = async(req,res) =>{
    const {name,email,password} = req.body;
    try{
        let userInDb = await User.findOne({email});
        if(userInDb){
            res.status(409).json({error:"Email already exist, please login or use another email."})
            return;
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = new User({name,email,password:hashedPassword})
        await newUser.save();
        res.status(200).json({message:"User signed up successfully."})
    }catch(error){
        res.status(500).json({error:'Something went wrong while registering user ',error})
    }
}

export const login = async(req,res)=>{
    const {email,password} = req.body;
    try{
        //  check for user, if found, verify the password
        const user = await User.findOne({email});
        if(user){
            const isPasswordValid = await bcrypt.compare(password,user.password);
            if(!isPasswordValid){
                res.status(401).json({message:"Password Invalid"});
                return
            }
            const JWTtoken = JWTService.generateToken(email,user.name);
            res.status(200).json(JWTtoken);
            return;
        }   
        res.status(404).json({message:'User with email provided not exists, please signup'});
    }catch(error){
        res.status(500).json({error:'Something went wrong while logging in user',error})
    }
}

export const getUserDetails = async(req,res)=>{
    try{
        const {email,name} = req;
        res.status(200).json({email,name});
    }catch(error){
        res.status(401).json({error:"not authenticated"})
    }
}

export const getAllUsers = async(req,res)=>{
    try{
        const allUsers = await User.find();
        res.status(200).json(allUsers);
    }catch(error){
        res.status(401).json({error:"not authenticated"})
    }
}

export const getAllUserNames = async(req,res)=>{
    try{
        const allUsers = await User.find();
        res.status(200).json(allUsers.map(user=>user.name));
    }catch(error){
        res.status(401).json({error:"not authenticated"})
    }
}
