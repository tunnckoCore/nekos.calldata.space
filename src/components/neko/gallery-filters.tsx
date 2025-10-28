"use client";

import { debounce } from "nuqs";
import { useAllNekos } from "@/lib/queries";
import { getDynamicTraitOptions } from "@/lib/neko-fetch";
import { useMemo, useTransition } from "react";
import { Loader2, X, ArrowUp, ArrowDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFilters } from "@/lib/gallery-search-params";

export function GalleryFilters() {
  const [isPending, startTransition] = useTransition();
  const { data: allNekos } = useAllNekos();

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
    filters.sort !== "created_at" ||
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
          limitUrlUpdates: val && key === "search" ? debounce(250) : undefined,
        },
      );
    });
  };

  return (
    <div className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-wrap items-center gap-2 px-4 py-3">
        {/* Search Input */}
        <Input
          autoFocus
          placeholder="Search by name or ID..."
          value={filters.search}
          onChange={(e) => handleSetFilters("search", e.target.value)}
          className="flex-1 min-w-[200px] h-9"
          disabled={isPending}
        />

        {/* Cat Color */}
        <Select
          value={filters.cat || "all"}
          onValueChange={(val) =>
            handleSetFilters("cat", val === "all" ? "" : val)
          }
          disabled={isPending}
        >
          <SelectTrigger className="w-28 h-9 cursor-pointer">
            <SelectValue placeholder="Cat" />
          </SelectTrigger>
          <SelectContent className="max-h-64">
            <SelectItem value="all" className="cursor-pointer">
              All Cats
            </SelectItem>
            {traitOptions.cats.map((option) => (
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

        {/* Eyes */}
        <Select
          value={filters.eyes || "all"}
          onValueChange={(val) =>
            handleSetFilters("eyes", val === "all" ? "" : val)
          }
          disabled={isPending}
        >
          <SelectTrigger className="w-28 h-9 cursor-pointer">
            <SelectValue placeholder="Eyes" />
          </SelectTrigger>
          <SelectContent className="max-h-64">
            <SelectItem value="all" className="cursor-pointer">
              All Eyes
            </SelectItem>
            {traitOptions.eyes.map((option) => (
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

        {/* Background */}
        <Select
          value={filters.background || "all"}
          onValueChange={(val) =>
            handleSetFilters("background", val === "all" ? "" : val)
          }
          disabled={isPending}
        >
          <SelectTrigger className="w-28 h-9 cursor-pointer">
            <SelectValue placeholder="BG" />
          </SelectTrigger>
          <SelectContent className="max-h-64">
            <SelectItem value="all" className="cursor-pointer">
              All BG
            </SelectItem>
            {traitOptions.backgrounds.map((option) => (
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

        {/* Generation */}
        <Select
          value={filters.gen || "all"}
          onValueChange={(val) =>
            handleSetFilters("gen", val === "all" ? "" : val)
          }
          disabled={isPending}
        >
          <SelectTrigger className="w-28 h-9 cursor-pointer">
            <SelectValue placeholder="Gen" />
          </SelectTrigger>
          <SelectContent className="max-h-64">
            <SelectItem value="all" className="cursor-pointer">
              All Gens
            </SelectItem>
            {traitOptions.gens.map((option) => (
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

        {/* Cursor */}
        <Select
          value={filters.cursor || "all"}
          onValueChange={(val) =>
            handleSetFilters("cursor", val === "all" ? "" : val)
          }
          disabled={isPending}
        >
          <SelectTrigger className="w-28 h-9 cursor-pointer">
            <SelectValue placeholder="Cursor" />
          </SelectTrigger>
          <SelectContent className="max-h-64">
            <SelectItem value="all" className="cursor-pointer">
              All Cursors
            </SelectItem>
            {traitOptions.cursors.map((option) => (
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

        {/* Year */}
        <Select
          value={filters.year || "all"}
          onValueChange={(val) =>
            handleSetFilters("year", val === "all" ? "" : val)
          }
          disabled={isPending}
        >
          <SelectTrigger className="w-28 h-9 cursor-pointer">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent className="max-h-64">
            <SelectItem value="all" className="cursor-pointer">
              All Years
            </SelectItem>
            {traitOptions.years.map((option) => (
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

        {/* Sort By */}
        <Select
          value={filters.sort}
          onValueChange={(val) => handleSetFilters("sort", val)}
          disabled={isPending}
        >
          <SelectTrigger className="w-32 h-9 cursor-pointer">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at" className="cursor-pointer">
              Created At
            </SelectItem>
            <SelectItem value="block_number" className="cursor-pointer">
              Block
            </SelectItem>
            <SelectItem value="transaction_fee" className="cursor-pointer">
              Fee
            </SelectItem>
            <SelectItem value="transaction_index" className="cursor-pointer">
              Index
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Order Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            handleSetFilters("order", filters.order === "asc" ? "desc" : "asc")
          }
          disabled={isPending}
          className="h-9 gap-2"
        >
          {filters.order === "asc" ? (
            <ArrowUp className="h-4 w-4" />
          ) : (
            <ArrowDown className="h-4 w-4" />
          )}
          {filters.order === "asc" ? "Ascending" : "Descending"}
        </Button>

        {/* Clear All Button - Fixed Right */}
        <Button
          variant={isFiltered ? "default" : "outline"}
          size="sm"
          onClick={handleClearAll}
          disabled={isPending || !isFiltered}
          className="h-9 ml-auto gap-2"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <X className="h-4 w-4" />
          )}
          Clear
        </Button>
      </div>
    </div>
  );
}
