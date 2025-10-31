import fs from "node:fs/promises";
import path from "node:path";

import type { Neko } from "@/lib/neko";

interface NekoTrait {
  block: number;
  year: number;
  gen: string;
  background: string;
  cat: string;
  eyes: string;
  cursor: string;
  glitched?: boolean; // Hidden trait for items 2-18 and 32
}

interface NekoItem {
  index: number;
  traits: NekoTrait;
}

interface RarityResult {
  index: number;
  rarityScore: number;
  jungleRarityScore: number;
  openRarity: number;
  rarityRank: number;
  jungleRank: number;
  openRarityRank: number;
}

interface RarityResultWithGlitched extends RarityResult {
  rarityScoreWithGlitched: number;
  jungleRarityScoreWithGlitched: number;
  openRarityWithGlitched: number;
  rarityRankWithGlitched: number;
  jungleRankWithGlitched: number;
  openRarityRankWithGlitched: number;
}

class NekoRarityCalculator {
  private collection: NekoItem[];
  private traitCounts: Map<string, Map<string, number>>;
  private totalItems: number;
  private traitCategories = ["background", "cat", "eyes", "cursor"];
  private visualTraitCategories = ["background", "cat", "eyes", "cursor"];

  constructor(collection: NekoItem[]) {
    const clone = (x) =>
      typeof structuredClone === "function"
        ? structuredClone?.(x)
        : JSON.parse(JSON.stringify(x));

    this.collection = [...collection].map(clone);
    this.totalItems = collection.length;
    this.traitCounts = this.calculateTraitCounts();
    this.addGlitchedTrait();
  }

  private addGlitchedTrait(): void {
    // Add glitched trait to items 2-18 (inclusive) and 32
    // Note: assuming index 0-based, so items at indices 1-17 and 31
    this.collection = this.collection.map((item) => {
      if (!item.traits.gen.toLowerCase().includes("eths")) {
        return item;
      }

      const itemNumber = item.index;

      if ((itemNumber >= 2 && itemNumber <= 18) || itemNumber === 32) {
        item.traits.glitched = true;
      } else {
        item.traits.glitched = false;
      }
      return item;
    });

    // Recalculate trait counts to include glitched
    this.traitCounts = this.calculateTraitCounts();
  }

  private calculateTraitCounts(): Map<string, Map<string, number>> {
    const traitCounts = new Map<string, Map<string, number>>();

    // Initialize trait categories (including glitched)
    const allCategories = [
      ...this.visualTraitCategories,
      "glitched",
      "year",
      "gen",
    ];
    allCategories.forEach((category) => {
      traitCounts.set(category, new Map<string, number>());
    });

    // Count occurrences of each trait value
    this.collection.forEach((item) => {
      allCategories.forEach((category) => {
        const value =
          item.traits[category as keyof NekoTrait]?.toString() || "false";
        const categoryMap = traitCounts.get(category)!;
        categoryMap.set(value, (categoryMap.get(value) || 0) + 1);
      });
    });

    return traitCounts;
  }

  // Method 1: Rarity Score (Best for small collections)
  private calculateRarityScore(item: NekoItem): number {
    const traits = item.traits;
    let totalScore = 0;

    this.traitCategories.forEach((category) => {
      const value = traits[category as keyof NekoTrait]?.toString() || "";
      const count = this.traitCounts.get(category)!.get(value) || 1;
      const rarity = count / this.totalItems;
      const score = 1 / rarity;
      totalScore += score;
    });

    return Math.round(totalScore * 100) / 100;
  }

