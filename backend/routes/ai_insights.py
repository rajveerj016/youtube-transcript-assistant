from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from transformers import pipeline
from sentence_transformers import SentenceTransformer, util
import torch

router = APIRouter()

# ✅ Load summarization and embedding models
try:
    summarizer = pipeline("summarization", model="facebook/bart-base")
    embedder = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
except Exception as e:
    raise RuntimeError(f"Model loading failed: {e}")

class TextRequest(BaseModel):
    text: str

class AskRequest(BaseModel):
    question: str
    context: str

# 🎯 Summarize video transcript
@router.post("/summary")
async def summarize_text(request: TextRequest):
    try:
        if not request.text.strip():
            raise HTTPException(status_code=400, detail="Text cannot be empty")

        text = request.text.strip()
        summary = summarizer(text, max_length=130, min_length=30, do_sample=False)
        return {"summary": summary[0]["summary_text"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 🤖 Ask AI a question about the transcript
@router.post("/ask")
async def ask_ai(request: AskRequest):
    try:
        if not request.context.strip():
            raise HTTPException(status_code=400, detail="Context cannot be empty")
        if not request.question.strip():
            raise HTTPException(status_code=400, detail="Question cannot be empty")

        # Embed question and context
        context_sentences = request.context.split(". ")
        context_embeddings = embedder.encode(context_sentences, convert_to_tensor=True)
        question_embedding = embedder.encode(request.question, convert_to_tensor=True)

        # Find best matching sentence from transcript
        similarities = util.pytorch_cos_sim(question_embedding, context_embeddings)
        best_idx = torch.argmax(similarities).item()
        best_sentence = context_sentences[best_idx]

        return {"answer": best_sentence}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))