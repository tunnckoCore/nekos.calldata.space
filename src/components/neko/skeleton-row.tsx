"use client";

import { Skeleton } from "@/components/ui/skeleton";

export const SkeletonRow = () => {
  return (
    <div className="relative flex w-full cursor-pointer items-center justify-between">
      {/* Cat section skeleton */}
      <div className="flex w-full items-center justify-between bg-muted/30 p-5">
        <div className="relative z-10 flex w-full justify-start">
          <Skeleton className="h-7 w-32 rounded-full" />
        </div>
        <div className="flex w-full justify-end gap-2">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-12 w-12 rounded-full" />
        </div>
      </div>

      {/* Background section skeleton */}
      <div className="flex w-full items-center justify-between bg-muted/20 p-5">
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
