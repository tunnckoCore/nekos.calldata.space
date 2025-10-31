"use client";

// import Link from "next/link";
import { allCursors, type Neko } from "@/lib/neko";
import { Badge } from "../ui/badge";
import { useQueryState } from "nuqs";
// import { Button } from "@/components/ui/button";

export function GalleryItemRow({
  item,
  children,
}: {
  item: Neko;
  children: React.ReactNode;
}) {
  const [sort] = useQueryState("sort");

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
    <div
      // href={`/items/${item.traits.gen.toLowerCase()}/${item.id}`}
      className="relative z-10 flex relative w-full items-center justify-between"
    >
      <div
        className="flex w-full items-center justify-between p-5"
        data-cat-trait={item.traits.cat}
        data-cat-color={patchedColors.cat}
        style={{ backgroundColor: patchedColors.cat }}
      >
        <div className="flex w-full justify-start">
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
          {/*<Badge variant="secondary" className="px-2.5">
            {item.sequence}
          </Badge>*/}
          {/*<div
            className="text-xs bg-slate-100 flex items-center justify-center rounded-md px-2 text-slate-800 shadow-lg drop-shadow-md"
            // href={`https://etherscan.io/tx/${item.transaction_hash}`}
            // rel="noopener noreferrer"
            // target="_blank"
          >
            💎 {rankings.jungle.rank}
          </div>*/}
        </div>
      </div>
      <div
        className="flex w-full items-center justify-between p-5"
        data-bg-trait={item.traits.background}
        data-bg-color={patchedColors.background}
        style={{
          backgroundColor:
            item.index === 1 && item.traits.gen.toLowerCase().includes("eths")
              ? "#c9e0ff"
              : patchedColors.background,
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
  );
}
