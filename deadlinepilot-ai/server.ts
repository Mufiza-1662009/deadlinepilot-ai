import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

let aiClient: GoogleGenAI | null = null;

function getGeminiAI(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// DeadlinePilot AI workload analysis endpoint
app.post("/api/analyze", async (req, res) => {
  try {
    const { tasks, availableHoursToday, emergencyMode } = req.body;

    if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
      return res.status(400).json({ error: "Tasks list cannot be empty." });
    }

    const ai = getGeminiAI();

    // Prepare text prompt with current details
    const currentTimeStr = new Date().toLocaleString("en-US", { timeZoneName: "short" });
    const tasksDetails = tasks
      .map((t, index) => {
        return `- Task ${index + 1}: "${t.name}"
  Deadline: ${t.deadline}
  Estimated Hours needed: ${t.estimatedHours}h
  Importance Level: ${t.importance}
`;
      })
      .join("\n");

    const prompt = `You are DeadlinePilot AI, an elite, highly analytical productivity and rescue companion.
Analyze the user's current task workload and deadlines to identify scheduling conflicts, estimate delivery risk, and draft a high-fidelity rescue action plan.

Current System Time: ${currentTimeStr}
Available Hours Today: ${availableHoursToday} hours
Emergency Rescue Mode Active: ${emergencyMode ? "YES (CRITICAL BURNOUT OR DEADLINE RISK DECLARED)" : "NO"}

Tasks list to analyze:
${tasksDetails}

Guidelines for analysis:
1. Assess the total work hours required vs the time left before each deadline.
2. Calculate the success probability and set the overall risk level ('Safe', 'Elevated', or 'Critical'). If total hours exceed realistic available hours, or if deadlines are within 24-48 hours, raise the risk level appropriately.
3. If Emergency Rescue Mode is active (YES), formulate an aggressive productivity action plan. This should emphasize ruthless prioritization, aggressive scope-cutting (de-scoping features), direct tips on negotiating deadlines, and immediate rapid-response actions.
4. Construct an 'aiDecisionLog' representing the step-by-step decision logs of the DeadlinePilot's reasoning. EXPLAIN EXACTLY WHY each decision was made! Each log entry MUST follow the strict template format: "Decision: [specific decision] | Reason: [why selected] | Expected Impact: [predicted benefit]". Do not deviate from this template format.
5. Calculate a 'productivityScore' (0 to 100) representing how optimized their current task flow is based on deadline spacing and focus buffers.
6. Isolate the 'highestPriorityTaskName' accurately.
7. Generate an 'emergencyReport' object containing precise parameters summarizing the recovery plan, biggest risk, saved hours, tasks to complete today, and tasks to delay.
8. Generate a concise "Mission Brief" (2-3 sentences) summarizing the user's situation and the AI's overall strategy to handle the workload.
9. Generate an "If You Ignore This Plan" section that briefly explains the likely consequences of not following the recommended schedule.
10. Generate an "AI Confidence" section showing a percentage and one sentence explaining how confident you are in your recommendations based on the provided information.
11. You MUST NEVER simply list tasks. You must actively prioritize, explain trade-offs, and recommend postponing lower-impact work when appropriate. Keep responses concise, professional, and action-oriented.

Return the response in the specified JSON schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are the advanced server-side backend of DeadlinePilot AI. You always respond in precise, valid JSON format matching the schema requested.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            workloadSummary: {
              type: Type.STRING,
              description: "A concise 1-2 sentence high-level summary of the workload status, written in a sharp, professional tone.",
            },
            riskLevel: {
              type: Type.STRING,
              description: "Must be exactly 'Safe', 'Elevated', or 'Critical'.",
            },
            successProbability: {
              type: Type.INTEGER,
              description: "Percentage value from 0 to 100 indicating delivery likelihood.",
            },
            productivityScore: {
              type: Type.INTEGER,
              description: "Optimality rating from 0 to 100 of current workloads.",
            },
            highestPriorityTaskName: {
              type: Type.STRING,
              description: "Exactly which task is the #1 critical item.",
            },
            priorityRanking: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  taskName: { type: Type.STRING },
                  priorityScore: { type: Type.INTEGER, description: "A relative priority score from 1 to 10." },
                  reason: { type: Type.STRING, description: "Why this task occupies this precise slot in the sequence." },
                },
                required: ["taskName", "priorityScore", "reason"],
              },
            },
            aiDecisionLog: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Logs showing step-by-step reasoning explaining WHY each decision or recommendation was made. Format of each entry MUST be: 'Decision: [specific decision] | Reason: [why selected] | Expected Impact: [predicted benefit]'.",
            },
            personalizedRescuePlan: {
              type: Type.STRING,
              description: "Actionable strategic advice tailored to the workload and Emergency Mode status.",
            },
            missionBrief: {
              type: Type.STRING,
              description: "A concise 2-3 sentence overview at the very top of the analysis summarizing the user's situation and the AI's overall strategy.",
            },
            ifYouIgnoreThisPlan: {
              type: Type.STRING,
              description: "A brief, impact-focused assessment explaining the likely consequences of not following the recommended schedule.",
            },
            aiConfidence: {
              type: Type.OBJECT,
              properties: {
                percentage: { type: Type.INTEGER, description: "AI confidence percentage from 0 to 100." },
                reasoning: { type: Type.STRING, description: "A concise sentence explaining the confidence score." },
              },
              required: ["percentage", "reasoning"],
            },
            emergencyReport: {
              type: Type.OBJECT,
              properties: {
                biggestRisk: { type: Type.STRING },
                recoveryStrategy: { type: Type.STRING },
                tasksToCompleteToday: { type: Type.ARRAY, items: { type: Type.STRING } },
                tasksToDelay: { type: Type.ARRAY, items: { type: Type.STRING } },
                timeSavedHours: { type: Type.NUMBER },
                expectedSuccessProbabilityAfterRescue: { type: Type.INTEGER },
              },
              required: [
                "biggestRisk",
                "recoveryStrategy",
                "tasksToCompleteToday",
                "tasksToDelay",
                "timeSavedHours",
                "expectedSuccessProbabilityAfterRescue"
              ]
            },
            todayActionPlan: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  timeSlot: { type: Type.STRING, description: "Chronological time period, e.g. '09:00 - 11:30' or 'Evening Segment'." },
                  taskName: { type: Type.STRING },
                  allocatedHours: { type: Type.NUMBER, description: "Hours to spend." },
                  actionDescription: { type: Type.STRING, description: "Specific instructions on what to accomplish." },
                },
                required: ["timeSlot", "taskName", "allocatedHours", "actionDescription"],
              },
            },
            tomorrowActionPlan: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  timeSlot: { type: Type.STRING, description: "Chronological time period." },
                  taskName: { type: Type.STRING },
                  allocatedHours: { type: Type.NUMBER },
                  actionDescription: { type: Type.STRING },
                },
                required: ["timeSlot", "taskName", "allocatedHours", "actionDescription"],
              },
            },
          },
          required: [
            "workloadSummary",
            "riskLevel",
            "successProbability",
            "productivityScore",
            "highestPriorityTaskName",
            "priorityRanking",
            "aiDecisionLog",
            "personalizedRescuePlan",
            "missionBrief",
            "ifYouIgnoreThisPlan",
            "aiConfidence",
            "todayActionPlan",
            "tomorrowActionPlan",
          ],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Empty response from Gemini AI.");
    }

    const data = JSON.parse(resultText);
    res.json(data);
  } catch (error: any) {
    console.error("Analysis Error:", error);
    res.status(500).json({
      error: "DeadlinePilot AI Engine failed to analyze your workload.",
      details: error.message || String(error),
    });
  }
});

// Configure Vite or Static Asset Serving
async function startServer() {
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
    console.log(`DeadlinePilot AI Server running on http://localhost:${PORT}`);
  });
}

startServer();
