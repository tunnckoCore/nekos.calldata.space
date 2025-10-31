import type { Metadata } from "next";
import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { GalleryContent } from "@/components/neko/gallery-content";

export const metadata: Metadata = {
  title: "Gallery | 0xNeko",
  description: "Browse 380 0xNeko NFTs, Ordinals, and Ethscriptions",
};

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default async function GalleryPage({ searchParams }: PageProps) {
  return (
    <div className="h-screen w-screen overflow-hidden bg-background flex flex-col">
      <Suspense fallback={<div className="flex-1" />}>
        <GalleryContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
