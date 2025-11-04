export const rarityWeights = {
  traitWeights: {
    catEyes: {
      "neko-red": 0.1,
      "neko-orange": 1.1,
      "neko-yellow": 0.9,
      "neko-lime": 1.2,
      "neko-green": 1,
      "neko-emerald": 1.3,
      "neko-teal": 0.8,
      "neko-cyan": 1.1,
      "neko-sky": 0.4,
      "neko-blue": 1.5,
      "neko-indigo": 0.9,
      "neko-violet": 1.2,
      "neko-purple": 1,
      "neko-fuchsia": 0.7,
      "neko-pink": 1.3,
      "neko-rose": 1.1,
    },
    catColors: {
      "neko-red": 1,
      "neko-orange": 1.2,
      "neko-yellow": 0.8,
      "neko-lime": 1.5,
      "neko-green": 2,
      "neko-emerald": 1.3,
      "neko-teal": 0.9,
      "neko-cyan": 1.4,
      "neko-sky": 0.3,
      "neko-blue": 1.2,
      "neko-indigo": 0.3,
      "neko-violet": 0.6,
      "neko-purple": 0.5,
      "neko-fuchsia": 0.6,
      "neko-pink": 1.8,
      "neko-rose": 0.9,
    },
    bgColors: {
      "neko-red": 0.9,
      "neko-orange": 1,
      "neko-yellow": 1.2,
      "neko-lime": 0.8,
      "neko-green": 1.1,
      "neko-emerald": 1,
      "neko-teal": 1.3,
      "neko-cyan": 0.9,
      "neko-sky": 1.4,
      "neko-blue": 1.5,
      "neko-indigo": 0.7,
      "neko-violet": 0.6,
      "neko-purple": 0.4,
      "neko-fuchsia": 0.8,
      "neko-pink": 1.1,
      "neko-rose": 0.9,
    },
    groundColors: {
      "neko-red": 1.2,
      "neko-orange": 0.9,
      "neko-yellow": 1,
      "neko-lime": 1.3,
      "neko-green": 1.4,
      "neko-emerald": 1.1,
      "neko-teal": 0.8,
      "neko-cyan": 1,
      "neko-sky": 0.9,
      "neko-blue": 1.2,
      "neko-indigo": 0.6,
      "neko-violet": 1.1,
      "neko-purple": 1.3,
      "neko-fuchsia": 0.7,
      "neko-pink": 0.9,
      "neko-rose": 1.2,
    },
    cursors: {
      mouse: 0.2,
      rabbit: 1.1,
      fish: 0.3,
      blowfish: 0.9,
      shark: 0.8,
      octopus: 1.3,
      steak: 1.4,
      cheese: 1.2,
      snake: 0.7,
      pretzel: 1,
      lobster: 0.9,
      yarn: 0.2,
      pineapple: 1.1,
      banana: 1.3,
      pear: 3,
      crab: 1.2,
      shrimp: 1,
      eggplant: 0.8,
      cucumber: 0.4,
      popcorn: 1.4,
      "ear of corn": 1.7,
      "tropical fish": 0.5,
      oyster: 0.8,
      grapes: 1.2,
      bacon: 3,
      watermelon: 4,
      squid: 1.1,
      "fish cake": 0.9,
      peach: 1.2,
      sushi: 1.6,
      tangerine: 4,
      mango: 4,
      "fried shrimp": 0.8,
      "meat on bone": 1.5,
      milk: 0.4,
      sausage: 1.2,
      rubberduck: 0.1,
    },
  },
  combinationWeights: [
    // Heavy penalties for monochrome (all same color)
    {
      condition: {
        catColor: "neko-pink",
        bgColor: "neko-pink",
        groundColor: "neko-pink",
      },
      multiplier: 0.05,
      description: "All pink - monochrome penalty",
    },
    {
      condition: {
        catColor: "neko-blue",
        bgColor: "neko-blue",
        groundColor: "neko-blue",
      },
      multiplier: 0.05,
      description: "All blue - monochrome penalty",
    },
    {
      condition: {
        catColor: "neko-red",
        bgColor: "neko-red",
        groundColor: "neko-red",
      },
      multiplier: 0.05,
      description: "All red - monochrome penalty",
    },
    {
      condition: {
        catColor: "neko-purple",
        bgColor: "neko-purple",
        groundColor: "neko-purple",
      },
      multiplier: 0.05,
      description: "All purple - monochrome penalty",
    },
    {
      condition: {
        catColor: "neko-green",
        bgColor: "neko-green",
        groundColor: "neko-green",
      },
      multiplier: 0.05,
      description: "All green - monochrome penalty",
    },
    // Penalties for cat+bg same color
    {
      condition: { bgColor: "neko-pink", catColor: "neko-pink" },
      multiplier: 0.2,
      description: "Pink cat + pink bg - low contrast",
    },
    {
      condition: { bgColor: "neko-blue", catColor: "neko-blue" },
      multiplier: 0.2,
      description: "Blue cat + blue bg - low contrast",
    },
    {
      condition: { bgColor: "neko-red", catColor: "neko-red" },
      multiplier: 0.2,
      description: "Red cat + red bg - low contrast",
    },
    {
      condition: { bgColor: "neko-green", catColor: "neko-green" },
      multiplier: 0.2,
      description: "Green cat + green bg - low contrast",
    },
    {
      condition: { bgColor: "neko-purple", catColor: "neko-purple" },
      multiplier: 0.2,
      description: "Purple cat + purple bg - low contrast",
    },
    // Penalties for bg+ground same color
    {
      condition: { bgColor: "neko-green", groundColor: "neko-green" },
      multiplier: 0.3,
      description: "Green bg + green ground - boring",
    },
    {
      condition: { bgColor: "neko-blue", groundColor: "neko-blue" },
      multiplier: 0.3,
      description: "Blue bg + blue ground - boring",
    },
    // COMMON: Invisible cats (cat color matches background) - push to end
    {
      condition: { bgColor: "neko-pink", catColor: "neko-pink" },
      multiplier: 50,
      description: "Pink cat on pink bg - invisible (common, goes to end)",
    },
    {
      condition: { bgColor: "neko-blue", catColor: "neko-blue" },
      multiplier: 50,
      description: "Blue cat on blue bg - invisible (common, goes to end)",
    },
    {
      condition: { bgColor: "neko-red", catColor: "neko-red" },
      multiplier: 50,
      description: "Red cat on red bg - invisible (common, goes to end)",
    },
    {
      condition: { bgColor: "neko-green", catColor: "neko-green" },
      multiplier: 50,
      description: "Green cat on green bg - invisible (common, goes to end)",
    },
    {
      condition: { bgColor: "neko-purple", catColor: "neko-purple" },
      multiplier: 50,
      description: "Purple cat on purple bg - invisible (common, goes to end)",
    },
    {
      condition: { bgColor: "neko-yellow", catColor: "neko-yellow" },
      multiplier: 50,
      description: "Yellow cat on yellow bg - invisible (common, goes to end)",
    },
    {
      condition: { bgColor: "neko-cyan", catColor: "neko-cyan" },
      multiplier: 50,
      description: "Cyan cat on cyan bg - invisible (common, goes to end)",
    },
    {
      condition: { bgColor: "neko-orange", catColor: "neko-orange" },
      multiplier: 50,
      description: "Orange cat on orange bg - invisible (common, goes to end)",
    },
    // COMMON: Invisible eyes (eyes match background) - push to end
    {
      condition: { bgColor: "neko-pink", catEyes: "neko-pink" },
      multiplier: 100,
      description:
        "Pink eyes on pink bg - just body visible (common, goes to end)",
    },
    {
      condition: { bgColor: "neko-blue", catEyes: "neko-blue" },
      multiplier: 100,
      description:
        "Blue eyes on blue bg - just body visible (common, goes to end)",
    },
    {
      condition: { bgColor: "neko-red", catEyes: "neko-red" },
      multiplier: 100,
      description:
        "Red eyes on red bg - just body visible (common, goes to end)",
    },
    {
      condition: { bgColor: "neko-green", catEyes: "neko-green" },
      multiplier: 100,
      description:
        "Green eyes on green bg - just body visible (common, goes to end)",
    },
    {
      condition: { bgColor: "neko-purple", catEyes: "neko-purple" },
      multiplier: 100,
      description:
        "Purple eyes on purple bg - just body visible (common, goes to end)",
    },
    {
      condition: { bgColor: "neko-yellow", catEyes: "neko-yellow" },
      multiplier: 100,
      description:
        "Yellow eyes on yellow bg - just body visible (common, goes to end)",
    },
    {
      condition: { bgColor: "neko-cyan", catEyes: "neko-cyan" },
      multiplier: 100,
      description:
        "Cyan eyes on cyan bg - just body visible (common, goes to end)",
    },
    {
      condition: { bgColor: "neko-orange", catEyes: "neko-orange" },
      multiplier: 100,
      description:
        "Orange eyes on orange bg - just body visible (common, goes to end)",
    },
    // Boost good combos
    {
      condition: { cursor: "rubberduck", catColor: "neko-cyan" },
      multiplier: 2,
      description: "Legendary: rubber duck with cyan cat",
    },
    {
      condition: { cursor: "sushi", catColor: "neko-blue" },
      multiplier: 1.8,
      description: "Epic: sushi with blue cat",
    },
    {
      condition: { cursor: "bacon", catColor: "neko-pink" },
      multiplier: 1.6,
      description: "Rare: bacon with pink cat",
    },
    {
      condition: { cursor: "shark", bgColor: "neko-indigo" },
      multiplier: 1.5,
      description: "Rare: shark with indigo background",
    },
  ],
  groundDarkness: {
    chance: 0.01, // 1% of nekos have ground as darker bg
    darkenAmount: 0.45, // 40-50% darker (use CSS filter)
    description:
      "Ground is darkened version of background instead of random color",
  },
} as const;
