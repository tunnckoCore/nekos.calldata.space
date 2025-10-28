"use client";

import { debounce } from "nuqs";
import { useAllNekos } from "@/lib/queries";
import { getDynamicTraitOptions } from "@/lib/neko-fetch";
import { useMemo, useTransition, useRef } from "react";
import { Loader2, X, ArrowUp, ArrowDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Spinner } from "@/components/ui/spinner";
import { useFilters } from "@/lib/gallery-search-params";
import { useSearchShortcuts } from "@/hooks/use-search-shortcuts";

export function GalleryFilters() {
  const [isPending, startTransition] = useTransition();
  const { data: allNekos } = useAllNekos();
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
          limitUrlUpdates: key === "search" ? debounce(250) : undefined,
        },
      );
    });
  };

  // Set up keyboard shortcuts for search input
  useSearchShortcuts(inputRef);

  return (
    <div className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-4 py-3">
        {/* All Filters on One Line */}
        <div className="flex items-center gap-3">
          {/* Search Input with Loading State */}
          <InputGroup className="flex-1 min-w-48">
            <InputGroupInput
              ref={inputRef}
              autoFocus
              placeholder="Search by name or ID..."
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
            {/* Cat Color */}
            <div className="[&>button]:rounded-none [&>button]:border-0 [&>button]:bg-transparent [&>button]:shadow-none">
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
            </div>

            {/* Eyes */}
            <div className="[&>button]:rounded-none [&>button]:border-0 [&>button]:bg-transparent [&>button]:shadow-none">
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
            </div>

            {/* Background */}
            <div className="[&>button]:rounded-none [&>button]:border-0 [&>button]:bg-transparent [&>button]:shadow-none">
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
            </div>

            {/* Generation */}
            <div className="[&>button]:rounded-none [&>button]:border-0 [&>button]:bg-transparent [&>button]:shadow-none">
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
            </div>

            {/* Cursor */}
            <div className="[&>button]:rounded-none [&>button]:border-0 [&>button]:bg-transparent [&>button]:shadow-none">
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
            </div>

            {/* Year */}
            <div className="[&>button]:rounded-none [&>button]:border-0 [&>button]:bg-transparent [&>button]:shadow-none">
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
            </div>
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
                  <SelectItem
                    value="transaction_fee"
                    className="cursor-pointer"
                  >
                    Fee
                  </SelectItem>
                  <SelectItem
                    value="transaction_index"
                    className="cursor-pointer"
                  >
                    Index
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
                <ArrowUp className="h-4 w-4" />
              ) : (
                <ArrowDown className="h-4 w-4" />
              )}
              {filters.order === "asc" ? "Ascending" : "Descending"}
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
