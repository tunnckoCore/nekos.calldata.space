import { NextResponse } from "next/server";
import { gallerySearchParamsCache } from "@/lib/gallery-search-params";
import { getPaginatedNekos } from "@/lib/neko-fetch";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const filters = await gallerySearchParamsCache.parse(
      Promise.resolve(searchParams),
    );

    // Parse query parameters
    const skip = Math.max(
      0,
      Number.parseInt(searchParams.get("skip") || "0", 10),
    );
    const take = Math.min(
      100,
      Math.max(1, Number.parseInt(searchParams.get("take") || "50", 10)),
    );

    // Fetch paginated data
    const { items, total, hasMore } = await getPaginatedNekos(url.origin, {
      skip,
      take,
      ...filters,
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
