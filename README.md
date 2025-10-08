# 🎥 YouTube Transcript Assistant

A full-stack AI-powered app that:
- Extracts YouTube video transcripts  
- Summarizes the content using local Transformer models  
- Lets users **Ask AI** questions about the video  

---

## ⚙️ Tech Stack

### 🧠 Backend (FastAPI)
- `FastAPI`
- `transformers`
- `sentence-transformers`
- `torch`

### 💻 Frontend (React + Tailwind)
- Vite + React  
- Tailwind CSS  
- Axios  

---

## 🧩 Folder Structure
youtube-transcript-assistant/
├── backend/
│   ├── main.py
│   ├── routers/
│   ├── venv/
├── frontend/
│   ├── src/
│   ├── index.html
│   ├── package.json
└── README.md

---

## 🚀 Run Instructions

### 🧠 Backend
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload

💻 Frontend
cd frontend
npm install
npm run dev
Then open 👉 http://localhost:5173

🧠 API Endpoints
Route                                                  Description
/api/transcribe/youtube                             Fetch video transcript      
/api/ai/summary                                     Generate AI-powered video summary
/api/ai/ask                                         Ask questions about transcript

⚠️ Notes
	•	YouTube occasionally restricts transcript fetching due to rate limits or regional blocks.
	•	If you see “Transcripts unavailable,” try switching to a different network or VPN, or wait a few hours.
	•	All AI processing (summarization + Q&A) runs locally, ensuring privacy and fast performance.

💡 Features
✅ Fetch and display YouTube transcripts (auto or manual)
✅ Summarize entire video using local AI models
✅ Ask AI context-aware questions about the video
✅ Beautiful responsive UI built with Tailwind
✅ Backend built with FastAPI for lightweight performance

📦 Local Models Used
	•	Summarizer: facebook/bart-base
	•	Q&A / Semantic Search: sentence-transformers/all-MiniLM-L6-v2

👨‍💻 Developer Info

Developed by: Rajveer Choudhary
Education: B.Tech CSE — Delhi Technological University (DTU), Class of 2025
GitHub: github.com/rajveerj016

🌟 Future Plans
	•	Add authentication (Google / GitHub login)
	•	Save and view transcript history
	•	Enable YouTube API integration for automatic related video search
	•	Deploy backend on Render and frontend on Vercel for public demo

✨ *Project Status: Stable Build 5 (Local AI + Frontend Integration Complete)*  


