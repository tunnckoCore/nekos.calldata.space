const neko = `data:image/webp;base64,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`;

export function stringToHex(str: string): string {
  return Array.from(str)
    .map((char) => char.charCodeAt(0).toString(16).padStart(2, "0"))
    .join("");
}

export function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);

  Array.from(hex.match(/.{1,2}/g) || []).forEach((byte, index) => {
    bytes[index] = parseInt(byte, 16);
  });

  return bytes;
}

export const calculateInputGasCost = (input: Uint8Array) => {
  // EIP-7623 Constants
  const STANDARD_TOKEN_COST = 4n; // Cost per token under standard pricing
  const TOTAL_COST_FLOOR_PER_TOKEN = 10n; // Floor cost per token

  // Count zero and non-zero bytes
  let zeroBytes = 0n;
  let nonZeroBytes = 0n;

  input.forEach((byte) => {
    if (byte === 0) {
      zeroBytes += 1n;
    } else {
      nonZeroBytes += 1n;
    }
  });

  // Calculate tokens: zero_bytes + nonzero_bytes * 4
  const tokensInCalldata = zeroBytes + nonZeroBytes * 4n;

  // Standard cost: 4 gas per zero byte + 16 gas per non-zero byte
  // This is equivalent to STANDARD_TOKEN_COST * tokens_in_calldata
  const standardCost = STANDARD_TOKEN_COST * tokensInCalldata;

  // Floor cost: 10 gas per token
  const floorCost = TOTAL_COST_FLOOR_PER_TOKEN * tokensInCalldata;

  // EIP-7623: Return the maximum of standard cost and floor cost
  return standardCost > floorCost ? standardCost : floorCost;
};

export async function main() {
  const res = await fetch(`https://mainnet.api.calldata.space/estimate`, {
    method: "POST",
    body: JSON.stringify({ data: neko, gasPrice: 20, ethPrice: 3900 }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("bruh");
  }

  const resp = await res.json();

  console.log(resp);
}

const dataHex = stringToHex(neko);
const dataBytes = hexToBytes(dataHex);

console.log("size:", dataBytes);
const cost = calculateInputGasCost(dataBytes);
console.log({ cost });

export function calcEthAndUsdPriceBasedOnWeiCost(
  gasCostInUnits: bigint,
  gasPriceInWei: number = 20,
  ethPrice: number = 3900,
) {
  // Convert gas units to wei: gasCostInUnits * gasPriceInWei
  const gasPriceInWeiBigInt = BigInt(Math.floor(gasPriceInWei * 1e9));
  const weiCost = gasCostInUnits * gasPriceInWeiBigInt;

  // Convert wei to ETH (1 ETH = 1e18 wei)
  const ethCost = Number(weiCost) / 1e18;

  // Convert ETH to USD
  const usdCost = ethCost * ethPrice;

  return {
    gasCost: gasCostInUnits.toString(),
    gasPriceInWei: gasPriceInWeiBigInt.toString(),
    weiCost: weiCost.toString(),
    ethCost: ethCost.toFixed(8),
    usdCost: usdCost.toFixed(2),
  };
}

console.log(calcEthAndUsdPriceBasedOnWeiCost(cost, 8));
