// frontend/src/App.jsx
import { useRef, useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import VideoPlayer from "./components/VideoPlayer";
import RelatedVideos from "./components/RelatedVideos";
import Transcript from "./components/Transcript";
import InsightsPanel from "./components/InsightsPanel";

export default function App() {
  const [video, setVideo] = useState(null);          // {type:'youtube'|'file', id?, src?, start?}
  const [transcript, setTranscript] = useState([]);  // list of transcript lines
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const playerRef = useRef(null);

  // 🎯 Whenever user loads a YouTube video, fetch transcript automatically
  useEffect(() => {
    if (video?.type === "youtube" && video.id) {
      const fetchTranscript = async () => {
        try {
          setLoading(true);
          setError(null);
          setTranscript([]);
          const res = await axios.post("http://127.0.0.1:8000/api/transcribe/youtube", {
            url: `https://www.youtube.com/watch?v=${video.id}`,
          });
          setTranscript(res.data.segments || []);
        } catch (err) {
          setError(err.response?.data?.detail || "Transcript unavailable for this video.");
        } finally {
          setLoading(false);
        }
      };
      fetchTranscript();
    } else {
      setTranscript([]);
      setError(null);
    }
  }, [video]);

  // ⏱️ Handle timestamp clicks
  const handleTimestampClick = (seconds) => {
    if (!Number.isFinite(seconds)) return;
    if (video?.type === "file" && playerRef.current) {
      playerRef.current.currentTime = seconds;
    } else if (video?.type === "youtube" && video.id) {
      setVideo((prev) => ({
        ...(prev || {}),
        start: Math.floor(seconds),
        type: "youtube",
      }));
    }
  };

  const sampleVideos = [
    {
      title: "What is a Neural Network?",
      channel: "3Blue1Brown",
      thumbnail: "https://i.ytimg.com/vi/aircAruvnKk/hqdefault.jpg",
      type: "youtube",
      id: "aircAruvnKk",
    },
    {
      title: "Deep Learning Explained",
      channel: "TechWorld",
      thumbnail: "https://i.ytimg.com/vi/aircAruvnKk/hqdefault.jpg",
      type: "youtube",
      id: "aircAruvnKk",
    },
  ];

  return (
    <div className="bg-[#0f0f0f] min-h-screen text-white">
      <Navbar />

      <div className="p-6 flex flex-col md:flex-row gap-6 justify-center">
        <div className="flex-1 max-w-4xl">
          <VideoPlayer video={video} setVideo={setVideo} playerRef={playerRef} />

          {loading && (
            <p className="text-gray-400 text-sm mt-4">⏳ Fetching transcript...</p>
          )}

          {error && (
            <p className="text-red-400 text-sm mt-4">
              ⚠️ {error}
            </p>
          )}

          {!loading && !error && transcript.length > 0 && (
            <Transcript
              transcript={transcript}
              onTimestampClick={handleTimestampClick}
            />
          )}

          <InsightsPanel transcript={transcript} />
        </div>

        <RelatedVideos
          videos={sampleVideos}
          onSelect={(v) => setVideo(v)}
        />
      </div>
    </div>
  );
}