import { z } from "zod";

const ethereumAddressSchema = z
  .string()
  .regex(
    /^0x[a-fA-F0-9]{40}$/,
    "Must be a valid Ethereum address (42 chars with 0x prefix)"
  );
const bitcoinAddressSchema = z.string();

const hash256Schema = z
  .string()
  .regex(
    /^0x[a-fA-F0-9]{64}$/,
    "Must be a valid hash (66 chars with 0x prefix)"
  )
  .or(
    z
      .string()
      .regex(
        /^[a-fA-F0-9]{64}$/,
        "Must be a valid hash (66 chars with 0x prefix)"
      )
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
});

export type Neko = z.infer<typeof NekoSchema>;

export type SortField =
  | "index"
  | "transaction_index"
  | "block_number"
  | "transaction_fee"
  | "ethscription_number";

export type SortOrder = "asc" | "desc";
