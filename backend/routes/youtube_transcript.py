from fastapi import APIRouter, HTTPException
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound, CouldNotRetrieveTranscript
import re

router = APIRouter()

def format_time(seconds: float) -> str:
    """Convert float seconds to MM:SS format."""
    m = int(seconds // 60)
    s = int(seconds % 60)
    return f"{m:02d}:{s:02d}"

@router.post("/transcribe/youtube")
async def transcribe_youtube(payload: dict):
    """
    POST JSON: { "url": "https://www.youtube.com/watch?v=VIDEOID" }
    Returns: { "video_id": "...", "segments": [ {time, start, duration, text}, ... ] }
    """
    url = payload.get("url") if isinstance(payload, dict) else None
    if not url:
        raise HTTPException(status_code=400, detail="Missing 'url' in request body")

    # Extract 11-character YouTube video ID
    match = re.search(r"(?:v=|\/)([A-Za-z0-9_-]{11})", url)
    if not match:
        raise HTTPException(status_code=400, detail="Invalid YouTube URL or missing video id")

    video_id = match.group(1)

    try:
        # New method for youtube-transcript-api >= 1.0
        transcript_list = YouTubeTranscriptApi().list(video_id)

        # Try English first, fallback to any available language
        try:
            transcript = transcript_list.find_transcript(['en'])
        except NoTranscriptFound:
            transcript = transcript_list.find_manually_created_transcript(transcript_list._TranscriptList__transcripts.keys()).fetch()

        # Fetch transcript text
        data = transcript.fetch()

    except (TranscriptsDisabled, CouldNotRetrieveTranscript):
        raise HTTPException(status_code=500, detail="Transcripts are disabled or unavailable for this video.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not fetch transcript: {str(e)}")

    segments = [
        {
            "time": format_time(seg.get("start", 0.0)),
            "start": seg.get("start", 0.0),
            "duration": seg.get("duration", 0.0),
            "text": seg.get("text", "").strip(),
        }
        for seg in data
    ]

    return {"video_id": video_id, "segments": segments}