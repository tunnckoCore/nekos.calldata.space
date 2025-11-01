"use client";

import { useEffect, useRef } from "react";
import { useQueryState } from "nuqs";
import { Badge } from "@/components/ui/badge";
// import Link from "next/link";
import { allCursors, type Neko } from "@/lib/neko";

// import { Button } from "@/components/ui/button";

export function GalleryItemRow({
  item,
  children,
  isOpen = false,
  onToggle,
}: {
  item: Neko;
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
}) {
  const [sort] = useQueryState("sort");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    // Debounce prefetch - only trigger after 200ms of hover
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      // Preconnect and prefetch iframe sources
      const baseURL =
        typeof window !== "undefined"
          ? new URL(window.location.href).origin
          : "";

      if (item.traits.gen.toLowerCase().includes("og")) {
        const link = document.createElement("link");
        link.rel = "prefetch";
        link.as = "fetch";
        link.href = `${baseURL}/api/content/${item.number}?gen=og`;
        document.head.appendChild(link);
      }
      if (item.traits.gen.toLowerCase().includes("ordinals")) {
        const link = document.createElement("link");
        link.rel = "prefetch";
        link.as = "fetch";
        link.href = `${baseURL}/api/content/${item.id}?gen=ordinals`;
        document.head.appendChild(link);
      }
      if (item.traits.gen.toLowerCase().includes("eths")) {
        const prefetch = document.createElement("link");
        prefetch.rel = "prefetch";
        prefetch.as = "fetch";
        prefetch.href = `https://mainnet.api.calldata.space/ethscriptions/${item.id}/data`;
        document.head.appendChild(prefetch);
      }
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const cursorItem = allCursors.find((c) => c.name === item.traits.cursor);
  const cursorEmoji = cursorItem!.emoji;

  const patchedColors = item.colors || item.traits;
  const rankings = item.rankings;

  const globalRank = rankings?.global?.rank ?? 0;
  const itemRank =
    sort === "rank_rarity"
      ? (rankings?.rarity?.rank ?? 0)
      : sort === "rank_jungle"
        ? (rankings?.jungle?.rank ?? 0)
        : sort === "rank_open_rarity"
          ? (rankings?.openRarity?.rank ?? 0)
          : (rankings?.jungle?.rank ?? 0);

  return (
    <>
      <div
        onClick={onToggle}
        onMouseEnter={handleMouseEnter}
        className="flex relative w-full items-center justify-between cursor-pointer"
      >
        <div
          className="flex w-full items-center justify-between p-5"
          data-cat-trait={item.traits.cat}
          data-cat-color={patchedColors.cat}
          style={{ backgroundColor: patchedColors.cat }}
        >
          <div className="relative z-10 flex w-full justify-start">
            {/*{item.traits.gen.toLowerCase().includes("og") && (
            <div
              className="relative z-20 rounded-full bg-slate-100 px-3 py-1 text-slate-800 shadow-lg drop-shadow-md"

              // href={`https://opensea.io/item/ethereum/0x7c3219045a87bc7001495117e1bb560b69e910db/${item.index}`}
              // rel="noopener noreferrer"
              // target="_blank"
            >
              {item.index}
            </div>
          )}
          {item.traits.gen.toLowerCase().includes("ordinal") && (
            <div
              className="rounded-full bg-slate-100 px-3 py-1 text-slate-800 shadow-lg drop-shadow-md"
              // href={`https://ordiscan.com/inscription/${item.id}`}
              // rel="noopener noreferrer"
              // target="_blank"
            >
              0xNeko Ordinals #{item.index}
            </div>
          )}*/}
            {/*{item.traits.gen.toLowerCase().includes("eths") && (*/}
            {
              <div
                className="rounded-full bg-slate-100 px-3 py-1 text-slate-800 shadow-lg drop-shadow-md"
                // href={`https://etherscan.io/tx/${item.transaction_hash}`}
                // rel="noopener noreferrer"
                // target="_blank"
              >
                {item.name} 💠 {globalRank}
              </div>
            }
          </div>
          <div className="flex w-full justify-end gap-2">
            <div
              className="rounded-full p-4 shadow-lg drop-shadow-md"
              data-eyes-trait={item.traits.eyes}
              data-eyes-color={patchedColors.eyes}
              style={{ backgroundColor: patchedColors.eyes }}
            />
            <div
              className="rounded-full p-4 shadow-lg drop-shadow-md"
              data-eyes-trait={item.traits.eyes}
              data-eyes-color={patchedColors.eyes}
              style={{ backgroundColor: patchedColors.eyes }}
            />
          </div>
        </div>
        <div
          className="flex w-full items-center justify-between p-5"
          data-bg-trait={item.traits.background}
          data-bg-color={patchedColors.background}
          style={{
            backgroundColor: patchedColors.background,
          }}
        >
          <div className="flex w-full justify-start">
            <div className="rounded-full bg-slate-100 px-3 py-1 text-slate-800 shadow-lg drop-shadow-md">
              {cursorEmoji} {item.traits.cursor}
            </div>
          </div>
          <div className="flex w-full justify-end">
            {item.traits.gen.toLowerCase().includes("og") && (
              <div
                className="rounded-full bg-slate-100 px-3 py-1 text-slate-800 shadow-lg drop-shadow-md"
                // href={`https://opensea.io/item/ethereum/0x7c3219045a87bc7001495117e1bb560b69e910db/${item.index}`}
                // rel="noopener noreferrer"
                // target="_blank"
              >
                NFT #{item.number.toLocaleString()}{" "}
                {itemRank ? `💎 ${itemRank}` : ""}
              </div>
            )}
            {item.traits.gen.toLowerCase().includes("ordinal") && (
              <div
                className="rounded-full bg-slate-100 px-3 py-1 text-slate-800 shadow-lg drop-shadow-md"
                // href={`https://ordiscan.com/inscription/${item.id}`}
                // rel="noopener noreferrer"
                // target="_blank"
              >
                Ordinal #{item.number.toLocaleString()}{" "}
                {itemRank ? `💎 ${itemRank}` : ""}
              </div>
            )}
            {item.traits.gen.toLowerCase().includes("eths") && (
              <div
                className="rounded-full bg-slate-100 px-3 py-1 text-slate-800 shadow-lg drop-shadow-md"
                // href={`https://etherscan.io/tx/${item.transaction_hash}`}
                // rel="noopener noreferrer"
                // target="_blank"
              >
                Ethscription #{item.number.toLocaleString()}{" "}
                {itemRank ? `💎 ${itemRank}` : ""}
              </div>
            )}
            {/*{item.traits.gen.toLowerCase().includes("og") && (
            <a
              href={`https://opensea.io/item/ethereum/0x7c3219045a87bc7001495117e1bb560b69e910db/${item.index}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              NFT #{item.index}
            </a>
          )}
          {item.traits.gen.toLowerCase().includes("ordinal") && (
            <a
              href={`https://ordiscan.com/inscription/${item.id}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              Ordinal #{item.number.toLocaleString()}
            </a>
          )}
          {item.traits.gen.toLowerCase().includes("eths") && (
            <a
              href={`https://ethscriptions.com/ethscriptions/${item.number}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              Ethscription #{item.number.toLocaleString()}
            </a>
          )}*/}
            {/*<svg
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
          </svg>*/}
          </div>
        </div>
      </div>
      {isOpen && children}
    </>
  );
}
