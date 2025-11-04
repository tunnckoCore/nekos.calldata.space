import { rarityWeights } from "./rarity-weights";

const allCursors = [
  { name: "mouse", emoji: "🐭" },
  { name: "rabbit", emoji: "🐇" },
  { name: "fish", emoji: "🐟" },
  { name: "blowfish", emoji: "🐡" },
  { name: "shark", emoji: "🦈" },
  { name: "octopus", emoji: "🐙" },
  { name: "steak", emoji: "🥩" },
  { name: "cheese", emoji: "🧀" },
  { name: "snake", emoji: "🐍" },
  { name: "pretzel", emoji: "🥨" },
  { name: "lobster", emoji: "🦞" },
  { name: "yarn", emoji: "🧶" },
  { name: "pineapple", emoji: "🍍" },
  { name: "banana", emoji: "🍌" },
  { name: "pear", emoji: "🍐" },
  { name: "crab", emoji: "🦀" },
  { name: "shrimp", emoji: "🦐" },
  { name: "eggplant", emoji: "🍆" },
  { name: "cucumber", emoji: "🥒" },
  { name: "popcorn", emoji: "🍿" },
  { name: "ear of corn", emoji: "🌽" },
  { name: "tropical fish", emoji: "🐠" },
  { name: "oyster", emoji: "🦪" },
  { name: "grapes", emoji: "🍇" },
  { name: "bacon", emoji: "🥓" },
  { name: "watermelon", emoji: "🍉" },
  { name: "squid", emoji: "🦑" },
  { name: "fish cake", emoji: "🍥" },
  { name: "peach", emoji: "🍑" },
  { name: "sushi", emoji: "🍣" },
  { name: "tangerine", emoji: "🍊" },
  { name: "mango", emoji: "🥭" },
  { name: "fried shrimp", emoji: "🍤" },
  { name: "meat on bone", emoji: "🍖" },
  { name: "milk", emoji: "🥛" },
  { name: "sausage", emoji: "🌭" },
  { name: "rubberduck", emoji: "🦆" },
];

const NEKO_COLORS = [
  "neko-red",
  "neko-orange",
  "neko-yellow",
  "neko-lime",
  "neko-green",
  "neko-emerald",
  "neko-teal",
  "neko-cyan",
  "neko-sky",
  "neko-blue",
  "neko-indigo",
  "neko-violet",
  "neko-purple",
  "neko-fuchsia",
  "neko-pink",
  "neko-rose",
] as const;

export interface WeightedNeko {
  id: string;
  catEyes: string;
  catColor: string;
  bgColor: string;
  groundColor: string;
  cursor: { name: string; emoji: string };
  weight: number;
}

function getWeightForTrait(
  trait: "catEyes" | "catColor" | "bgColor" | "groundColor" | "cursor",
  value: string,
): number {
  const weights = rarityWeights.traitWeights;

  if (trait === "catEyes") {
    return (weights.catEyes as Record<string, number>)[value] || 1;
  }
  if (trait === "catColor") {
    return (weights.catColors as Record<string, number>)[value] || 1;
  }
  if (trait === "bgColor") {
    return (weights.bgColors as Record<string, number>)[value] || 1;
  }
  if (trait === "groundColor") {
    return (weights.groundColors as Record<string, number>)[value] || 1;
  }
  if (trait === "cursor") {
    return (weights.cursors as Record<string, number>)[value] || 1;
  }

  return 1;
}

function getComboMultiplier(
  catEyes: string,
  catColor: string,
  bgColor: string,
  groundColor: string,
  cursor: { name: string; emoji: string },
): number {
  let multiplier = 1;

  for (const combo of rarityWeights.combinationWeights) {
    let matches = true;

    if (
      "catEyes" in combo.condition &&
      combo.condition.catEyes &&
      combo.condition.catEyes !== catEyes
    ) {
      matches = false;
    }
    if (
      "catColor" in combo.condition &&
      combo.condition.catColor &&
      combo.condition.catColor !== catColor
    ) {
      matches = false;
    }
    if (
      "bgColor" in combo.condition &&
      combo.condition.bgColor &&
      combo.condition.bgColor !== bgColor
    ) {
      matches = false;
    }
    if (
      "groundColor" in combo.condition &&
      combo.condition.groundColor &&
      combo.condition.groundColor !== groundColor
    ) {
      matches = false;
    }
    if (
      "cursor" in combo.condition &&
      combo.condition.cursor &&
      combo.condition.cursor !== cursor.name
    ) {
      matches = false;
    }

    if (matches) {
      multiplier *= combo.multiplier;
    }
  }

  return multiplier;
}

function weightedRandomSelection<T extends string>(
  items: T[],
  weights: Record<string, number>,
): T {
  const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
  let random = Math.random() * totalWeight;

  for (const item of items) {
    const weight = weights[item] || 1;
    random -= weight;
    if (random <= 0) {
      return item;
    }
  }

  return items[items.length - 1];
}

export function generateWeightedNekos(count: number): WeightedNeko[] {
  const nekos: WeightedNeko[] = [];

  const colorWeights = rarityWeights.traitWeights.catColors as Record<
    string,
    number
  >;
  const bgWeights = rarityWeights.traitWeights.bgColors as Record<
    string,
    number
  >;
  const groundWeights = rarityWeights.traitWeights.groundColors as Record<
    string,
    number
  >;
  const cursorWeights = rarityWeights.traitWeights.cursors as Record<
    string,
    number
  >;

  const darkGroundChance = rarityWeights.groundDarkness?.chance || 0.01;

  for (let i = 0; i < count; i++) {
    const catEyes = weightedRandomSelection(
      [...NEKO_COLORS],
      rarityWeights.traitWeights.catEyes as Record<string, number>,
    );
    const catColor = weightedRandomSelection([...NEKO_COLORS], colorWeights);
    const bgColor = weightedRandomSelection([...NEKO_COLORS], bgWeights);

    let groundColor: string;
    if (Math.random() < darkGroundChance) {
      groundColor = bgColor;
    } else {
      groundColor = weightedRandomSelection([...NEKO_COLORS], groundWeights);
    }

    const cursorList = allCursors.map((c) => c.name);
    const cursorName = weightedRandomSelection(
      cursorList as unknown as (typeof cursorList)[number][],
      cursorWeights,
    );
    const cursor = allCursors.find((c) => c.name === cursorName)!;

    const baseWeight =
      getWeightForTrait("catEyes", catEyes) *
      getWeightForTrait("catColor", catColor) *
      getWeightForTrait("bgColor", bgColor) *
      getWeightForTrait("groundColor", groundColor) *
      getWeightForTrait("cursor", cursor.name);

    const comboMultiplier = getComboMultiplier(
      catEyes,
      catColor,
      bgColor,
      groundColor,
      cursor,
    );
    const finalWeight = baseWeight * comboMultiplier;

    nekos.push({
      id: `neko-${i}-${Date.now()}`,
      catEyes,
      catColor,
      bgColor,
      groundColor,
      cursor,
      weight: finalWeight,
    });
  }

  // Sort by weight in ascending order (lowest weight = rarest/best first)
  nekos.sort((a, b) => a.weight - b.weight);

  return nekos;
}
