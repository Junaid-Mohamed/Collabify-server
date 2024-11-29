import JWT from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

class JWTService{
    static generateToken(email,name){
        const payload  = {email,name}

        if(!JWT_SECRET){
            throw new Error('JWT_SECRET is not found in env')
        }

        const JWTtoken = JWT.sign(payload,JWT_SECRET,{expiresIn:'2h'})
        return JWTtoken;

    }

    static verifyToken(token){
        return JWT.verify(token,JWT_SECRET)
    }

}

export default JWTService;