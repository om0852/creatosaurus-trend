import { NextResponse } from "next/server";
import { ApifyClient } from "apify-client";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    // Read query params (fallbacks are provided)
    const subreddit = searchParams.get("subreddit") || "popular";
    const sort = searchParams.get("sort") || "hot"; // hot, new, top
    const maxItems = parseInt(searchParams.get("maxItems") || "10");

    // Initialize Apify client
    const client = new ApifyClient({
      token: process.env.APIFY_API_TOKEN, // Store securely in .env.local
    });

    // Prepare input dynamically
    const input = {
      startUrls: [
        {
          url: `https://www.reddit.com/r/${subreddit}/`,
        },
      ],
      sort,
      searchPosts: true,
      searchComments: false,
      searchCommunities: false,
      searchUsers: false,
      skipComments: false,
      skipCommunity: false,
      skipUserPosts: false,
      includeNSFW: false,
      ignoreStartUrls: false,
      maxItems,
      maxPostCount: maxItems,
      maxComments: 10,
      maxCommunitiesCount: 2,
      maxUserCount: 2,
      scrollTimeout: 40,
      proxy: {
        useApifyProxy: true,
        apifyProxyGroups: ["RESIDENTIAL"],
      },
      debugMode: false,
    };

    // Run Apify Actor
    const run = await client.actor("oAuCIx3ItNrs2okjQ").call(input);

    // Fetch dataset results
    const { items } = await client.dataset(run.defaultDatasetId).listItems();

    // Filter out irrelevant data
    const posts = items
      .filter((item) => item.dataType === "post")
      .map((post) => ({
        id: post.parsedId,
        title: post.title,
        subreddit: post.parsedCommunityName,
        url: post.url,
        upVotes: post.upVotes,
        comments: post.numberOfComments,
        thumbnail: post.thumbnailUrl,
        video: post.videoUrl,
        createdAt: post.createdAt,
        nsfw: post.over18,
      }));

    return NextResponse.json({
      success: true,
      count: posts.length,
      subreddit,
      sort,
      data: posts,
    });
  } catch (error) {
    console.error("Reddit API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch Reddit data", error: error.message },
      { status: 500 }
    );
  }
}
