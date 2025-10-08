# backend/routes/ai_insights.py
from fastapi import APIRouter, HTTPException
from transformers import pipeline
summarizer = None  # disable model to reduce memory
from sentence_transformers import SentenceTransformer, util

router = APIRouter()

# --- load models once at startup ---
summary_model = pipeline("summarization", model="facebook/bart-base")
embedder = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

@router.post("/summary")
async def generate_summary(payload: dict):
    text = payload.get("text", "").strip()
    if not text:
        raise HTTPException(status_code=400, detail="Missing text")
    try:
        result = summary_model(text[:3000], max_length=150, min_length=40, do_sample=False)
        return {"summary": result[0]["summary_text"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/ask")
async def ask_ai(payload: dict):
    question = payload.get("question", "").strip()
    transcript = payload.get("transcript", [])
    if not question or not transcript:
        raise HTTPException(status_code=400, detail="Missing question or transcript")

    try:
        sentences = [seg["text"] for seg in transcript]
        corpus_emb = embedder.encode(sentences, convert_to_tensor=True)
        q_emb = embedder.encode(question, convert_to_tensor=True)
        scores = util.cos_sim(q_emb, corpus_emb)[0]
        best_idx = int(scores.argmax())
        return {"answer": sentences[best_idx]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))