import type { Metadata } from "next";
import { Suspense } from "react";
import { GalleryContent } from "@/components/neko/gallery-content";
import type { SearchParams } from "nuqs/server";

export const metadata: Metadata = {
  title: "Gallery | 0xNeko",
  description: "Browse 380 0xNeko NFTs, Ordinals, and Ethscriptions",
};

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default async function GalleryPage({ searchParams }: PageProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-8 text-4xl font-bold">0xNeko Gallery</h1>

        <Suspense fallback={<div>Loading gallery...</div>}>
          <GalleryContent searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
