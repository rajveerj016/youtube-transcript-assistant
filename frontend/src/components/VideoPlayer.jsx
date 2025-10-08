import React, { useState, useRef, useEffect } from "react";

// Helper to extract YouTube video ID from different URL formats
function extractYouTubeID(url) {
  if (!url) return null;
  const reg =
    /(?:youtube\.com\/.*v=|youtube\.com\/shorts\/|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/;
  const match = url.match(reg);
  return match ? match[1] : null;
}

export default function VideoPlayer({ video, setVideo, playerRef }) {
  const localVideoRef = useRef(null);
  const [urlInput, setUrlInput] = useState("");

  // Link local video ref to external ref for timestamp seeking
  useEffect(() => {
    if (playerRef) playerRef.current = localVideoRef.current;
  }, [playerRef]);

  // Handle YouTube URL submit
  const onUrlSubmit = (e) => {
    e.preventDefault();
    const id = extractYouTubeID(urlInput.trim());
    if (id) {
      setVideo({ type: "youtube", id });
      setUrlInput("");
    } else {
      alert("Please paste a valid YouTube URL (e.g. https://youtu.be/VIDEO_ID)");
    }
  };

  // Handle local file upload
  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const src = URL.createObjectURL(file);
    setVideo({ type: "file", src, name: file.name });
  };

  return (
    <div>
      {/* Player area */}
      <div className="bg-black rounded overflow-hidden">
        {video?.type === "youtube" && video?.id ? (
          // YouTube Player
          <div className="relative" style={{ paddingTop: "56.25%" }}>
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${video.id}?rel=0&modestbranding=1`}
              title="YouTube Player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : video?.type === "file" && video?.src ? (
          // Local video
          <video
            ref={localVideoRef}
            controls
            className="w-full max-h-[60vh] bg-black"
          >
            <source src={video.src} />
            Your browser does not support the video tag.
          </video>
        ) : (
          // No video selected
          <div className="h-64 flex items-center justify-center text-gray-400">
            No video selected — paste a YouTube URL or upload a file.
          </div>
        )}
      </div>

      {/* Input + Upload controls */}
      <div className="mt-4 flex gap-4">
        <form onSubmit={onUrlSubmit} className="flex gap-2 flex-1">
          <input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Paste YouTube URL (or click related video)"
            className="flex-1 px-3 py-2 bg-neutral-800 rounded text-white focus:outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-500 transition"
          >
            Load
          </button>
        </form>

        <label className="px-4 py-2 bg-neutral-800 rounded cursor-pointer flex items-center gap-2 hover:bg-neutral-700 transition">
          <span>Upload</span>
          <input
            type="file"
            accept="video/*"
            onChange={onFileChange}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
}