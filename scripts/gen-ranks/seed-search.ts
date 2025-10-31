#!/usr/bin/env bun

import { Search } from "@upstash/search";
import nekoEths from "../public/0xnekos-eths.json" with { type: "json" };

type Item = {
  block_hash: `0x${string}`;
  block_number: number;
  block_timestamp: number;
  content_sha: `0x${string}`;
  creator: `0x${string}`;
  current_owner: `0x${string}`;
  ethscription_number: number;
  index: number;
  previous_owner: `0x${string}`;
  receiver: `0x${string}`;
  transaction_fee: number;
  transaction_hash: `0x${string}`;
  transaction_index: number;
  name: string;
  traits: {
    block: number;
    year: number;
    gen: string;
    background: string;
    cat: string;
    eyes: string;
    cursor: string;
  };
};

const nekoEthscriptions = (nekoEths as any).map((item: Item) => {
  return {
    id: item.transaction_hash,
    content: {
      block_number: item.block_number,
      block_timestamp: item.block_timestamp,
      ethscription_number: item.ethscription_number,
      transaction_fee: item.transaction_fee,
      creator: item.creator,
      initial_owner: item.receiver,
      sequence: item.index,
      traits: {
        year: item.traits.year,
        gen: item.traits.gen,
        background: item.traits.background,
        cat: item.traits.cat,
        eyes: item.traits.eyes,
        cursor: item.traits.cursor,
      },
    },
    metadata: {
      name: item.name,
      current_owner: item.current_owner,
      block_hash: item.block_hash,
      transaction_index: item.transaction_index,
    },
  };
});

type SearchItem = ReturnType<(typeof nekoEthscriptions)[0]>;

async function seedSearchIndex() {
  try {
    // Check if environment variables are set
    const url = process.env.UPSTASH_SEARCH_REST_URL;
    const token = process.env.UPSTASH_SEARCH_REST_TOKEN;

    if (!url || !token) {
      console.error("❌ Missing required environment variables:");
      console.error("   UPSTASH_SEARCH_REST_URL");
      console.error("   UPSTASH_SEARCH_REST_TOKEN");
      console.error("\nPlease add these to your .env file");
      process.exit(1);
    }

    // Initialize Search client
    const client = Search.fromEnv();

    // Create or access the nekos index
    const index = client.index<SearchItem>("0xneko-cats");

    console.log("🚀 Starting to seed the search index...");

    const results = await index.search({
      // query: "show me cats with shark cursor",
      query: "0xa20c07f94a127fd76e61f",
      limit: 30,
      semanticWeight: 0.2,
      // filter: {
      //   initial_owner: { glob: "0xa20c*" },
      // },
    });

    console.log(
      "✅ Successfully searched index:",
      results.map((result) => {
        return {
          id: result.id,
          initial_owner: result.content.initial_owner,
          name: result.metadata?.name,
          cursor: result.content.traits.cursor,
        };
      })
    );

    // Upsert all sample data
    // console.log("📦 Upserting sample neko data...");
    // await index.upsert(nekoEthscriptions.slice(100));

    // Get index info to verify
    // const info = await index.info();
    // console.log(
    //   `✅ Successfully seeded ${info.documentCount} documents to the search index!`
    // );
  } catch (error) {
    console.error("❌ Error seeding search index:", error);
    process.exit(1);
  }
}

// Run the seeding function
seedSearchIndex();