  // Method 2: Jungle Rarity Score (JRS) - Normalized for trait category size
  private calculateJungleRarityScore(item: NekoItem): number {
    const traits = item.traits;
    let totalScore = 0;

    this.traitCategories.forEach((category) => {
      const value = traits[category as keyof NekoTrait]?.toString() || "";
      const count = this.traitCounts.get(category)!.get(value) || 1;
      const categoryMap = this.traitCounts.get(category)!;
      const uniqueValuesInCategory = categoryMap.size;

      // JRS formula: (1 / (trait_count / total_items)) * (unique_values_in_category / total_categories)
      const rarity = count / this.totalItems;
      const normalizationFactor =
        uniqueValuesInCategory / this.traitCategories.length;
      const score = (1 / rarity) * normalizationFactor;

      totalScore += score;
    });

    return Math.round(totalScore * 100) / 100;
  }

  // Method 3: OpenRarity Compatible (Information Content approach)
  // private calculateOpenRarity(item: NekoItem): number {
  //   const traits = item.traits;

  //   // Create collection-wide probability list like Python implementation
  //   const allProbabilities: number[] = [];

  //   // Sort trait categories to match OpenRarity reference implementation
  //   const sortedCategories = [...this.traitCategories].sort();

  //   // Build complete probability list for entropy calculation
  //   sortedCategories.forEach((category) => {
  //     const categoryMap = this.traitCounts.get(category)!;

  //     // Add probabilities for all existing trait values
  //     categoryMap.forEach((count) => {
  //       const probability = count / this.totalItems;
  //       allProbabilities.push(probability);
  //     });

  //     // Check if any tokens are missing this trait category entirely
  //     const totalWithTrait = Array.from(categoryMap.values()).reduce(
  //       (sum, c) => sum + c,
  //       0
  //     );
  //     const nullCount = this.totalItems - totalWithTrait;
  //     if (nullCount > 0) {
  //       const nullProbability = nullCount / this.totalItems;
  //       allProbabilities.push(nullProbability);
  //     }
  //   });

  //   // Calculate collection entropy using all probabilities
  //   const collectionEntropy = -allProbabilities.reduce((sum, prob) => {
  //     return sum + prob * Math.log2(prob);
  //   }, 0);

  //   // Calculate token's information content
  //   let informationContent = 0;

  //   sortedCategories.forEach((category) => {
  //     const value = traits[category as keyof NekoTrait]?.toString() || "false";
  //     const categoryMap = this.traitCounts.get(category)!;
  //     const count = categoryMap.get(value) || 0;

  //     let probability: number;
  //     if (count > 0) {
  //       // Token has this trait value
  //       probability = count / this.totalItems;
  //     } else {
  //       // Token has null/missing trait - calculate null probability
  //       const totalWithTrait = Array.from(categoryMap.values()).reduce(
  //         (sum, c) => sum + c,
  //         0
  //       );
  //       const nullCount = this.totalItems - totalWithTrait;
  //       probability = nullCount / this.totalItems;
  //     }

  //     informationContent += -Math.log2(probability);
  //   });

  //   // OpenRarity score = I(x) / collection_entropy
  //   const openRarityScore = informationContent / (collectionEntropy || 1);

  //   // Use higher precision to avoid rounding issues that affect ranking
  //   return Math.round(openRarityScore * 100_000) / 100_000;
  // }

  private calculateOpenRarity(item: NekoItem): number {
    const traits = item.traits;
    let informationContent = 0;

    // Calculate base OpenRarity score on visual traits only
    this.visualTraitCategories.forEach((category) => {
      const value = traits[category as keyof NekoTrait]?.toString() || "";
      const count = this.traitCounts.get(category)!.get(value) || 1;
      const probability = count / this.totalItems;

      // Information Content = -log2(probability)
      const ic = -Math.log2(probability);
      informationContent += ic;
    });

    // Add normalization factor for visual traits only
    const normalizedIC = informationContent / this.visualTraitCategories.length;

    return Math.round(normalizedIC * 1000) / 1000;
  }

