import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Use a generous body size limit to handle PDF base64 payloads
  app.use(express.json({ limit: "20mb" }));

  // Lazy initializer for GoogleGenAI to prevent crashing at startup if the API key is missing.
  let aiClient: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is missing. Please configure it in your Settings > Secrets panel.");
      }
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return aiClient;
  }

  // Health check API
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // Resume vs JD Comparison API
  app.post("/api/compare", async (req, res) => {
    try {
      const { resumeText, resumePdf, jdText } = req.body;

      if (!jdText || jdText.trim() === "") {
        return res.status(400).json({ error: "Job Description is required." });
      }

      const hasResume = (resumeText && resumeText.trim() !== "") || (resumePdf && resumePdf.trim() !== "");
      if (!hasResume) {
        return res.status(400).json({ error: "Resume text or Resume PDF file is required." });
      }

      // Initialize Gemini Client
      const ai = getGeminiClient();

      // Build contents array for Gemini
      const contents: any[] = [];

      if (resumePdf && resumePdf.trim() !== "") {
        // PDF base64 format usually starts with "data:application/pdf;base64,"
        const base64Data = resumePdf.replace(/^data:application\/pdf;base64,/, "");
        contents.push({
          inlineData: {
            mimeType: "application/pdf",
            data: base64Data,
          },
        });
      } else {
        contents.push({
          text: `CANDIDATE RESUME TEXT:\n${resumeText}\n`,
        });
      }

      contents.push({
        text: `TARGET JOB DESCRIPTION:\n${jdText}\n\n` +
          `INSTRUCTION: Compare the provided Resume (as text or PDF) against the Target Job Description.\n` +
          `Calculate a matching score (0-100) based on alignment of hard skills, soft skills, level of experience, and general core duties.\n` +
          `Identify matching skills, partial skills (where the resume has some background but falls short or lacks depth), and missing skills (vital in JD but not present/clear in the resume).\n` +
          `For missing skills, provide an actionable recommendation on where/how to add it, and write a professionally tailored, ready-to-use resume bullet point demonstrating that skill.\n` +
          `Identify general formatting, style, keyword, or structured improvement tips. Return the analysis inside the specified JSON schema.`
      });

      // Call Gemini 3.5-flash as recommended for basic/moderate text analysis
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction: "You are an advanced ATS (Applicant Tracking System) parser, professional recruiter, and executive career coach. Analyze the resume and job description to provide objective, precise, and highly actionable suggestions to match the resume with the JD.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: {
                type: Type.INTEGER,
                description: "ATS matching percentage score (0 to 100) indicating alignment of resume with job description requirements."
              },
              jobTitle: {
                type: Type.STRING,
                description: "The job title extracted from the job description."
              },
              summary: {
                type: Type.STRING,
                description: "A professional 2-3 sentence executive summary explaining the candidate's alignment, core strengths, and major qualification gaps for this role."
              },
              matchingSkills: {
                type: Type.ARRAY,
                description: "Primary skills/keywords found in both the job description and the resume.",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING, description: "Name of the matching skill/keyword." },
                    importance: { type: Type.STRING, enum: ["High", "Medium", "Low"], description: "The skill's importance to the target job." }
                  },
                  required: ["name", "importance"]
                }
              },
              missingSkills: {
                type: Type.ARRAY,
                description: "Crucial skills, technologies, or concepts explicitly required in the JD but entirely or mostly missing in the resume.",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING, description: "Name of the missing skill/keyword." },
                    importance: { type: Type.STRING, enum: ["High", "Medium", "Low"], description: "How critical this skill is for the JD." },
                    recommendation: { type: Type.STRING, description: "Specific instruction on where to integrate this skill (e.g., 'Add to Skills section', 'Incorporate into your recent project under XYZ company')." },
                    suggestedBullet: { type: Type.STRING, description: "A high-impact, professionally written resume bullet point showing hands-on experience using this missing skill, tailored for a standard career history." }
                  },
                  required: ["name", "importance", "recommendation", "suggestedBullet"]
                }
              },
              partialSkills: {
                type: Type.ARRAY,
                description: "Skills or experience mentioned in the resume but lacking the depth, scope, scale, or duration specified in the JD.",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING, description: "Name of the skill with partial match." },
                    gap: { type: Type.STRING, description: "The gap identified between the resume's mention and the JD requirements (e.g., 'Requires 5+ years of Python; resume only lists basic scripting')." },
                    recommendation: { type: Type.STRING, description: "How to elaborate or modify current resume details to close this gap." }
                  },
                  required: ["name", "gap", "recommendation"]
                }
              },
              improvementTips: {
                type: Type.ARRAY,
                description: "General actionable tips for resume optimization.",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    category: { type: Type.STRING, enum: ["Formatting", "Experience", "Projects", "Keywords", "Education"], description: "The area of improvement." },
                    tip: { type: Type.STRING, description: "Clear, helpful resume enhancement advice." },
                    impact: { type: Type.STRING, enum: ["High", "Medium", "Low"], description: "Potential impact of this correction on ATS rating or recruiter screening." }
                  },
                  required: ["category", "tip", "impact"]
                }
              }
            },
            required: ["score", "jobTitle", "summary", "matchingSkills", "missingSkills", "partialSkills", "improvementTips"]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("No response received from the Gemini analysis engine.");
      }

      // Parse the JSON returned by Gemini
      const analysisResult = JSON.parse(responseText.trim());
      res.json(analysisResult);

    } catch (error: any) {
      console.error("Comparison Error:", error);
      res.status(500).json({
        error: error.message || "An unexpected error occurred during resume analysis."
      });
    }
  });

  // Serve static files in production / Vite middleware in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
