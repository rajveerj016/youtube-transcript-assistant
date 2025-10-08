# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import routes
from routes.youtube_transcript import router as yt_router
from routes.ai_insights import router as ai_router

app = FastAPI()

# Enable CORS so frontend can call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routes
app.include_router(yt_router, prefix="/api")
app.include_router(ai_router, prefix="/api/ai")

@app.get("/")
def home():
    return {"message": "Backend is working perfectly!"}