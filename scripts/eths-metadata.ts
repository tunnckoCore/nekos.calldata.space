import nekos from "../public/0xnekos.json" with { type: "json" };

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  const options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  const formatted = date.toLocaleDateString("en-US", options);
  return formatted.replace(",", " at");
};

const items = nekos.data
  .filter((x) => x.traits.gen.toLowerCase().includes("eths"))
  .map((x) => ({
    id: x.id,
    index: x.index,
    sha: x.content_sha.slice(2),
    name: x.name,
    description: `0xNeko Cat ethscribed on Ethereum block #${x.block_number.toLocaleString()} at ${formatDate(x.block_timestamp)}`,
    attributes: Object.entries({
      ...x.traits,
      rank: x.rankings.jungle.rank,
    }).map(([key, value]) => ({
      trait_type: key,
      value,
    })),
  }));

const collection = {
  total_supply: 193,
  name: "0xNeko Cats",
  slug: "0xneko-cats",
  logo_image: `https://api.ethscriptions.com/v2/ethscriptions/0x7c19b69abdf38cebc6de9a955f4f2887d1815e508098bf4fb347f8d8bfc1834e/data`,
  banner_image: null,
  description: `Generative art collection of playful, unique & optimized 0xNeko Cats as Ethscriptions. Inspired by 1989 game, they were originally 100 free minted as Ethereum NFTs in 2021. Later, the same exact 100 were free minted on Bitcoin Ordinals in April 2023.`,
  background_color: null,
  website_url: null,
  discord_url: null,
  twitter_url: "https://twitter.com/wgw_eth",
  collection_items: items,
};

console.log(JSON.stringify(collection, null, 2));