  // Method 1 with Glitched: Standard Rarity Score on visual traits + glitched bonus
  private calculateRarityScoreWithGlitched(item: NekoItem): number {
    const traits = item.traits;
    let totalScore = 0;

    // Calculate base score on visual traits only
    this.visualTraitCategories.forEach((category) => {
      const value = traits[category as keyof NekoTrait]?.toString() || "";
      const count = this.traitCounts.get(category)!.get(value) || 1;
      const rarity = count / this.totalItems;
      const score = 1 / rarity;
      totalScore += score;
    });

    // Apply 27% bonus for glitched items
    if (traits.glitched === true) {
      totalScore *= 1.27;
    }

    return Math.round(totalScore * 100) / 100;
  }

  // Method 2 with Glitched: Jungle Rarity Score on visual traits + glitched bonus
  private calculateJungleRarityScoreWithGlitched(item: NekoItem): number {
    const traits = item.traits;
    let totalScore = 0;

    // Calculate base JRS score on visual traits only
    this.visualTraitCategories.forEach((category) => {
      const value = traits[category as keyof NekoTrait]?.toString() || "";
      const count = this.traitCounts.get(category)!.get(value) || 1;
      const categoryMap = this.traitCounts.get(category)!;
      const uniqueValuesInCategory = categoryMap.size;

      // JRS formula on visual traits
      const rarity = count / this.totalItems;
      const normalizationFactor =
        uniqueValuesInCategory / this.visualTraitCategories.length;
      const score = (1 / rarity) * normalizationFactor;
      totalScore += score;
    });

    // Apply 27% bonus for glitched items
    if (traits.glitched === true) {
      totalScore *= 1.27;
    }

    return Math.round(totalScore * 100) / 100;
  }

  // Method 3 with Glitched: OpenRarity on visual traits + glitched bonus
  private calculateOpenRarityWithGlitched(item: NekoItem): number {
    const traits = item.traits;
    let informationContent = 0;

    // Calculate base OpenRarity score on visual traits only
    this.visualTraitCategories.forEach((category) => {
      const value = traits[category as keyof NekoTrait]?.toString() || "";
      const count = this.traitCounts.get(category)!.get(value) || 1;
      const probability = count / this.totalItems;

      // Information Content = -log2(probability)
      const ic = -Math.log2(probability);
      informationContent += ic;
    });

    // Add normalization factor for visual traits only
    const normalizedIC = informationContent / this.visualTraitCategories.length;

    // Apply 7% bonus for glitched items
    let finalScore = normalizedIC;
    if (traits.glitched === true) {
      finalScore *= 1.07;
    }

    return Math.round(finalScore * 1000) / 1000;
  }

  // Calculate all rarity metrics for the collection
  calculateAllRarities(): RarityResult[] {
    const results: RarityResult[] = this.collection.map((item) => ({
      index: (item as any).sequence || item.index,
      rarityScore: this.calculateRarityScore(item),
      jungleRarityScore: this.calculateJungleRarityScore(item),
      openRarity: this.calculateOpenRarity(item),
      rarityRank: 0, // Will be set after sorting
      jungleRank: 0,
      openRarityRank: 0,
    }));

    // Calculate ranks
    this.assignRanks(results);

    return results;
  }

  private assignRanks(results: RarityResult[]): void {
    // Sort by rarity score (higher = rarer)
    const sortedByRarity = [...results].sort(
      (a, b) => b.rarityScore - a.rarityScore,
    );
    sortedByRarity.forEach((item, index) => {
      const original = results.find((r) => r.index === item.index)!;
      original.rarityRank = index + 1;
    });

    // Sort by jungle rarity score (higher = rarer)
    const sortedByJungle = [...results].sort(
      (a, b) => b.jungleRarityScore - a.jungleRarityScore,
    );
    sortedByJungle.forEach((item, index) => {
      const original = results.find((r) => r.index === item.index)!;
      original.jungleRank = index + 1;
    });

    // Sort by OpenRarity (higher scores = rarer items)
    const sortedByOpenRarity = [...results].sort(
      (a, b) => b.openRarity - a.openRarity,
    );
    sortedByOpenRarity.forEach((item, index) => {
      const original = results.find((r) => r.index === item.index)!;
      original.openRarityRank = index + 1;
    });
  }

