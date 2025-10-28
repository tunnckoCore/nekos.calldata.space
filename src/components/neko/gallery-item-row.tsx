"use client";

import { allCursors } from "@/lib/neko";
import type { Neko } from "@/lib/neko";

interface GalleryItemRowProps {
  item: Neko;
}

export function GalleryItemRow({ item }: GalleryItemRowProps) {
  const cursorItem = allCursors.find((c) => c.name === item.traits.cursor);
  const cursorEmoji = cursorItem ? cursorItem.emoji : "✨";

  return (
    <div className="relative mb-0 flex w-full flex-col flex-wrap gap-0 lg:flex-1">
      <button className="flex w-full cursor-pointer flex-wrap" type="button">
        <div
          className="flex w-full xs:border-none p-2 lg:w-1/2 lg:pr-6"
          data-cat-color={item.traits.cat}
          data-cat-trait={item.traits.cat}
          style={{ backgroundColor: item.traits.cat }}
        >
          <div className="flex w-full">
            <div className="flex w-full p-3 font-bold">
              <div className="relative z-10 flex items-center justify-between gap-2 rounded-full bg-slate-100 px-3 py-1 text-slate-800 shadow-lg drop-shadow-md">
                <span>{item.name}</span>
              </div>
            </div>
            <div className="flex w-1/3 items-center justify-end gap-2">
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
            <div className="rounded-full bg-slate-100 px-2 py-1 text-primary-foreground shadow-lg drop-shadow-md">
              {cursorEmoji} {item.traits.cursor}
            </div>
            <div className="mr-4 flex items-center justify-between gap-1 rounded-full bg-slate-100 px-3 py-1 text-slate-800 shadow-lg drop-shadow-lg">
              <span>
                {item.traits.gen.toLowerCase().includes("og")
                  ? "NFT"
                  : item.traits.gen}{" "}
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
          </div>
        </div>
      </button>
    </div>
  );
}
