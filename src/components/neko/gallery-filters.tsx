"use client";

import { ArrowDown, ArrowUp, Loader2, Menu, X as XClose } from "lucide-react";
import Link from "next/link";
import { debounce } from "nuqs";
import { useMemo, useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { useSearchShortcuts } from "@/hooks/use-search-shortcuts";
import { type GalleryFilters, useFilters } from "@/lib/gallery-search-params";
// import { useAllNekos } from "@/lib/queries";
// import type { NekoCacheEntry } from "@/lib/preps";
import type { Neko } from "@/lib/neko";
import { getDynamicTraitOptions } from "@/lib/neko-fetch";

const SORT_LABELS: Record<string, string> = {
  sequence: "Created At",
  block_number: "Block & Index",
  transaction_fee: "Transaction Fee",
  number: "Protocol Number",
  rank_global: "Global Rank",
  rank_open_rarity: "Rank: OpenRarity",
  rank_jungle: "Rank: Jungle",
  rank_rarity: "Rank: RarityScore",
};

export function GalleryFiltersComp({
  allNekos,
  filters,
}: {
  allNekos: Neko[];
  filters: GalleryFilters;
}) {
  const [isPending, startTransition] = useTransition();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  // const { data: allNekos } = useAllNekos(baseURL);
  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  const [clientFilters, setFilters] = useFilters({
    startTransition,
  });

  // Compute dynamic trait options based on current filters
  const traitOptions = useMemo(() => {
    if (!allNekos) {
      return {
        backgrounds: [],
        cats: [],
        eyes: [],
        cursors: [],
        gens: [],
        years: [],
      };
    }

    return {
      backgrounds: getDynamicTraitOptions(
        allNekos,
        "background",
        clientFilters,
      ),
      cats: getDynamicTraitOptions(allNekos, "cat", clientFilters),
      eyes: getDynamicTraitOptions(allNekos, "eyes", clientFilters),
      cursors: getDynamicTraitOptions(allNekos, "cursor", clientFilters),
      gens: getDynamicTraitOptions(allNekos, "gen", clientFilters),
      years: getDynamicTraitOptions(allNekos, "year", clientFilters),
    };
  }, [allNekos, clientFilters]);

  // Check if any filter is active
  const isFiltered =
    filters.search ||
    filters.background ||
    filters.cat ||
    filters.eyes ||
    filters.cursor ||
    filters.gen ||
    filters.year ||
    filters.sort !== "sequence" ||
    filters.order !== "asc";

  // Clear all filters
  const handleClearAll = () => {
    setFilters(null);
  };

  const handleSetFilters = (key: string, val: any) => {
    startTransition(async () => {
      await setFilters(
        { [key]: val },
        {
          limitUrlUpdates: key === "search" ? debounce(250) : undefined,
        },
      );
    });
  };

  // Set up keyboard shortcuts for search input
  useSearchShortcuts(inputRef);
  useSearchShortcuts(mobileInputRef);

  // Render trait select component
  const renderTraitSelect = (
    key: string,
    label: string,
    options: any[],
    placeholder: string,
  ) => {
    const selectValue = filters[key as keyof typeof filters] || "all";

    return (
      <div className="">
        <Select
          value={selectValue}
          onValueChange={(val) =>
            handleSetFilters(key, val === "all" ? "" : val)
          }
          disabled={isPending}
        >
          <SelectTrigger className="h-9 w-full cursor-pointer text-sm">
            {selectValue === "" || selectValue === "all" ? (
              <span>{label}</span>
            ) : (
              <SelectValue placeholder={placeholder} />
            )}
          </SelectTrigger>
          <SelectContent className="max-h-64">
            <SelectItem value="all" className="cursor-pointer">
              {label}
            </SelectItem>
            {options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="cursor-pointer"
              >
                {option.value} ({option.count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  };

  return (
    <div className="sticky top-0 z-50 w-full border-border border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-4 py-3">
        {/* Mobile Layout */}
        <div className="flex items-center gap-3 md:hidden">
          {/* Search Input */}
          <InputGroup className="min-w-0 flex-1">
            <InputGroupInput
              ref={mobileInputRef}
              autoFocus
              placeholder="Browse 0xNekos..."
              value={filters.search}
              onChange={(e) => handleSetFilters("search", e.target.value)}
            />
            {isPending && (
              <InputGroupAddon align="inline-end">
                <Spinner />
              </InputGroupAddon>
            )}
            {!isPending && (
              <InputGroupAddon align="inline-end">
                <KbdGroup>
                  <Kbd>⌘</Kbd>
                  <Kbd>K</Kbd>
                </KbdGroup>
              </InputGroupAddon>
            )}
          </InputGroup>

          {/* Gens Filter on Left */}
          {renderTraitSelect(
            "gen",
            "All Generations",
            traitOptions.gens,
            "Gen",
          )}

          {/* Hamburger Menu on Right */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open filters">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="bottom"
              className="max-h-[85vh] overflow-y-auto [&>button]:hidden"
            >
              <SheetHeader className="sr-only">
                <SheetTitle>Filter Nekos</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-6 p-6 pb-2">
                {/* Filters Section - Top */}
                <div className="flex flex-col gap-3">
                  <div className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                    Traits
                  </div>
                  <div className="flex flex-col gap-3">
                    {renderTraitSelect(
                      "cat",
                      "All Cats",
                      traitOptions.cats,
                      "Cat",
                    )}
                    {renderTraitSelect(
                      "eyes",
                      "All Eyes",
                      traitOptions.eyes,
                      "Eyes",
                    )}
                    {renderTraitSelect(
                      "background",
                      "All Backgrounds",
                      traitOptions.backgrounds,
                      "Backgrounds",
                    )}
                    {renderTraitSelect(
                      "cursor",
                      "All Cursors",
                      traitOptions.cursors,
                      "Cursor",
                    )}
                    {renderTraitSelect(
                      "gen",
                      "All Generations",
                      traitOptions.gens,
                      "Gen",
                    )}
                    {renderTraitSelect(
                      "year",
                      "All Years",
                      traitOptions.years,
                      "Year",
                    )}
                  </div>
                </div>

                {/* Sort & Actions Section */}
                <div className="flex flex-col gap-3">
                  <div className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                    Sort & Actions
                  </div>
                  <div className="flex gap-2">
                    {/* Sort By */}
                    <Select
                      value={filters.sort}
                      onValueChange={(val) => handleSetFilters("sort", val)}
                      disabled={isPending}
                    >
                      <SelectTrigger className="flex-1">
                        {SORT_LABELS[filters.sort] || "Sort By"}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sequence" className="cursor-pointer">
                          Created At
                        </SelectItem>
                        <SelectItem
                          value="block_number"
                          className="cursor-pointer"
                        >
                          Block & Index
                        </SelectItem>
                        <SelectItem
                          value="transaction_fee"
                          className="cursor-pointer"
                        >
                          Transaction Fee
                        </SelectItem>
                        <SelectItem value="number" className="cursor-pointer">
                          Protocol Number
                        </SelectItem>
                        <SelectItem
                          value="rank_global"
                          className="cursor-pointer"
                        >
                          Global Rank
                        </SelectItem>
                        <SelectItem
                          value="rank_open_rarity"
                          className={`cursor-pointer ${!filters.gen ? "cursor-not-allowed opacity-50" : ""}`}
                          disabled={!filters.gen}
                        >
                          Rank: OpenRarity
                        </SelectItem>
                        <SelectItem
                          value="rank_jungle"
                          className={`cursor-pointer ${!filters.gen ? "cursor-not-allowed opacity-50" : ""}`}
                          disabled={!filters.gen}
                        >
                          Rank: Jungle
                        </SelectItem>
                        <SelectItem
                          value="rank_rarity"
                          className={`cursor-pointer ${!filters.gen ? "cursor-not-allowed opacity-50" : ""}`}
                          disabled={!filters.gen}
                        >
                          Rank: RarityScore
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Order Toggle */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleSetFilters(
                          "order",
                          filters.order === "asc" ? "desc" : "asc",
                        )
                      }
                      disabled={isPending}
                      className="h-9"
                    >
                      {filters.order === "asc" ? (
                        <ArrowDown className="h-4 w-4" />
                      ) : (
                        <ArrowUp className="h-4 w-4" />
                      )}
                      <span className="">
                        See{" "}
                        {filters.order === "asc" ? "Descending" : "Ascending"}
                      </span>
                    </Button>

                    {/* Clear All Button */}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleClearAll}
                      disabled={isPending || !isFiltered}
                      className="h-9 gap-2"
                    >
                      {isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <XClose className="h-4 w-4" />
                      )}
                      Clear All
                    </Button>
                  </div>
                </div>

                {/* Search Input - Bottom */}
                <div className="flex flex-col gap-3">
                  <div className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                    Search
                  </div>
                  <InputGroup className="w-full">
                    <InputGroupInput
                      placeholder="Browse 0xNekos..."
                      value={filters.search}
                      onChange={(e) =>
                        handleSetFilters("search", e.target.value)
                      }
                    />
                    {isPending && (
                      <InputGroupAddon align="inline-end">
                        <Spinner />
                      </InputGroupAddon>
                    )}
                    {!isPending && (
                      <InputGroupAddon align="inline-end">
                        <KbdGroup>
                          <Kbd>⌘</Kbd>
                          <Kbd>K</Kbd>
                        </KbdGroup>
                      </InputGroupAddon>
                    )}
                  </InputGroup>
                </div>

                {/* Custom Title Row with Close - Bottom */}
                <div className="flex items-center justify-between border-border border-t py-3">
                  <h3 className="font-semibold text-base">Filter Nekos</h3>
                  <button
                    onClick={() => setIsSheetOpen(false)}
                    className="h-5 w-5"
                  >
                    <XClose className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Layout */}
        <div className="hidden items-center gap-3 md:flex md:flex-wrap">
          <h1 className="font-bold text-xl">
            <Link href="/">0xNekos</Link>
          </h1>
          {/* Search Input with Loading State */}
          <InputGroup className="min-w-48 flex-1">
            <InputGroupInput
              ref={inputRef}
              autoFocus
              placeholder="Browse by creator, id or name..."
              value={filters.search}
              onChange={(e) => handleSetFilters("search", e.target.value)}
            />
            {isPending && (
              <InputGroupAddon align="inline-end">
                <Spinner />
              </InputGroupAddon>
            )}
            {!isPending && (
              <InputGroupAddon align="inline-end">
                <KbdGroup>
                  <Kbd>⌘</Kbd>
                  <Kbd>K</Kbd>
                </KbdGroup>
              </InputGroupAddon>
            )}
          </InputGroup>

          {/* Sort, Order and Clear Group - Wrapped in InputGroup */}
          <InputGroup className="flex w-auto flex-none">
            {/* Sort By */}
            <div className="[&>button]:rounded-none [&>button]:border-0 [&>button]:bg-transparent [&>button]:shadow-none">
              <Select
                value={filters.sort}
                onValueChange={(val) => handleSetFilters("sort", val)}
                disabled={isPending}
              >
                <SelectTrigger className="h-9 w-full cursor-pointer">
                  <span>{SORT_LABELS[filters.sort] || "Sort By"}</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sequence" className="cursor-pointer">
                    Created At
                  </SelectItem>
                  <SelectItem value="block_number" className="cursor-pointer">
                    Block & Index
                  </SelectItem>
                  <SelectItem
                    value="transaction_fee"
                    className="cursor-pointer"
                  >
                    Transaction Fee
                  </SelectItem>
                  <SelectItem value="number" className="cursor-pointer">
                    Protocol Number
                  </SelectItem>
                  <SelectItem value="rank_global" className="cursor-pointer">
                    Global Rank
                  </SelectItem>
                  <SelectItem
                    value="rank_open_rarity"
                    className={`cursor-pointer ${!filters.gen ? "cursor-not-allowed opacity-50" : ""}`}
                    disabled={!filters.gen}
                  >
                    Rank: OpenRarity
                  </SelectItem>
                  <SelectItem
                    value="rank_jungle"
                    className={`cursor-pointer ${!filters.gen ? "cursor-not-allowed opacity-50" : ""}`}
                    disabled={!filters.gen}
                  >
                    Rank: Jungle
                  </SelectItem>
                  <SelectItem
                    value="rank_rarity"
                    className={`cursor-pointer ${!filters.gen ? "cursor-not-allowed opacity-50" : ""}`}
                    disabled={!filters.gen}
                  >
                    Rank: RarityScore
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Order Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                handleSetFilters(
                  "order",
                  filters.order === "asc" ? "desc" : "asc",
                )
              }
              disabled={isPending}
              className="h-9 gap-2 rounded-none border-0 shadow-none"
            >
              {filters.order === "asc" ? (
                <ArrowDown className="h-4 w-4" />
              ) : (
                <ArrowUp className="h-4 w-4" />
              )}
              See {filters.order === "asc" ? "Descending" : "Ascending"}
            </Button>
          </InputGroup>

          {/* Trait Selects Group - Wrapped in InputGroup */}
          <InputGroup className="flex w-auto flex-none">
            {renderTraitSelect("cat", "All Cats", traitOptions.cats, "Cat")}
            {renderTraitSelect("eyes", "All Eyes", traitOptions.eyes, "Eyes")}
            {renderTraitSelect(
              "background",
              "All Backgrounds",
              traitOptions.backgrounds,
              "Backgrounds",
            )}
            {renderTraitSelect(
              "cursor",
              "All Cursors",
              traitOptions.cursors,
              "Cursor",
            )}
            {renderTraitSelect("gen", "All Gens", traitOptions.gens, "Gen")}
            {renderTraitSelect("year", "All Years", traitOptions.years, "Year")}
          </InputGroup>

          {/* Clear All Button */}
          <Button
            variant="destructive"
            size="sm"
            onClick={handleClearAll}
            disabled={isPending || !isFiltered}
            className="h-9 gap-2"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <XClose className="h-4 w-4" />
            )}
            Clear All
          </Button>
        </div>
      </div>
    </div>
  );
}
