"use client";

import { Skeleton } from "@/components/ui/skeleton";

export const SkeletonRow = () => {
  return (
    <div className="flex relative w-full items-center justify-between cursor-pointer">
      {/* Cat section skeleton */}
      <div className="flex w-full items-center justify-between p-5 bg-muted/30">
        <div className="relative z-10 flex w-full justify-start">
          <Skeleton className="h-7 w-32 rounded-full" />
        </div>
        <div className="flex w-full justify-end gap-2">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-12 w-12 rounded-full" />
        </div>
      </div>

      {/* Background section skeleton */}
      <div className="flex w-full items-center justify-between p-5 bg-muted/20">
        <div className="flex w-full justify-start">
          <Skeleton className="h-7 w-40 rounded-full" />
        </div>
        <div className="flex w-full justify-end">
          <Skeleton className="h-7 w-48 rounded-full" />
        </div>
      </div>
    </div>
  );
};
