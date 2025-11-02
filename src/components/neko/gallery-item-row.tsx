"use client";

import Link from "next/link";
import { useQueryState } from "nuqs";
import { useEffect, useRef } from "react";
import { getProperColors } from "@/lib/colors";
// import Link from "next/link";
import { allCursors, type Neko } from "@/lib/neko";

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
    }, 500);
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

  const colors = getProperColors(item);

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
        className="relative flex w-full cursor-pointer items-center justify-between"
      >
        <div
          className="flex w-full items-center justify-between p-5"
          data-cat-trait={item.traits.cat}
          data-cat-color={colors.cat}
          style={{ backgroundColor: colors.cat }}
        >
          <div className="relative z-10 flex w-full justify-start">
            {
              <div className="rounded-full bg-slate-100 px-3 py-1 text-slate-800 shadow-lg drop-shadow-md">
                {item.name} 💠 {globalRank}
              </div>
            }
          </div>
          <div className="flex w-full justify-end gap-2">
            <div
              className="rounded-full p-4 shadow-lg drop-shadow-md"
              data-eyes-trait={item.traits.eyes}
              data-eyes-color={colors.eyes}
              style={{ backgroundColor: colors.eyes }}
            />
            <div
              className="rounded-full p-4 shadow-lg drop-shadow-md"
              data-eyes-trait={item.traits.eyes}
              data-eyes-color={colors.eyes}
              style={{ backgroundColor: colors.eyes }}
            />
          </div>
        </div>
        <div
          className="flex w-full items-center justify-between p-5"
          data-bg-trait={item.traits.background}
          data-bg-color={colors.background}
          style={{
            backgroundColor: colors.background,
          }}
        >
          <div className="flex w-full justify-start">
            <div className="rounded-full bg-slate-100 px-3 py-1 text-slate-800 shadow-lg drop-shadow-md">
              {cursorEmoji} {item.traits.cursor}
            </div>
          </div>
          <div className="flex w-full justify-end">
            {item.traits.gen.toLowerCase().includes("og") && (
              <Link
                className="rounded-full bg-slate-100 px-3 py-1 text-slate-800 shadow-lg drop-shadow-md"
                href={`https://opensea.io/item/ethereum/0x7c3219045a87bc7001495117e1bb560b69e910db/${item.index}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                NFT #{item.number.toLocaleString()}{" "}
                {itemRank ? `💎 ${itemRank}` : ""}
              </Link>
            )}
            {item.traits.gen.toLowerCase().includes("ordinal") && (
              <Link
                className="rounded-full bg-slate-100 px-3 py-1 text-slate-800 shadow-lg drop-shadow-md"
                href={`https://ordiscan.com/inscription/${item.id}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                Ordinal #{item.number.toLocaleString()}{" "}
                {itemRank ? `💎 ${itemRank}` : ""}
              </Link>
            )}
            {item.traits.gen.toLowerCase().includes("eths") && (
              <Link
                className="rounded-full bg-slate-100 px-3 py-1 text-slate-800 shadow-lg drop-shadow-md"
                href={`https://etherscan.io/tx/${item.transaction_hash}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                Ethscription #{item.number.toLocaleString()}{" "}
                {itemRank ? `💎 ${itemRank}` : ""}
              </Link>
            )}
          </div>
        </div>
      </div>
      {isOpen && children}
    </>
  );
}
