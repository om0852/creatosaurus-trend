"use client";
import { useState, useEffect } from "react";

export default function RedditTrends() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subreddit, setSubreddit] = useState("popular");
  const [sort, setSort] = useState("hot");
  const [error, setError] = useState("");

  const fetchReddit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/reddittrend?subreddit=${subreddit}&sort=${sort}&maxItems=10`);
      const json = await res.json();
      console.log(json)
      if (!json.success) throw new Error(json.error || "Failed to fetch Reddit posts");
      setPosts(json.data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReddit();
  }, [subreddit, sort]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Reddit Trending Posts</h1>

      <div className="flex gap-3 mb-4">
        <input
          type="text"
          value={subreddit}
          onChange={(e) => setSubreddit(e.target.value)}
          placeholder="Enter subreddit (e.g. news, gaming)"
          className="border px-3 py-2 rounded-lg"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="hot">Hot</option>
          <option value="new">New</option>
          <option value="top">Top</option>
        </select>
        <button
          onClick={fetchReddit}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Refresh
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div key={post.id} className="border rounded-lg overflow-hidden shadow">
            {post.thumbnail && (
              <img
                src={post.thumbnail}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="font-semibold text-lg mb-2">{post.title}</h2>
              <p className="text-sm text-gray-500">r/{post.subreddit}</p>
              <p className="text-sm">👍 {post.upVotes} | 💬 {post.comments}</p>
              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-sm mt-2 inline-block"
              >
                View on Reddit
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