  // Calculate all rarity metrics including glitched trait
  calculateAllRaritiesWithGlitched(): RarityResultWithGlitched[] {
    const baseResults = this.calculateAllRarities();

    const resultsWithGlitched: RarityResultWithGlitched[] = this.collection.map(
      (item, index) => ({
        ...baseResults[index],
        rarityScoreWithGlitched: this.calculateRarityScoreWithGlitched(item),
        jungleRarityScoreWithGlitched:
          this.calculateJungleRarityScoreWithGlitched(item),
        openRarityWithGlitched: this.calculateOpenRarityWithGlitched(item),
        rarityRankWithGlitched: 0,
        jungleRankWithGlitched: 0,
        openRarityRankWithGlitched: 0,
      }),
    );

    // Calculate ranks with glitched trait
    this.assignRanksWithGlitched(resultsWithGlitched);

    return resultsWithGlitched;
  }

  private assignRanksWithGlitched(results: RarityResultWithGlitched[]): void {
    // Sort by rarity score with glitched (higher = rarer)
    const sortedByRarity = [...results].sort(
      (a, b) => b.rarityScoreWithGlitched - a.rarityScoreWithGlitched,
    );
    sortedByRarity.forEach((item, index) => {
      const original = results.find((r) => r.index === item.index)!;
      original.rarityRankWithGlitched = index + 1;
    });

    // Sort by jungle rarity score with glitched (higher = rarer)
    const sortedByJungle = [...results].sort(
      (a, b) =>
        b.jungleRarityScoreWithGlitched - a.jungleRarityScoreWithGlitched,
    );
    sortedByJungle.forEach((item, index) => {
      const original = results.find((r) => r.index === item.index)!;
      original.jungleRankWithGlitched = index + 1;
    });

    // Sort by OpenRarity with glitched (higher IC = rarer)
    const sortedByOpenRarity = [...results].sort(
      (a, b) => b.openRarityWithGlitched - a.openRarityWithGlitched,
    );
    sortedByOpenRarity.forEach((item, index) => {
      const original = results.find((r) => r.index === item.index)!;
      original.openRarityRankWithGlitched = index + 1;
    });
  }

  // Get the rarest items by different metrics
  getTopRarest(count = 10): {
    byRarityScore: RarityResult[];
    byJungleScore: RarityResult[];
    byOpenRarity: RarityResult[];
  } {
    const allResults = this.calculateAllRarities();

    return {
      byRarityScore: allResults
        .filter((r) => r.rarityRank <= count)
        .sort((a, b) => a.rarityScore - b.rarityScore),
      byJungleScore: allResults
        .filter((r) => r.jungleRank <= count)
        .sort((a, b) => a.jungleRank - b.jungleRank),
      byOpenRarity: allResults
        .filter((r) => r.openRarityRank <= count)
        .sort((a, b) => a.openRarity - b.openRarity),
    };
  }

  // Get the rarest items including glitched trait
  getTopRarestWithGlitched(count = 10): {
    byRarityScore: RarityResultWithGlitched[];
    byJungleScore: RarityResultWithGlitched[];
    byOpenRarity: RarityResultWithGlitched[];
  } {
    const allResults = this.calculateAllRaritiesWithGlitched();

    return {
      byRarityScore: allResults
        .filter((r) => r.rarityRankWithGlitched <= count)
        .sort((a, b) => a.rarityRankWithGlitched - b.rarityRankWithGlitched),
      byJungleScore: allResults
        .filter((r) => r.jungleRankWithGlitched <= count)
        .sort((a, b) => a.jungleRankWithGlitched - b.jungleRankWithGlitched),
      byOpenRarity: allResults
        .filter((r) => r.openRarityRankWithGlitched <= count)
        .sort(
          (a, b) => a.openRarityRankWithGlitched - b.openRarityRankWithGlitched,
        ),
    };
  }

