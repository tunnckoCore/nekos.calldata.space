"use client";

import { allCursors } from "@/lib/neko";
import type { Neko } from "@/lib/neko";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronDown } from "lucide-react";

interface GalleryItemRowProps {
  item: Neko;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export function GalleryItemRow({
  item,
  isExpanded = false,
  onToggleExpand,
}: GalleryItemRowProps) {
  const cursorItem = allCursors.find((c) => c.name === item.traits.cursor)!;
  const cursorEmoji = cursorItem.emoji;
  const isMobile = useIsMobile();

  // Avoid hydration mismatch
  if (isMobile === undefined) {
    return null;
  }

  const nameBadge = (
    <div className="relative z-10 flex items-center justify-between gap-2 rounded-full bg-slate-100 px-3 py-1 text-slate-800 shadow-lg drop-shadow-md">
      <span>{item.name}</span>
    </div>
  );

  const genBadge = (
    <div className="flex items-center justify-between gap-1 rounded-full bg-slate-100 px-3 py-1 text-slate-800 shadow-lg drop-shadow-lg">
      <span>
        {item.traits.gen.toLowerCase().includes("og") ? "NFT" : item.traits.gen}{" "}
        #{item.number}
      </span>
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>external link icon</title>
        <path d="M0 0h24v24H0z" fill="none" stroke="none" />
        <path d="M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6" />
        <path d="M11 13l9 -9" />
        <path d="M15 4h5v5" />
      </svg>
    </div>
  );

  const eyeBadges = (
    <>
      <span
        className="rounded-full p-4 shadow-lg drop-shadow-md"
        data-eyes-color={item.traits.eyes}
        data-eyes-trait={item.traits.eyes}
        style={{ backgroundColor: item.traits.eyes }}
      />
      <span
        className="rounded-full p-4 shadow-lg drop-shadow-md"
        data-eyes-color={item.traits.eyes}
        data-eyes-trait={item.traits.eyes}
        style={{ backgroundColor: item.traits.eyes }}
      />
    </>
  );

  const cursorBadge = (
    <div className="rounded-full bg-slate-100 px-2 py-1 text-primary-foreground shadow-lg drop-shadow-md">
      {cursorEmoji} {item.traits.cursor}
    </div>
  );

  if (isMobile) {
    /* Mobile Layout - Reversed badges */
    return (
      <div className="relative mb-0 flex w-full flex-col flex-wrap gap-0">
        <button
          onClick={onToggleExpand}
          className="flex w-full cursor-pointer flex-col"
          type="button"
        >
          {/* Top section: gen badge and eyes */}
          <div
            className="flex w-full items-center justify-between p-2"
            data-bg-color={item.traits.background}
            data-bg-trait={item.traits.background}
            style={{ backgroundColor: item.traits.background }}
          >
            <div className="flex items-center justify-start gap-2">
              {genBadge}
            </div>
            <div className="flex items-center justify-end gap-2">
              {eyeBadges}
              {onToggleExpand && (
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              )}
            </div>
          </div>

          {/* Bottom section: name and cursor */}
          <div
            className="flex w-full items-center justify-between p-2"
            data-cat-color={item.traits.cat}
            style={{ backgroundColor: item.traits.cat }}
          >
            <div className="flex items-center justify-start gap-2">
              {nameBadge}
            </div>
            <div className="flex items-center justify-end gap-2">
              {cursorBadge}
            </div>
          </div>
        </button>

        {/* Expanded content */}
        {isExpanded && onToggleExpand && (
          <div
            className="w-full border-t border-border/50 p-3 bg-muted/30 space-y-2 max-h-[85vh] overflow-y-auto"
            data-cat-color={item.traits.cat}
            style={{
              backgroundColor: `${item.traits.cat}20`,
              borderTopColor: item.traits.cat,
            }}
          >
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="font-semibold text-muted-foreground">
                  Generation:
                </span>
                <p className="text-foreground">
                  {item.traits.gen.toLowerCase().includes("og")
                    ? "NFT"
                    : item.traits.gen}
                </p>
              </div>
              <div>
                <span className="font-semibold text-muted-foreground">
                  Number:
                </span>
                <p className="text-foreground">#{item.number}</p>
              </div>
              <div>
                <span className="font-semibold text-muted-foreground">
                  Cat:
                </span>
                <p
                  className="rounded px-2 py-1 text-white"
                  style={{ backgroundColor: item.traits.cat }}
                >
                  {item.traits.cat}
                </p>
              </div>
              <div>
                <span className="font-semibold text-muted-foreground">
                  Eyes:
                </span>
                <p
                  className="rounded px-2 py-1 text-white"
                  style={{ backgroundColor: item.traits.eyes }}
                >
                  {item.traits.eyes}
                </p>
              </div>
              <div>
                <span className="font-semibold text-muted-foreground">
                  Background:
                </span>
                <p
                  className="rounded px-2 py-1 text-white"
                  style={{ backgroundColor: item.traits.background }}
                >
                  {item.traits.background}
                </p>
              </div>
              <div>
                <span className="font-semibold text-muted-foreground">
                  Cursor:
                </span>
                <p className="text-foreground">
                  {cursorEmoji} {item.traits.cursor}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* Desktop Layout - Original layout */
  return (
    <div className="relative mb-0 flex w-full flex-col flex-wrap gap-0 lg:flex-1">
      <button
        onClick={onToggleExpand}
        className="flex w-full cursor-pointer flex-wrap"
        type="button"
      >
        <div
          className="flex w-full xs:border-none p-2 lg:w-1/2 lg:pr-6"
          data-cat-color={item.traits.cat}
          style={{ backgroundColor: item.traits.cat }}
        >
          <div className="flex w-full">
            <div className="flex w-full p-3 font-bold">{nameBadge}</div>
            <div className="flex w-1/3 items-center justify-end gap-2">
              {eyeBadges}
            </div>
          </div>
        </div>
        <div
          className="flex w-full items-center justify-end p-4 pr-2 lg:w-1/2 lg:justify-start lg:pl-4"
          data-bg-color={item.traits.background}
          data-bg-trait={item.traits.background}
          style={{ backgroundColor: item.traits.background }}
        >
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center justify-start gap-2">
              {cursorBadge}
            </div>
            <div className="flex items-center justify-end gap-2">
              {genBadge}
              {onToggleExpand && (
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              )}
            </div>
          </div>
        </div>
      </button>

      {/* Expanded content */}
      {isExpanded && onToggleExpand && (
        <div
          className="w-full border-t border-border/50 p-3 bg-muted/30 space-y-2 max-h-[85vh] overflow-y-auto"
          data-cat-color={item.traits.cat}
          style={{
            backgroundColor: `${item.traits.cat}20`,
            borderTopColor: item.traits.cat,
          }}
        >
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
            <div>
              <span className="font-semibold text-muted-foreground">
                Generation:
              </span>
              <p className="text-foreground">
                {item.traits.gen.toLowerCase().includes("og")
                  ? "NFT"
                  : item.traits.gen}
              </p>
            </div>
            <div>
              <span className="font-semibold text-muted-foreground">
                Number:
              </span>
              <p className="text-foreground">#{item.number}</p>
            </div>
            <div>
              <span className="font-semibold text-muted-foreground">Cat:</span>
              <p
                className="rounded px-2 py-1 text-white"
                style={{ backgroundColor: item.traits.cat }}
              >
                {item.traits.cat}
              </p>
            </div>
            <div>
              <span className="font-semibold text-muted-foreground">Eyes:</span>
              <p
                className="rounded px-2 py-1 text-white"
                style={{ backgroundColor: item.traits.eyes }}
              >
                {item.traits.eyes}
              </p>
            </div>
            <div>
              <span className="font-semibold text-muted-foreground">
                Background:
              </span>
              <p
                className="rounded px-2 py-1 text-white"
                style={{ backgroundColor: item.traits.background }}
              >
                {item.traits.background}
              </p>
            </div>
            <div>
              <span className="font-semibold text-muted-foreground">
                Cursor:
              </span>
              <p className="text-foreground">
                {cursorEmoji} {item.traits.cursor}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
