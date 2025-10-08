export default function RelatedVideos({ videos, onSelect }) {
  return (
    <aside className="w-full md:w-80 bg-neutral-900 rounded-lg p-3 space-y-3">
      <h2 className="text-lg font-semibold mb-2">Related Videos</h2>

      {videos?.length ? (
        videos.map((v, i) => (
          <div
            key={i}
            onClick={() => onSelect(v)}
            className="flex gap-3 cursor-pointer hover:bg-neutral-800 rounded-lg p-2 transition"
          >
            <img
              src={v.thumbnail}
              alt={v.title}
              className="w-28 h-16 object-cover rounded-md"
            />
            <div className="flex-1">
              <p className="text-sm font-medium leading-tight">{v.title}</p>
              <p className="text-xs text-gray-400">{v.channel}</p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-400 text-sm">No related videos yet.</p>
      )}
    </aside>
  );
}