  // Analyze trait distribution
  getTraitAnalysis(): Record<
    string,
    {
      total: number;
      unique: number;
      mostRare: string;
      rarest: number;
      entropy: number;
    }
  > {
    const analysis: Record<string, any> = {};

    this.traitCategories.forEach((category) => {
      const categoryMap = this.traitCounts.get(category)!;
      const counts = Array.from(categoryMap.values());
      const minCount = Math.min(...counts);
      const mostRareTraits = Array.from(categoryMap.entries()).filter(
        ([_, count]) => count === minCount,
      );

      // Calculate entropy (measure of randomness/diversity)
      let entropy = 0;
      counts.forEach((count) => {
        const probability = count / this.totalItems;
        entropy -= probability * Math.log2(probability);
      });

      analysis[category] = {
        total: this.totalItems,
        unique: categoryMap.size,
        mostRare: mostRareTraits.map(([trait, _]) => trait).join(", "),
        rarest: minCount,
        entropy: Math.round(entropy * 1000) / 1000,
      };
    });

    return analysis;
  }

  // Analyze trait distribution including glitched
  getTraitAnalysisWithGlitched(): Record<
    string,
    {
      total: number;
      unique: number;
      mostRare: string;
      rarest: number;
      entropy: number;
    }
  > {
    const analysis: Record<string, any> = {};

    [...this.visualTraitCategories, "glitched"].forEach((category) => {
      const categoryMap = this.traitCounts.get(category)!;
      const counts = Array.from(categoryMap.values());
      const minCount = Math.min(...counts);
      const mostRareTraits = Array.from(categoryMap.entries()).filter(
        ([_, count]) => count === minCount,
      );

      // Calculate entropy (measure of randomness/diversity)
      let entropy = 0;
      counts.forEach((count) => {
        const probability = count / this.totalItems;
        entropy -= probability * Math.log2(probability);
      });

      analysis[category] = {
        total: this.totalItems,
        unique: categoryMap.size,
        mostRare: mostRareTraits.map(([trait, _]) => trait).join(", "),
        rarest: minCount,
        entropy: Math.round(entropy * 1000) / 1000,
      };
    });

    return analysis;
  }

  // Get detailed comparison for a specific item
  getItemAnalysis(id: number):
    | (RarityResult & {
        traitBreakdown: Record<
          string,
          { value: string; count: number; rarity: number; ic: number }
        >;
      })
    | null {
    const allResults = this.calculateAllRarities();
    const result = allResults.find((r) => r.index === id);
    const item = this.collection.find((n) => n.index === id);

    if (!result || !item) {
      return null;
    }

    const traitBreakdown: Record<string, any> = {};
    this.traitCategories.forEach((category) => {
      const value = item.traits[category as keyof NekoTrait]?.toString() || "";
      const count = this.traitCounts.get(category)!.get(value) || 1;
      const rarity = count / this.totalItems;
      const ic = -Math.log2(rarity);

      traitBreakdown[category] = {
        value,
        count,
        rarity: Math.round(rarity * 10_000) / 100, // percentage
        ic: Math.round(ic * 1000) / 1000,
      };
    });

    return {
      ...result,
      traitBreakdown,
    };
  }
}

const { data: all381nekos }: { data: Neko[] } = JSON.parse(
  await fs.readFile(path.join(__dirname, "../../public/0xnekos.json"), "utf8"),
);

const nekoNfts = all381nekos.filter((item) => item.traits.gen === "OG");
const nekoOrdi = all381nekos.filter((item) => item.traits.gen === "Ordinals");
const nekoEths = all381nekos.filter(
  (item) => item.traits.gen === "Ethscriptions",
);

const nftsRanks = await analyze(nekoNfts.length, nekoNfts);
const ordiRanks = await analyze(nekoOrdi.length, nekoOrdi);
const ethsRanks = await analyze(nekoEths.length, nekoEths, true);

