import JWTService from "../services/JWTService.js";

export const verifyToken = (req,res,next) => { 
    try{
        const token = req.headers.authorization?.split(" ")[1];
        if(!token){
            res.status(401).json({message:"No token found"});
            return;
        }
        const {name,email} = JWTService.verifyToken(token);
        req.email=email;
        req.name=name;
        next();
    }catch(error){
        res.status(500).json({error:"Failed to authenticate token, please login again."})
    }
}