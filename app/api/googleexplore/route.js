import { NextResponse } from "next/server";
import { ApifyClient } from "apify-client";

export async function POST(request) {
  try {
//         return NextResponse.json([
// 	{
// 		"keyword": "ai",
// 		"timeframe": "today 12-m",
// 		"geo": "Worldwide",
// 		"language": "en-US",
// 		"trends_url": "https://trends.google.com/trends/explore?q=ai&hl=en-US",
// 		"timeline_data": {
// 			"ai": {
// 				"2024-10-13": 35,
// 				"2024-10-20": 35,
// 				"2024-10-27": 35,
// 				"2024-11-03": 37,
// 				"2024-11-10": 36,
// 				"2024-11-17": 38,
// 				"2024-11-24": 34,
// 				"2024-12-01": 38,
// 				"2024-12-08": 41,
// 				"2024-12-15": 38,
// 				"2024-12-22": 34,
// 				"2024-12-29": 33,
// 				"2025-01-05": 39,
// 				"2025-01-12": 37,
// 				"2025-01-19": 40,
// 				"2025-01-26": 45,
// 				"2025-02-02": 44,
// 				"2025-02-09": 42,
// 				"2025-02-16": 44,
// 				"2025-02-23": 43,
// 				"2025-03-02": 43,
// 				"2025-03-09": 43,
// 				"2025-03-16": 45,
// 				"2025-03-23": 44,
// 				"2025-03-30": 53,
// 				"2025-04-06": 46,
// 				"2025-04-13": 43,
// 				"2025-04-20": 46,
// 				"2025-04-27": 44,
// 				"2025-05-04": 44,
// 				"2025-05-11": 46,
// 				"2025-05-18": 45,
// 				"2025-05-25": 46,
// 				"2025-06-01": 46,
// 				"2025-06-08": 52,
// 				"2025-06-15": 48,
// 				"2025-06-22": 50,
// 				"2025-06-29": 52,
// 				"2025-07-06": 45,
// 				"2025-07-13": 49,
// 				"2025-07-20": 51,
// 				"2025-07-27": 50,
// 				"2025-08-03": 57,
// 				"2025-08-10": 68,
// 				"2025-08-17": 65,
// 				"2025-08-24": 61,
// 				"2025-08-31": 74,
// 				"2025-09-07": 88,
// 				"2025-09-14": 100,
// 				"2025-09-21": 89,
// 				"2025-09-28": 68,
// 				"2025-10-05": 63,
// 				"2025-10-12": 59
// 			},
// 			"isPartial": {
// 				"2024-10-13": false,
// 				"2024-10-20": false,
// 				"2024-10-27": false,
// 				"2024-11-03": false,
// 				"2024-11-10": false,
// 				"2024-11-17": false,
// 				"2024-11-24": false,
// 				"2024-12-01": false,
// 				"2024-12-08": false,
// 				"2024-12-15": false,
// 				"2024-12-22": false,
// 				"2024-12-29": false,
// 				"2025-01-05": false,
// 				"2025-01-12": false,
// 				"2025-01-19": false,
// 				"2025-01-26": false,
// 				"2025-02-02": false,
// 				"2025-02-09": false,
// 				"2025-02-16": false,
// 				"2025-02-23": false,
// 				"2025-03-02": false,
// 				"2025-03-09": false,
// 				"2025-03-16": false,
// 				"2025-03-23": false,
// 				"2025-03-30": false,
// 				"2025-04-06": false,
// 				"2025-04-13": false,
// 				"2025-04-20": false,
// 				"2025-04-27": false,
// 				"2025-05-04": false,
// 				"2025-05-11": false,
// 				"2025-05-18": false,
// 				"2025-05-25": false,
// 				"2025-06-01": false,
// 				"2025-06-08": false,
// 				"2025-06-15": false,
// 				"2025-06-22": false,
// 				"2025-06-29": false,
// 				"2025-07-06": false,
// 				"2025-07-13": false,
// 				"2025-07-20": false,
// 				"2025-07-27": false,
// 				"2025-08-03": false,
// 				"2025-08-10": false,
// 				"2025-08-17": false,
// 				"2025-08-24": false,
// 				"2025-08-31": false,
// 				"2025-09-07": false,
// 				"2025-09-14": false,
// 				"2025-09-21": false,
// 				"2025-09-28": false,
// 				"2025-10-05": false,
// 				"2025-10-12": true
// 			}
// 		},
// 		"region_data": [],
// 		"data_granularity": "week"
// 	}
// ]);

    const body = await request.json();

    const {
      keyword = "",
      predefinedTimeframe = "today 12-m",
      geo = "",
      fetchRegionalData = false,
      enableTrendingSearches = false,
      trendingSearchesCountry = "US",
      trendingSearchesTimeframe = "24",
    } = body;

    const client = new ApifyClient({
      token: process.env.APIFY_API_TOKEN,
    });

    const input = {
      keyword,
      predefinedTimeframe,
      geo,
      fetchRegionalData,
      enableTrendingSearches,
      trendingSearchesCountry,
      trendingSearchesTimeframe,
      proxyConfiguration: {
        useApifyProxy: true,
        apifyProxyGroups: ["RESIDENTIAL"],
      },
    };

    // Run Google Trends Actor
    const run = await client.actor("nWhM7vTPu16lcwuIg").call(input);

    // Retrieve dataset items
    const { items } = await client.dataset(run.defaultDatasetId).listItems();

    console.log("Google Trends items:", items);

    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching Google Trends data:", error);
    return NextResponse.json(
      { error: "Failed to fetch Google Trends data", details: error.message },
      { status: 500 }
    );
  }
}