const combined = [
  ...withRankings(nekoNfts, nftsRanks),
  ...withRankings(nekoOrdi, ordiRanks),
  ...withRankings(nekoEths, ethsRanks),
];

// const combined = [...nekoNfts, ...nekoOrdi, ...nekoEths];

const overallRanks = await analyze(combined.length, combined, true);

// console.log(JSON.stringify(overallRanks, null, 2));

console.log(
  JSON.stringify(
    combined.map((item, idx) => ({
      ...item,
      rankings: {
        ...item.rankings,
        global: overallRanks[idx].jungle,
      },
    })),
    // .sort((a, b) => b.rankings.global.score - a.rankings.global.score),
    null,
    2,
  ),
);

function withRankings(data, nekosWithRankings) {
  return data.map((neko, idx) => {
    return {
      ...neko,
      rankings: nekosWithRankings[idx],
    };
  });
}

async function analyze(top: number, data: any, glitched: boolean = false) {
  const calc = new NekoRarityCalculator(data as any);
  const topRarest = glitched
    ? calc.getTopRarestWithGlitched(top)
    : calc.getTopRarest(top);

  // const logger = (ranking: string, items: any[]): any => {
  //   const rows = items
  //     .map((item) => {
  //       const neko = data.find((n: any) => n.index === item.index)!;
  //       return {
  //         Sequence: item.index,
  //         ...(isEths
  //           ? { Ethscription: neko.ethscription_number.toLocaleString() }
  //           : {}),
  //         [ranking.toLowerCase().includes("open")
  //           ? "Open Rarity"
  //           : ranking.toLowerCase().includes("jungle")
  //             ? "Jungle Score"
  //             : "Rarity Score"]: item[ranking],
  //         Background: neko.traits.background,
  //         Cat: neko.traits.cat,
  //         Eyes: neko.traits.eyes,
  //         Cursor: neko.traits.cursor,
  //         Txn: neko.transaction_hash,
  //       };
  //     })
  //     .sort((a: any, b: any) => {
  //       const rrr: any = [
  //         ranking.toLowerCase().includes("open")
  //           ? "Open Rarity"
  //           : ranking.toLowerCase().includes("jungle")
  //             ? "Jungle Score"
  //             : "Rarity Score",
  //       ];

  //       return b[rrr] - a[rrr];
  //     });

  //   // Turn the array into an object whose keys are 1-based ranks
  //   const byRank = Object.fromEntries(rows.map((r, i) => [String(i + 1), r]));

  //   console.table(byRank);
  // };

  const nekosWithRankings = topRarest.byOpenRarity
    .sort((a, b) => a.index - b.index)
    .map((rank) => ({
      openRarity: {
        score: rank.openRarity,
        rank: rank.openRarityRank,
      },
      rarity: {
        score: rank.rarityScore,
        rank: rank.rarityRank,
      },
      jungle: {
        score: rank.jungleRarityScore,
        rank: rank.jungleRank,
      },
    }));

  return nekosWithRankings;

  // console.log(
  //   JSON.stringify(
  //     all381nekos.map((neko, idx) => ({
  //       ...neko,
  //       rankings: {
  //         openRarity: topRarest.byOpenRarity[idx].openRarity,
  //         openRarityRank: topRarest.byOpenRarity[idx].openRarityRank,
  //         jungleRarityScore: topRarest.byOpenRarity[idx].jungleRarityScore,
  //         jungleRarityScoreRank: topRarest.byOpenRarity[idx].jungleRank,
  //         rarityScore: topRarest.byOpenRarity[idx].rarityScore,
  //         rarityScoreRank: topRarest.byOpenRarity[idx].rarityRank,
  //       },
  //     })),
  //     null,
  //     2,
  //   ),
  // );

  // interface RarityResult {
  //   index: number;
  //   rarityScore: number;
  //   jungleRarityScore: number;
  //   openRarity: number;
  //   rarityRank: number;
  //   jungleRank: number;
  //   openRarityRank: number;
  // }
  // console.log(`\n=== ANALYZING: ${analyzeFor} ===`);

  // console.log(`=== TOP ${top} RAREST (by Rarity Score) ===`);
  // logger(
  //   isEths ? "rarityScoreWithGlitched" : "rarityScore",
  //   topRarest.byRarityScore,
  // );

  // console.log(`=== TOP ${top} RAREST (by Jungle Rarity Score) ===`);
  // logger(
  //   isEths ? "jungleRarityScoreWithGlitched" : "jungleRarityScore",
  //   topRarest.byJungleScore,
  // );

  // console.log(`=== TOP ${top} RAREST (by OpenRarity) ===`);
  // logger(
  //   isEths ? "openRarityWithGlitched" : "openRarity",
  //   topRarest.byOpenRarity,
  // );
  // console.log("OpenRarity", topRarest.byOpenRarity);
}

