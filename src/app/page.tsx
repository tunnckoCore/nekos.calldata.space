import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { GalleryContent } from "@/components/neko/gallery-content";
import { SkeletonRow } from "@/components/neko/skeleton-row";

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default async function GalleryPage({ searchParams }: PageProps) {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background">
      <Suspense
        fallback={
          <div className="flex w-full flex-col items-center justify-center">
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </div>
        }
      >
        <GalleryContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
