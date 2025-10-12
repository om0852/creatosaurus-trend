"use client";
import { useEffect, useState } from "react";

const VideoCard = ({ video }) => {
  return (
    <div className="border rounded-lg p-3 shadow-sm">
      {video.thumbnails && video.thumbnails[0] && (
        <img
          src={video.thumbnails[0].url}
          alt={video.title}
          className="w-full h-48 object-cover rounded"
        />
      )}
      <h3 className="mt-2 font-semibold">{video.title}</h3>
      <p className="text-sm text-gray-600">{video.channel?.name}</p>
      <p className="text-sm text-gray-500">
        {video.views?.toLocaleString()} views • {video.duration}s
      </p>
      <a
        href={video.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 text-sm mt-1 block"
      >
        Watch
      </a>
    </div>
  );
};

export default function YouTubeTrendingPage() {
  const [filters, setFilters] = useState({
    type: "n",
    gl: "US",
    hl: "en",
    maxItems: 20,
  });
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchVideos = async () => {
    setLoading(true);
    setError("");
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await fetch(`/api/youtubetrend?${query}`);
      const json = await res.json();
      if (!json.success) {
        throw new Error(json.error || "Failed to fetch");
      }
      setVideos(json.data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [filters]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">YouTube Trending</h1>

      <div className="flex gap-4 mb-6">
        <select
          name="gl"
          value={filters.gl}
          onChange={(e) => setFilters((f) => ({ ...f, gl: e.target.value }))}
        >
          <option value="US">United States</option>
          <option value="IN">India</option>
          <option value="JP">Japan</option>
          <option value="GB">United Kingdom</option>
          {/* add more country codes */}
        </select>

        <select
          name="hl"
          value={filters.hl}
          onChange={(e) => setFilters((f) => ({ ...f, hl: e.target.value }))}
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="ja">Japanese</option>
        </select>

        <select
          name="type"
          value={filters.type}
          onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
        >
          <option value="n">Now</option>
          <option value="music">Music</option>
          <option value="movies">Movies</option>
          <option value="gaming">Gaming</option>
        </select>

        <input
          type="number"
          name="maxItems"
          value={filters.maxItems}
          onChange={(e) =>
            setFilters((f) => ({ ...f, maxItems: Number(e.target.value) }))
          }
          className="w-20 border rounded px-2"
        />

        <button
          onClick={fetchVideos}
          className="bg-blue-600 text-white px-4 py-1 rounded"
        >
          Refresh
        </button>
      </div>

      {loading && <p>Loading trending videos...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((vid) => (
          <VideoCard key={vid.id} video={vid} />
        ))}
      </div>
    </div>
  );
}
