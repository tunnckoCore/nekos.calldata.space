// "use cache";

import { getPaginatedNekos } from "@/lib/neko-fetch";
import { cacheLife } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Cache this endpoint for 1 hour for filtered queries
  // cacheLife({
  //   stale: 3600, // 1 hour
  //   revalidate: 3600,
  //   expire: 3600,
  // });

  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;

    // Parse query parameters
    const skip = Math.max(0, parseInt(searchParams.get("skip") || "0"));
    const take = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("take") || "50")),
    );
    const search = searchParams.get("search") || undefined;
    const background = searchParams.get("background") || undefined;
    const cat = searchParams.get("cat") || undefined;
    const eyes = searchParams.get("eyes") || undefined;
    const cursor = searchParams.get("cursor") || undefined;
    const gen = searchParams.get("gen") || undefined;
    const year = searchParams.get("year") || undefined;
    const sort = searchParams.get("sort") || "block_timestamp";
    const order = (searchParams.get("order") || "asc") as "asc" | "desc";

    // Fetch paginated data
    const { items, total, hasMore } = await getPaginatedNekos({
      skip,
      take,
      search,
      background,
      cat,
      eyes,
      cursor,
      gen,
      year,
      sort,
      order,
    });

    return NextResponse.json(
      {
        items,
        total,
        hasMore,
        skip,
        take,
      },
      {
        headers: {
          "Cache-Control": "public, max-age=3600",
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("Error in GET /api/neko/paginated:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch paginated Neko data",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
