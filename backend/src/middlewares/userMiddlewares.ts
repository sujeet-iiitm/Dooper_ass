import dotenv from 'dotenv';
dotenv.config();
import type { Request , Response, NextFunction } from 'express';
import jwt, {type JwtPayload } from "jsonwebtoken";
import rateLimit from 'express-rate-limit';


export const verifyToken = async(req:Request, res:Response, next:NextFunction) => {
  const token = req.cookies?.token;
  console.log(token)
  const jwt_secret_key = process.env.JWT_SECRET || "abf#md$115%*(@d";
  if(!token){
    return res.status(401).json({message: "Unauthorized - No token provided"});
  }
  try {
    const decoded = jwt.verify(token, jwt_secret_key as string) as JwtPayload;
    if(decoded)
      next();
  } catch(error){
      return res.status(401).json({ message : 'Token Expired -or- Invalid token' });
    }
};

export const chatRateLimiter = rateLimit({
    windowMs: 1 * 60 * 60 * 1000,
    max: 25,
    message: {
        error: 'Donot bother the API'
    },
    standardHeaders: true, //new-one
    legacyHeaders: false, //old-ones
    handler: (req : Request, res : Response) => {
        console.log("Rate limit exceeded for your IP");
        res.status(429).json({ error: "Too many Password Saving attempts. Please try again later." });
    }
});