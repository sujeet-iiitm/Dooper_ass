import express from "express";
import axios from "axios";
import dotenv from 'dotenv';
dotenv.config();
import type { Request, Response } from 'express';
import { chatRateLimiter, verifyToken } from "../middlewares/userMiddlewares.js";
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { Router } from 'express';
const router = Router();

// helper function for exponential backoff
async function callGeminiWithRetry(prompt: string) {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("No text returned from Gemini");

    return text;

  } catch (error: any) {
    console.error("Gemini API error:", error.response?.data || error.message);
    throw new Error("Gemini API failed after retries");
  }
}


// /api/chat/generate
router.post("/generate", verifyToken, chatRateLimiter ,async (req: Request, res: Response) => {
  const { prompt } = req.body;
  console.log(prompt)
  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  try {
    const reply: string = await callGeminiWithRetry(prompt);
    res.json({ reply });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