// console.log(nekosEthsTopRarest.byJungleScore);

// // Usage example:
// function analyzeNekoCollection(nekosData: NekoItem[]) {
//   const calculator = new NekoRarityCalculator(nekosData);

//   // Get comprehensive analysis
//   const allRarities = calculator.calculateAllRarities();
//   const topRarest = calculator.getTopRarest(10);
//   const traitAnalysis = calculator.getTraitAnalysis();

//   // Get analysis with glitched trait
//   // const allRaritiesWithGlitched = calculator.calculateAllRaritiesWithGlitched();
//   // const topRarestWithGlitched = calculator.getTopRarestWithGlitched(50);
//   // const traitAnalysisWithGlitched = calculator.getTraitAnalysisWithGlitched();

//   console.log("=== NEKO COLLECTION ANALYSIS ===");
//   console.log(`Total items: ${nekosData.length}`);
//   // console.log("\n=== TRAIT DISTRIBUTION (Standard) ===");

//   // Format trait analysis for better terminal display
//   Object.entries(traitAnalysis).forEach(([category, data]) => {
//     console.log(`\n${category.toUpperCase()}:`);
//     console.log(`  Total items: ${data.total}`);
//     console.log(`  Unique values: ${data.unique}`);
//     console.log(
//       `  Rarest traits: ${data.mostRare} (${data.rarest} occurrences)`
//     );
//     console.log(`  Entropy: ${data.entropy}`);
//   });

//   // console.log("\n=== TRAIT DISTRIBUTION (With Hidden Glitched Trait) ===");
//   // Object.entries(traitAnalysisWithGlitched).forEach(([category, data]) => {
//   //   console.log(`\n${category.toUpperCase()}:`);
//   //   console.log(`  Total items: ${data.total}`);
//   //   console.log(`  Unique values: ${data.unique}`);
//   //   console.log(
//   //     `  Rarest traits: ${data.mostRare} (${data.rarest} occurrences)`
//   //   );
//   //   console.log(`  Entropy: ${data.entropy}`);
//   // });

//   console.log("\n=== TOP 10 RAREST (by Rarity Score) ===");
//   topRarest.byRarityScore.forEach((item, i) => {
//     const neko = nekosData.find((n) => n.index === item.index)!;
//     console.log(
//       `${i + 1}. #${item.index} - Score: ${item.rarityScore} | ${neko.traits.background} ${neko.traits.cat} ${neko.traits.eyes} ${neko.traits.cursor}`
//     );
//   });

//   console.log("\n=== TOP 10 RAREST (by Jungle Rarity Score) ===");
//   topRarest.byJungleScore.forEach((item, i) => {
//     const neko = nekosData.find((n) => n.index === item.index)!;
//     console.log(
//       `${i + 1}. #${item.index} - JRS: ${item.jungleRarityScore} | ${neko.traits.background} ${neko.traits.cat} ${neko.traits.eyes} ${neko.traits.cursor}`
//     );
//   });

