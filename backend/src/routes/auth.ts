import dotenv from 'dotenv';
dotenv.config();
import type { Request, Response } from 'express';
import { verifyToken } from "../middlewares/userMiddlewares.js";
import jwt, {type JwtPayload } from 'jsonwebtoken';
import { application, Router } from 'express';
const router = Router();

dotenv.config();

router.post("/login", (req : Request, res : Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({message : "Please enter email and both both !.."})
  }
  const token = jwt.sign({ email }, process.env.JWT_SECRET || "abf#md$115%*(@d", { expiresIn: "1h" });
  res.cookie("token", token, {
     httpOnly: false,
     secure: false,
     sameSite: 'lax',
     maxAge: 1 * 60 * 60 * 1000,
     path : '/'
     });
  return res.json({
    message: "Login successful!",
  });
});

router.post("/logout", (req : Request, res : Response) => {
  res.clearCookie("token", {
    httpOnly: false,
    secure: false,
    sameSite: "lax",
    path: "/",
  });
  return res.status(200).json({ message: "Logged out successfully" });
});



export default router;