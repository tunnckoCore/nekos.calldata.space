"use client";

import { ArrowDown, ArrowUp, Loader2, X } from "lucide-react";
import { debounce } from "nuqs";
import { useMemo, useRef, useTransition } from "react";
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
import { Spinner } from "@/components/ui/spinner";
import { useSearchShortcuts } from "@/hooks/use-search-shortcuts";
import { useFilters } from "@/lib/gallery-search-params";
import { getDynamicTraitOptions } from "@/lib/neko-fetch";
import { useAllNekos } from "@/lib/queries";

export function GalleryFilters({ baseURL }: { baseURL: string }) {
  const [isPending, startTransition] = useTransition();
  const { data: allNekos } = useAllNekos(baseURL);
  const inputRef = useRef<HTMLInputElement>(null);

  const [filters, setFilters] = useFilters({
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
      backgrounds: getDynamicTraitOptions(allNekos, "background", filters),
      cats: getDynamicTraitOptions(allNekos, "cat", filters),
      eyes: getDynamicTraitOptions(allNekos, "eyes", filters),
      cursors: getDynamicTraitOptions(allNekos, "cursor", filters),
      gens: getDynamicTraitOptions(allNekos, "gen", filters),
      years: getDynamicTraitOptions(allNekos, "year", filters),
    };
  }, [allNekos, filters]);

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

  // Render trait select component
  const renderTraitSelect = (
    key: string,
    label: string,
    options: any[],
    placeholder: string,
  ) => {
    const selectValue = filters[key as keyof typeof filters] || "all";

    return (
      <div className="[&>button]:rounded-none [&>button]:border-0 [&>button]:bg-transparent [&>button]:shadow-none">
        <Select
          value={selectValue}
          onValueChange={(val) =>
            handleSetFilters(key, val === "all" ? "" : val)
          }
          disabled={isPending}
        >
          <SelectTrigger className="w-full h-9 cursor-pointer text-sm">
            <SelectValue placeholder={placeholder} />
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
    <div className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Search Input with Loading State */}
          <InputGroup className="flex-1 min-w-48">
            <InputGroupInput
              ref={inputRef}
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

          {/* Trait Selects Group - Wrapped in InputGroup */}
          <InputGroup className="flex-none flex w-auto">
            {renderTraitSelect("cat", "All Cats", traitOptions.cats, "Cat")}
            {renderTraitSelect("eyes", "All Eyes", traitOptions.eyes, "Eyes")}
            {renderTraitSelect(
              "background",
              "All Backgrounds",
              traitOptions.backgrounds,
              "Backgrounds",
            )}
            {renderTraitSelect("gen", "All Gens", traitOptions.gens, "Gen")}
            {renderTraitSelect(
              "cursor",
              "All Cursors",
              traitOptions.cursors,
              "Cursor",
            )}
            {renderTraitSelect("year", "All Years", traitOptions.years, "Year")}
          </InputGroup>

          {/* Sort, Order and Clear Group - Wrapped in InputGroup */}
          <InputGroup className="flex-none flex w-auto">
            {/* Sort By */}
            <div className="[&>button]:rounded-none [&>button]:border-0 [&>button]:bg-transparent [&>button]:shadow-none">
              <Select
                value={filters.sort}
                onValueChange={(val) => handleSetFilters("sort", val)}
                disabled={isPending}
              >
                <SelectTrigger className="w-full h-9 cursor-pointer">
                  <SelectValue placeholder="Sort" />
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
                    className={`cursor-pointer ${!filters.gen ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={!filters.gen}
                  >
                    Rank: OpenRarity
                  </SelectItem>
                  <SelectItem
                    value="rank_jungle"
                    className={`cursor-pointer ${!filters.gen ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={!filters.gen}
                  >
                    Rank: Jungle
                  </SelectItem>
                  <SelectItem
                    value="rank_rarity"
                    className={`cursor-pointer ${!filters.gen ? "opacity-50 cursor-not-allowed" : ""}`}
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
              {filters.order === "asc" ? "Descending" : "Ascending"}
            </Button>

            {/* Clear All Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              disabled={isPending || !isFiltered}
              className="h-9 gap-2 rounded-none border-0 shadow-none"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <X className="h-4 w-4" />
              )}
              Clear
            </Button>
          </InputGroup>
        </div>
      </div>
    </div>
  );
}
