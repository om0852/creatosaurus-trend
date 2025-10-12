import { NextResponse } from "next/server";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const region = (searchParams.get("region") || "us").toUpperCase();
    const hl = (searchParams.get("hl") || "en").toLowerCase();
    const maxResults = parseInt(searchParams.get("maxResults") || "10");

    const params = new URLSearchParams({
      part: "snippet,statistics",
      chart: "mostPopular",
      regionCode: region,
      maxResults: maxResults.toString(),
      hl,
      key: YOUTUBE_API_KEY,
    });

    const url = `https://www.googleapis.com/youtube/v3/videos?${params.toString()}`;
    const res = await fetch(url);

    if (!res.ok) {
      const err = await res.json();
      throw new Error(`YouTube API error: ${err.error?.message || res.statusText}`);
    }

    const json = await res.json();
    const items = json.items || [];

    // Normalize output
    const formatted = items.map((v) => ({
      id: v.id,
      title: v.snippet.title,
      description: v.snippet.description,
      url: `https://youtube.com/watch?v=${v.id}`,
      channel: {
        name: v.snippet.channelTitle,
        id: v.snippet.channelId,
      },
      thumbnails: v.snippet.thumbnails,
      stats: {
        viewCount: v.statistics.viewCount,
        likeCount: v.statistics.likeCount, // may require “statistics” part
      },
    }));

    return NextResponse.json({ success: true, region, data: formatted });
  } catch (error) {
    console.error("YouTube trending error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