//   console.log("\n=== TOP 10 RAREST (by OpenRarity) ===");
//   topRarest.byOpenRarity.forEach((item, i) => {
//     const neko = nekosData.find((n) => n.index === item.index)!;
//     console.log(
//       `${i + 1}. #${item.index} - OpenRarity: ${item.openRarity} | ${neko.traits.background} ${neko.traits.cat} ${neko.traits.eyes} ${neko.traits.cursor}`
//     );
//   });

//   // console.log("\n=== TOP 10 RAREST (by Rarity Score WITH GLITCHED TRAIT) ===");
//   // topRarestWithGlitched.byRarityScore.forEach((item, i) => {
//   //   const neko = nekosData.find(
//   //     (n) => n.ethscription_number === item.ethscription_number
//   //   )!;
//   //   const glitchedStatus = neko.traits.glitched ? "GLITCHED" : "normal";
//   //   console.log(
//   //     `${i + 1}. #${item.ethscription_number} - Score: ${item.rarityScoreWithGlitched} [${glitchedStatus}] | ${neko.traits.background} ${neko.traits.cat} ${neko.traits.eyes} ${neko.traits.cursor}`
//   //   );
//   // });

//   // console.log(
//   //   "\n=== TOP 10 RAREST (by Jungle Rarity Score WITH GLITCHED TRAIT) ==="
//   // );
//   // topRarestWithGlitched.byJungleScore.forEach((item, i) => {
//   //   const neko = nekosData.find(
//   //     (n) => n.ethscription_number === item.ethscription_number
//   //   )!;
//   //   const glitchedStatus = neko.traits.glitched ? "GLITCHED" : "normal";
//   //   console.log(
//   //     `${i + 1}. #${item.ethscription_number} - JRS: ${item.jungleRarityScoreWithGlitched} [${glitchedStatus}] | ${neko.traits.background} ${neko.traits.cat} ${neko.traits.eyes} ${neko.traits.cursor}`
//   //   );
//   // });

//   // console.log("\n=== TOP 10 RAREST (by OpenRarity WITH GLITCHED TRAIT) ===");
//   // topRarestWithGlitched.byOpenRarity.forEach((item, i) => {
//   //   const neko = nekosData.find(
//   //     (n) => n.ethscription_number === item.ethscription_number
//   //   )!;
//   //   const glitchedStatus = neko.traits.glitched ? "GLITCHED" : "normal";
//   //   console.log(
//   //     `${i + 1}. #${item.ethscription_number} - OpenRarity: ${item.openRarityWithGlitched} [${glitchedStatus}] | ${neko.traits.background} ${neko.traits.cat} ${neko.traits.eyes} ${neko.traits.cursor}`
//   //   );
//   // });

//   // // Show detailed analysis for the rarest item
//   // const rarest = topRarest.byRarityScore[0];
//   // const detailedAnalysis = calculator.getItemAnalysis(
//   //   rarest.ethscription_number
//   // );
//   // if (detailedAnalysis) {
//   //   console.log(
//   //     `\n=== DETAILED ANALYSIS FOR RAREST ITEM #${rarest.ethscription_number} ===`
//   //   );
//   //   console.log("Trait Breakdown:");
//   //   console.table(detailedAnalysis.traitBreakdown);
//   // }

//   return {
//     allRarities,
//     topRarest,
//     traitAnalysis,
//     // allRaritiesWithGlitched,
//     // topRarestWithGlitched,
//     // traitAnalysisWithGlitched,
//   };
// }

// if (import.meta.main) {
//   try {
//     console.log("Starting analysis...");
//     analyzeNekoCollection(
//       (await import("../public/0xnekos-og.json", {
//         with: { type: "json" },
//       }).then((module) => module.default)) as any
//     );
//     console.log("Analysis completed successfully!");
//   } catch (error) {
//     console.error("Error during analysis:", error);
//   }
// }

export {
  NekoRarityCalculator,
  // type analyzeNekoCollection,
  type RarityResult,
  type RarityResultWithGlitched,
  type NekoItem,
};
