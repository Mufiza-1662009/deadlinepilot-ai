# DeadlinePilot AI

## Overview
DeadlinePilot AI is an AI-powered productivity companion built using Google AI Studio and Gemini. It helps users manage deadlines, analyze workload pressure, prioritize tasks intelligently, and generate real-time AI-driven rescue plans when deadlines become critical.

The system moves beyond traditional to-do lists by acting as an intelligent decision-making assistant that actively guides users toward completing tasks efficiently under time constraints.

---

## Problem Statement
Modern students and professionals frequently struggle with:
- Missed deadlines
- Poor task prioritization
- Overloaded schedules
- Lack of real-time planning support

Traditional reminder apps only notify users but do not help them decide what to do first or how to manage workload pressure.

DeadlinePilot AI solves this gap using intelligent AI-driven planning.

---

## Solution
DeadlinePilot AI introduces a real-time AI productivity engine that:
- Analyzes user workload
- Evaluates deadline urgency
- Calculates completion probability
- Generates structured rescue plans
- Provides intelligent scheduling suggestions

It acts as a decision-making layer between tasks and execution.

---

## Key Features

**1. AI Workload Analysis**
- Evaluates total workload vs available time
- Detects overload situations

**2. Deadline Risk Prediction**
- Classifies tasks into Safe, Elevated, or Critical risk states

**3. Intelligent Task Prioritization**
- Automatically ranks tasks based on urgency and importance

**4. AI Rescue Planning**
- Generates optimized action plans under time constraints

**5. Productivity Dashboard**
- Centralized view of all tasks and AI insights

**6. Mission Control Metrics**
- Displays completion probability and productivity scoring

**7. Real-Time Gemini Integration**
- Uses Google Gemini (via AI Studio backend) for live reasoning

---

## Google Technologies Used
- Google AI Studio
- Gemini AI Model (server-side integration)
- Google Cloud Run (deployment)

---

## Tech Stack
- Frontend: HTML, CSS, JavaScript / React (AI Studio generated)
- Backend: Node.js / Serverless API (server.ts)
- AI Engine: Gemini API
- Deployment: Google Cloud Run

---

## Architecture

The system follows a simple request-response pipeline where the frontend sends task data to the backend, which processes it using Gemini and returns structured AI insights.

<img width="1419" height="472" alt="VPJDRjim3CVl1lmEH4uTXYI7OTUXMTCK0Rh1IDO7u6GYqIfBhaG5y8Qz--YuNvFbt2poJ_8dal9rOFGS6rCMhDaGh0bheorLsZY6rHRciEy2KmChhuwQIN7qL1PbWOgTXuT0lZzvSQ0zI8RPnZlBP6kusf68u2CyR66DuVZJeQy_pE1FMG0erxJEacMO_S3m25lRHeQDyyqiSLV" src="https://github.com/user-attachments/assets/e3328883-d0cd-46f7-8a47-9cfecb4172df" />


---

## System Flow

1. User creates tasks in dashboard  
2. User clicks "Analyze & Rescue"  
3. System sends workload data to backend  
4. Gemini processes task priority + deadlines  
5. AI returns structured decision report  
6. Dashboard renders:
   - Mission Brief
   - Risk Level
   - Priority Plan
   - Completion Probability
   - Rescue Strategy

---

## Impact
DeadlinePilot AI improves productivity by:
- Reducing decision fatigue
- Preventing deadline failures
- Optimizing task execution order
- Providing actionable AI-driven planning instead of passive reminders

---

## Deployment Link
https://deadlinepilot-ai-647029003808.asia-southeast1.run.app

---

## Take a Look!
<img width="950" height="429" alt="Screenshot 2026-06-26 220018" src="https://github.com/user-attachments/assets/c46e9bc1-383e-4dd1-9f74-86cb1150e9fd" />
<img width="953" height="412" alt="Screenshot 2026-06-26 220032" src="https://github.com/user-attachments/assets/bdd629bd-4775-46bc-a3f9-e12eecdb6bc4" />
<img width="953" height="428" alt="Screenshot 2026-06-26 220043" src="https://github.com/user-attachments/assets/5ce788ef-5a3b-4ce4-a6d8-72912ce65f68" />
<img width="226" height="282" alt="Screenshot 2026-06-26 220138" src="https://github.com/user-attachments/assets/86d144f4-ace9-41e7-9a44-919f4b8fc02f" />
<img width="270" height="334" alt="Screenshot 2026-06-26 220321" src="https://github.com/user-attachments/assets/4d6a3c12-a933-4b58-8355-0e5f1275bbb1" />
<img width="460" height="179" alt="Screenshot 2026-06-26 220335" src="https://github.com/user-attachments/assets/32c8978b-cc20-4483-b8d7-70fff9499e3a" />
<img width="453" height="197" alt="Screenshot 2026-06-26 220346" src="https://github.com/user-attachments/assets/6745977a-9942-4542-92f2-5a4f9baf87b9" />
<img width="172" height="108" alt="Screenshot 2026-06-26 220449" src="https://github.com/user-attachments/assets/134795ed-2fdf-4e9c-8c96-8f1025ce68d1" />
<img width="178" height="315" alt="Screenshot 2026-06-26 220500" src="https://github.com/user-attachments/assets/a49ca1c3-47dc-46f4-91b4-1598c7671bde" />
<img width="421" height="262" alt="Screenshot 2026-06-26 220617" src="https://github.com/user-attachments/assets/56b85b5a-9707-4dbb-b886-d18d78021908" />
<img width="205" height="282" alt="Screenshot 2026-06-26 220636" src="https://github.com/user-attachments/assets/54179704-8b73-418d-8f06-4fbcb8412756" />
<img width="156" height="366" alt="Screenshot 2026-06-26 220704" src="https://github.com/user-attachments/assets/1f0a03d6-a714-4546-b445-e24da3fd1095" />

---

## Future Improvements
- Calendar integration
- Voice-based task input
- Mobile application
- Team collaboration mode
- Smart notification system

---

## Author
Built as part of Vibe2Ship Hackathon using Google AI Studio
