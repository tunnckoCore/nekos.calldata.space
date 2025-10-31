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
  ethscription_number: number;
  traits: NekoTrait;
  // other properties...
}

interface RarityResult {
  ethscription_number: number;
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
  private traitCategories: string[] = ["background", "cat", "eyes", "cursor"];
  private traitCategoriesWithGlitched: string[] = [
    "background",
    "cat",
    "eyes",
    "cursor",
    "glitched",
  ];

  constructor(collection: NekoItem[]) {
    this.collection = collection;
    this.totalItems = collection.length;
    this.traitCounts = this.calculateTraitCounts();
    this.addGlitchedTrait();
  }

  private addGlitchedTrait(): void {
    // Add glitched trait to items 2-18 (inclusive) and 32
    // Note: assuming index 0-based, so items at indices 1-17 and 31
    this.collection.forEach((item, index) => {
      const itemNumber = index + 1; // Convert to 1-based numbering
      if ((itemNumber >= 2 && itemNumber <= 18) || itemNumber === 32) {
        item.traits.glitched = true;
      } else {
        item.traits.glitched = false;
      }
    });

    // Recalculate trait counts to include glitched
    this.traitCounts = this.calculateTraitCounts();
  }

  private calculateTraitCounts(): Map<string, Map<string, number>> {
    const traitCounts = new Map<string, Map<string, number>>();

    // Initialize trait categories (including glitched)
    const allCategories = [...this.traitCategoriesWithGlitched, "year", "gen"];
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
      const value = traits[category as keyof NekoTrait].toString();
      const count = this.traitCounts.get(category)!.get(value) || 1;
      const rarity = count / this.totalItems;
      const score = 1 / rarity;
      totalScore += score;
    });

    return Math.round(totalScore * 100) / 100;
  }

  // Debug method to see what's happening with statistical rarity
  private debugStatisticalRarity(item: NekoItem): void {
    const traits = item.traits;
    console.log(
      `\n=== DEBUG Statistical Rarity for #${item.ethscription_number} ===`
    );

    let multipliedRarity = 1;
    this.traitCategories.forEach((category) => {
      const value = traits[category as keyof NekoTrait].toString();
      const count = this.traitCounts.get(category)!.get(value) || 1;
      const rarity = count / this.totalItems;
      console.log(
        `${category}: "${value}" appears ${count}/${this.totalItems} times = ${(rarity * 100).toFixed(4)}%`
      );
      multipliedRarity *= rarity;
      console.log(
        `Running multiplied rarity: ${multipliedRarity.toExponential()}`
      );
    });

    const percentage = multipliedRarity * 100;
    console.log(
      `Final percentage: ${percentage.toExponential()} = ${percentage.toPrecision(6)}%`
    );
  }

  // Method 2: Jungle Rarity Score (JRS) - Normalized for trait category size
  private calculateJungleRarityScore(item: NekoItem): number {
    const traits = item.traits;
    let totalScore = 0;

    this.traitCategories.forEach((category) => {
      const value = traits[category as keyof NekoTrait].toString();
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
  private calculateOpenRarity(item: NekoItem): number {
    const traits = item.traits;
    let informationContent = 0;

    this.traitCategories.forEach((category) => {
      const value = traits[category as keyof NekoTrait].toString();
      const count = this.traitCounts.get(category)!.get(value) || 1;
      const probability = count / this.totalItems;

      // Information Content = -log2(probability)
      // Higher IC means rarer trait
      const ic = -Math.log2(probability);
      informationContent += ic;
    });

    // Add normalization factor for number of traits
    const normalizedIC = informationContent / this.traitCategories.length;

    // Convert to a score where higher = rarer (OpenRarity actually uses rank, but this gives comparable scoring)
    return Math.round(normalizedIC * 1000) / 1000;
  }

  // Method 1 with Glitched: Rarity Score including hidden trait
  private calculateRarityScoreWithGlitched(item: NekoItem): number {
    const traits = item.traits;
    let totalScore = 0;

    this.traitCategoriesWithGlitched.forEach((category) => {
      const value = traits[category as keyof NekoTrait]?.toString() || "false";
      const count = this.traitCounts.get(category)!.get(value) || 1;
      const rarity = count / this.totalItems;
      const score = 1 / rarity;
      totalScore += score;
    });

    return Math.round(totalScore * 100) / 100;
  }

  // Method 2 with Glitched: Jungle Rarity Score including hidden trait
  private calculateJungleRarityScoreWithGlitched(item: NekoItem): number {
    const traits = item.traits;
    let totalScore = 0;

    this.traitCategoriesWithGlitched.forEach((category) => {
      const value = traits[category as keyof NekoTrait]?.toString() || "false";
      const count = this.traitCounts.get(category)!.get(value) || 1;
      const categoryMap = this.traitCounts.get(category)!;
      const uniqueValuesInCategory = categoryMap.size;

      // JRS formula with glitched trait category included
      const rarity = count / this.totalItems;
      const normalizationFactor =
        uniqueValuesInCategory / this.traitCategoriesWithGlitched.length;
      const score = (1 / rarity) * normalizationFactor;

      totalScore += score;
    });

    return Math.round(totalScore * 100) / 100;
  }

  // Method 3 with Glitched: OpenRarity including hidden trait
  private calculateOpenRarityWithGlitched(item: NekoItem): number {
    const traits = item.traits;
    let informationContent = 0;

    this.traitCategoriesWithGlitched.forEach((category) => {
      const value = traits[category as keyof NekoTrait]?.toString() || "false";
      const count = this.traitCounts.get(category)!.get(value) || 1;
      const probability = count / this.totalItems;

      // Information Content = -log2(probability)
      const ic = -Math.log2(probability);
      informationContent += ic;
    });

    // Add normalization factor for number of traits (including glitched)
    const normalizedIC =
      informationContent / this.traitCategoriesWithGlitched.length;

    return Math.round(normalizedIC * 1000) / 1000;
  }

  // Calculate all rarity metrics for the collection
  calculateAllRarities(): RarityResult[] {
    const results: RarityResult[] = this.collection.map((item) => ({
      ethscription_number: item.ethscription_number,
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
      (a, b) => b.rarityScore - a.rarityScore
    );
    sortedByRarity.forEach((item, index) => {
      const original = results.find(
        (r) => r.ethscription_number === item.ethscription_number
      )!;
      original.rarityRank = index + 1;
    });

    // Sort by jungle rarity score (higher = rarer)
    const sortedByJungle = [...results].sort(
      (a, b) => b.jungleRarityScore - a.jungleRarityScore
    );
    sortedByJungle.forEach((item, index) => {
      const original = results.find(
        (r) => r.ethscription_number === item.ethscription_number
      )!;
      original.jungleRank = index + 1;
    });

    // Sort by OpenRarity (higher IC = rarer, but OpenRarity ranks with lower numbers for rarer items)
    const sortedByOpenRarity = [...results].sort(
      (a, b) => b.openRarity - a.openRarity
    );
    sortedByOpenRarity.forEach((item, index) => {
      const original = results.find(
        (r) => r.ethscription_number === item.ethscription_number
      )!;
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
      })
    );

    // Calculate ranks with glitched trait
    this.assignRanksWithGlitched(resultsWithGlitched);

    return resultsWithGlitched;
  }

  private assignRanksWithGlitched(results: RarityResultWithGlitched[]): void {
    // Sort by rarity score with glitched (higher = rarer)
    const sortedByRarity = [...results].sort(
      (a, b) => b.rarityScoreWithGlitched - a.rarityScoreWithGlitched
    );
    sortedByRarity.forEach((item, index) => {
      const original = results.find(
        (r) => r.ethscription_number === item.ethscription_number
      )!;
      original.rarityRankWithGlitched = index + 1;
    });

    // Sort by jungle rarity score with glitched (higher = rarer)
    const sortedByJungle = [...results].sort(
      (a, b) =>
        b.jungleRarityScoreWithGlitched - a.jungleRarityScoreWithGlitched
    );
    sortedByJungle.forEach((item, index) => {
      const original = results.find(
        (r) => r.ethscription_number === item.ethscription_number
      )!;
      original.jungleRankWithGlitched = index + 1;
    });

    // Sort by OpenRarity with glitched (higher IC = rarer)
    const sortedByOpenRarity = [...results].sort(
      (a, b) => b.openRarityWithGlitched - a.openRarityWithGlitched
    );
    sortedByOpenRarity.forEach((item, index) => {
      const original = results.find(
        (r) => r.ethscription_number === item.ethscription_number
      )!;
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
        .sort((a, b) => a.rarityRank - b.rarityRank),
      byJungleScore: allResults
        .filter((r) => r.jungleRank <= count)
        .sort((a, b) => a.jungleRank - b.jungleRank),
      byOpenRarity: allResults
        .filter((r) => r.openRarityRank <= count)
        .sort((a, b) => a.openRarityRank - b.openRarityRank),
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
          (a, b) => a.openRarityRankWithGlitched - b.openRarityRankWithGlitched
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
        ([_, count]) => count === minCount
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

    this.traitCategoriesWithGlitched.forEach((category) => {
      const categoryMap = this.traitCounts.get(category)!;
      const counts = Array.from(categoryMap.values());
      const minCount = Math.min(...counts);
      const mostRareTraits = Array.from(categoryMap.entries()).filter(
        ([_, count]) => count === minCount
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

  // Public method to debug a specific item's statistical rarity
  debugItem(ethscriptionNumber: number): void {
    const item = this.collection.find(
      (n) => n.ethscription_number === ethscriptionNumber
    );
    if (item) {
      this.debugStatisticalRarity(item);
    } else {
      console.log(`Item #${ethscriptionNumber} not found`);
    }
  }

  // Get detailed comparison for a specific item
  getItemAnalysis(ethscriptionNumber: number):
    | (RarityResult & {
        traitBreakdown: Record<
          string,
          { value: string; count: number; rarity: number; ic: number }
        >;
      })
    | null {
    const allResults = this.calculateAllRarities();
    const result = allResults.find(
      (r) => r.ethscription_number === ethscriptionNumber
    );
    const item = this.collection.find(
      (n) => n.ethscription_number === ethscriptionNumber
    );

    if (!result || !item) {
      return null;
    }

    const traitBreakdown: Record<string, any> = {};
    this.traitCategories.forEach((category) => {
      const value = item.traits[category as keyof NekoTrait].toString();
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

// Usage example:
function analyzeNekoCollection(nekosData: NekoItem[]) {
  const calculator = new NekoRarityCalculator(nekosData);

  // Get comprehensive analysis
  const allRarities = calculator.calculateAllRarities();
  const topRarest = calculator.getTopRarest(10);
  const traitAnalysis = calculator.getTraitAnalysis();

  // Get analysis with glitched trait
  const allRaritiesWithGlitched = calculator.calculateAllRaritiesWithGlitched();
  const topRarestWithGlitched = calculator.getTopRarestWithGlitched(10);
  const traitAnalysisWithGlitched = calculator.getTraitAnalysisWithGlitched();

  console.log("=== NEKO COLLECTION ANALYSIS ===");
  console.log(`Total items: ${nekosData.length}`);
  console.log("\n=== TRAIT DISTRIBUTION (Standard) ===");

  // Format trait analysis for better terminal display
  Object.entries(traitAnalysis).forEach(([category, data]) => {
    console.log(`\n${category.toUpperCase()}:`);
    console.log(`  Total items: ${data.total}`);
    console.log(`  Unique values: ${data.unique}`);
    console.log(
      `  Rarest traits: ${data.mostRare} (${data.rarest} occurrences)`
    );
    console.log(`  Entropy: ${data.entropy}`);
  });

  console.log("\n=== TRAIT DISTRIBUTION (With Hidden Glitched Trait) ===");
  Object.entries(traitAnalysisWithGlitched).forEach(([category, data]) => {
    console.log(`\n${category.toUpperCase()}:`);
    console.log(`  Total items: ${data.total}`);
    console.log(`  Unique values: ${data.unique}`);
    console.log(
      `  Rarest traits: ${data.mostRare} (${data.rarest} occurrences)`
    );
    console.log(`  Entropy: ${data.entropy}`);
  });

  console.log("\n=== TOP 10 RAREST (by Rarity Score) ===");
  topRarest.byRarityScore.forEach((item, i) => {
    const neko = nekosData.find(
      (n) => n.ethscription_number === item.ethscription_number
    )!;
    console.log(
      `${i + 1}. #${item.ethscription_number} - Score: ${item.rarityScore} | ${neko.traits.background} ${neko.traits.cat} ${neko.traits.eyes} ${neko.traits.cursor}`
    );
  });

  console.log("\n=== TOP 10 RAREST (by Jungle Rarity Score) ===");
  topRarest.byJungleScore.forEach((item, i) => {
    const neko = nekosData.find(
      (n) => n.ethscription_number === item.ethscription_number
    )!;
    console.log(
      `${i + 1}. #${item.ethscription_number} - JRS: ${item.jungleRarityScore} | ${neko.traits.background} ${neko.traits.cat} ${neko.traits.eyes} ${neko.traits.cursor}`
    );
  });

  console.log("\n=== TOP 10 RAREST (by OpenRarity) ===");
  topRarest.byOpenRarity.forEach((item, i) => {
    const neko = nekosData.find(
      (n) => n.ethscription_number === item.ethscription_number
    )!;
    console.log(
      `${i + 1}. #${item.ethscription_number} - OpenRarity: ${item.openRarity} | ${neko.traits.background} ${neko.traits.cat} ${neko.traits.eyes} ${neko.traits.cursor}`
    );
  });

  console.log("\n=== TOP 10 RAREST (by Rarity Score WITH GLITCHED TRAIT) ===");
  topRarestWithGlitched.byRarityScore.forEach((item, i) => {
    const neko = nekosData.find(
      (n) => n.ethscription_number === item.ethscription_number
    )!;
    const glitchedStatus = neko.traits.glitched ? "" : "";
    console.log(
      `${i + 1}. #${item.ethscription_number} - Score: ${item.rarityScoreWithGlitched} [${glitchedStatus}] | ${neko.traits.background} ${neko.traits.cat} ${neko.traits.eyes} ${neko.traits.cursor}`
    );
  });

  console.log(
    "\n=== TOP 10 RAREST (by Jungle Rarity Score WITH GLITCHED TRAIT) ==="
  );
  topRarestWithGlitched.byJungleScore.forEach((item, i) => {
    const neko = nekosData.find(
      (n) => n.ethscription_number === item.ethscription_number
    )!;
    const glitchedStatus = neko.traits.glitched ? "" : "";
    console.log(
      `${i + 1}. #${item.ethscription_number} - JRS: ${item.jungleRarityScoreWithGlitched} [${glitchedStatus}] | ${neko.traits.background} ${neko.traits.cat} ${neko.traits.eyes} ${neko.traits.cursor}`
    );
  });

  console.log("\n=== TOP 10 RAREST (by OpenRarity WITH GLITCHED TRAIT) ===");
  topRarestWithGlitched.byOpenRarity.forEach((item, i) => {
    const neko = nekosData.find(
      (n) => n.ethscription_number === item.ethscription_number
    )!;
    const glitchedStatus = neko.traits.glitched ? "" : "";
    console.log(
      `${i + 1}. #${item.ethscription_number} - OpenRarity: ${item.openRarityWithGlitched} [${glitchedStatus}] | ${neko.traits.background} ${neko.traits.cat} ${neko.traits.eyes} ${neko.traits.cursor}`
    );
  });

  // Show detailed analysis for the rarest item
  const rarest = topRarest.byRarityScore[0];
  const detailedAnalysis = calculator.getItemAnalysis(
    rarest.ethscription_number
  );
  if (detailedAnalysis) {
    console.log(
      `\n=== DETAILED ANALYSIS FOR RAREST ITEM #${rarest.ethscription_number} ===`
    );
    console.log("Trait Breakdown:");
    console.table(detailedAnalysis.traitBreakdown);
  }

  return {
    allRarities,
    topRarest,
    traitAnalysis,
    allRaritiesWithGlitched,
    topRarestWithGlitched,
    traitAnalysisWithGlitched,
  };
}

if (import.meta.main) {
  analyzeNekoCollection(
    await import("../public/0xnekos.json", { with: { type: "json" } })
      .then((module) => module.default)
      .then((nekos) => {
        return nekos.map((neko, idx) => {
          return { ...neko, index: idx + 1 };
        });
      })
  );
}

export {
  NekoRarityCalculator,
  analyzeNekoCollection,
  type RarityResult,
  type RarityResultWithGlitched,
  type NekoItem,
};
