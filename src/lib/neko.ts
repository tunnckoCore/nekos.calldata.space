import { z } from "zod";

const ethereumAddressSchema = z
  .string()
  .regex(
    /^0x[a-fA-F0-9]{40}$/,
    "Must be a valid Ethereum address (42 chars with 0x prefix)",
  );
const bitcoinAddressSchema = z
  .string()
  .regex(/^bc1.+$/, "Must be a valid Bitcoin address");

const hash256Schema = z
  .string()
  .regex(
    /^0x[a-fA-F0-9]{64}$/,
    "Must be a valid hash (66 chars with 0x prefix)",
  )
  .or(
    z
      .string()
      .regex(
        /^[a-fA-F0-9]{64}$/,
        "Must be a valid hash (64 chars without 0x prefix)",
      ),
  );

export const NekoSchema = z.object({
  id: z.string(),
  index: z.number(),
  name: z.string(),
  block_number: z.number(),
  block_hash: hash256Schema,
  block_timestamp: z.number(),
  transaction_hash: hash256Schema,
  transaction_index: z.number().nullable(),
  transaction_fee: z.number(),
  creator: ethereumAddressSchema.or(bitcoinAddressSchema),
  initial_owner: ethereumAddressSchema.or(bitcoinAddressSchema),
  content_sha: hash256Schema.or(z.literal("0x")),
  current_owner: ethereumAddressSchema
    .or(bitcoinAddressSchema)
    .or(z.literal("0x")),
  previous_owner: ethereumAddressSchema
    .or(bitcoinAddressSchema)
    .or(z.literal("0x")),
  number: z.number(),
  event_log_index: z.number().nullable(),
  sat_ordinal: z.number().optional(),
  traits: z.object({
    block: z.number(),
    year: z.number(),
    gen: z.string(),
    background: z.string(),
    cat: z.string(),
    eyes: z.string(),
    cursor: z.string(),
  }),
  sequence: z.number().optional(), // Added by fetchAllNekos for stable ordering
  colors: z
    .object({
      background: z.string(),
      cat: z.string(),
      eyes: z.string(),
    })
    .optional(),
  rankings: z
    .object({
      openRarity: z.object({
        score: z.number(),
        rank: z.number(),
      }),
      rarity: z.object({
        score: z.number(),
        rank: z.number(),
      }),
      jungle: z.object({
        score: z.number(),
        rank: z.number(),
      }),
      global: z.object({
        score: z.number(),
        rank: z.number(),
      }),
    })
    .optional(),
});

export type Neko = z.infer<typeof NekoSchema>;

export type SortField =
  | "sequence"
  | "created_at"
  | "index"
  | "transaction_index"
  | "block_number"
  | "transaction_fee"
  | "number";

export type SortOrder = "asc" | "desc";

export const allCursors = [
  { name: "mouse", emoji: "🐁" },
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
  { name: "cheese wedge", emoji: "🧀" },
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
  { name: "cut of meat", emoji: "🥩" },
  { name: "fried shrimp", emoji: "🍤" },
  { name: "meat on bone", emoji: "🍖" },
  { name: "milk", emoji: "🥛" },
  { name: "sausage", emoji: "🌭" },
  { name: "tuna", emoji: "🐟" },
  { name: "salmon", emoji: "🐟" },
  { name: "rubberduck", emoji: "🦆" },
];
