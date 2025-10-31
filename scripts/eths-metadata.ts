import { encodePacked, keccak256 } from "viem";
import nekos from "../public/0xnekos.json" with { type: "json" };

// Hash a leaf node (double hash for security)
export function hashLeaf(data: `0x${string}`): `0x${string}` {
  return keccak256(
    encodePacked(["bytes32"], [keccak256(encodePacked(["bytes32"], [data]))]),
  );
}

// Hash two nodes together (sorted to ensure deterministic order)
export function hashPair(
  left: `0x${string}`,
  right: `0x${string}`,
): `0x${string}` {
  const [first, second] = [left, right].sort();
  return keccak256(encodePacked(["bytes32", "bytes32"], [first, second]));
}

export function calculateMerkleRoot(ids: `0x${string}`[]): `0x${string}` {
  if (ids.length === 0) {
    return "0x0000000000000000000000000000000000000000000000000000000000000000";
  }

  // Hash all leaves
  let leaves = ids.map(hashLeaf);

  // Sort leaves for deterministic ordering
  leaves.sort();

  // Build tree bottom-up
  while (leaves.length > 1) {
    const newLevel: `0x${string}`[] = [];

    for (let i = 0; i < leaves.length; i += 2) {
      const left = leaves[i];
      const right = i + 1 < leaves.length ? leaves[i + 1] : left;
      newLevel.push(hashPair(left, right));
    }

    leaves = newLevel;
  }

  return leaves[0];
}

export function verifyMerkleProof(
  id: `0x${string}`,
  proof: `0x${string}`[],
  root: `0x${string}`,
): boolean {
  let computedHash = hashLeaf(id);

  for (const proofElement of proof) {
    computedHash = hashPair(computedHash, proofElement);
  }

  return computedHash === root;
}

// Generate proof for a specific ID
export function generateMerkleProof(
  ids: `0x${string}`[],
  targetId: `0x${string}`,
): `0x${string}`[] {
  const leaves = ids.map(hashLeaf).sort();
  const targetHash = hashLeaf(targetId);
  const targetIndex = leaves.indexOf(targetHash);

  if (targetIndex === -1) return [];

  const proof: `0x${string}`[] = [];
  let currentLevel = leaves;
  let index = targetIndex;

  while (currentLevel.length > 1) {
    const newLevel: `0x${string}`[] = [];

    for (let i = 0; i < currentLevel.length; i += 2) {
      const left = currentLevel[i];
      const right = i + 1 < currentLevel.length ? currentLevel[i + 1] : left;
      newLevel.push(hashPair(left, right));
    }

    // Add sibling to proof
    const isLeftChild = index % 2 === 0;
    const siblingIndex = isLeftChild ? index + 1 : index - 1;

    if (siblingIndex < currentLevel.length) {
      proof.push(currentLevel[siblingIndex]);
    }

    index = Math.floor(index / 2);
    currentLevel = newLevel;
  }

  return proof;
}

export function formatDate(timestamp: number): string {
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
}

export function getNekoEthscriptionItems(allItems) {
  const items = allItems
    .filter((x) => x.traits.gen.toLowerCase().includes("eths"))
    .map((x) => ({
      id: x.id,
      index: x.index,
      sha: x.content_sha.slice(2),
      name: x.name,
      ethscription_number: x.number,
      description: `0xNeko Cat ethscribed on Ethereum block #${x.block_number.toLocaleString()} at ${formatDate(x.block_timestamp)}`,
      attributes: Object.entries({
        ...x.traits,
        rank: x.rankings.jungle.rank,
      }).map(([key, value]) => ({
        trait_type: key,
        value,
      })),
    }));

  return items;
}

export async function generateMetadata(items) {
  const merkleRoot = calculateMerkleRoot(items.map((item) => item.id));

  const collection = {
    merkleRoot,
    total_supply: items.length,
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

  return collection;
}

export function nekoMerkle(id: string | number, verify = false) {
  const nekoItems = getNekoEthscriptionItems(nekos.data);
  const NEKO_IDS = nekoItems.map((item) => item.id);
  const MERKLE_ROOT = calculateMerkleRoot(NEKO_IDS);
  const cleanId = String(id).replaceAll(",", "").replaceAll(".", "");
  const ID =
    Number.isNaN(Number(cleanId)) || cleanId.startsWith("0x")
      ? cleanId
      : nekoItems.find((item) => item.ethscription_number === Number(cleanId))
          ?.id;

  const proof = generateMerkleProof(NEKO_IDS, ID);

  return verify ? verifyMerkleProof(ID, proof, MERKLE_ROOT) : proof;
}

// console.log(
//   nekoMerkle(
//     `0xa67a38870b5b9f60064bc380f7de2f244fe9adff7fdba1abe945a6df36928d08`,
//   ),
//   nekoMerkle(
//     `0xa67a38870b5b9f60064bc380f7de2f244fe9adff7fdba1abe945a6df36928d08`,
//     true,
//   ),
// );

console.log(
  JSON.stringify(
    await generateMetadata(getNekoEthscriptionItems(nekos.data)),
    null,
    2,
  ),
);
