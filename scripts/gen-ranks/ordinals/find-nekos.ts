import items from "./potential-nekos-txs.json" with { type: "json" };

const uniques = items
  .map(
    ({
      id: transaction_hash,
      number,
      address,
      genesis_address,
      genesis_block_height: block_number,
      genesis_block_hash: block_hash,
      sat_ordinal,
      sat_rarity,
      sat_coinbase_height,
      genesis_fee: transaction_fee,
      genesis_timestamp: block_timestamp,
      content_length,
    }) => ({
      id: transaction_hash,
      number,
      transaction_hash: transaction_hash.slice(0, -2),
      transaction_fee: Number(transaction_fee),
      creator: genesis_address,
      initial_owner: genesis_address,
      current_owner: address,
      block_timestamp,
      block_number,
      block_hash,
      sat_ordinal,
      sat_rarity,
      sat_coinbase_height,
      content_length,
    })
  )
  .sort((a, b) => a.content_length - b.content_length)
  .reduce((acc: any, x) => {
    acc[x.transaction_hash] = x;
    return acc;
  }, {} as any);

export const ALL_MINTED_NEKOS = [
  {
    inscriptionId: `9b3712a7a71ebb9c582d9f9ed6be7edce1b6ba2f5d21f18072c4729879c2f256i0`,
    inscriptionNumber: 9_321_535,
    tokenId: 1,
  },
  {
    inscriptionId: `2fff7e808e026a30646366cd3c95c9ce18aa540363fd69e15326967c30fdfc2fi0`,
    inscriptionNumber: 9_321_533,
    tokenId: 3,
  },
  {
    inscriptionId: `096aeded3b82fc81b7c45bb312c385a95e09ed5f2a3dc81c2021a7d8d45ad282i0`,
    inscriptionNumber: 10_151_411,
    tokenId: 6,
  },
  {
    inscriptionId: `3819acbc3c033e6bb1459b15ac7a9a6b202762b24948f46000dccb3a6b75b10ci0`,
    inscriptionNumber: 9_321_530,
    tokenId: 8,
  },
  {
    inscriptionId: `594f966b54cbf20b7086444dcea9c14c829769afeda7f93242b8ab6cf34e462fi0`,
    inscriptionNumber: 9_323_837,
    tokenId: 10,
  },
  {
    inscriptionId: `681b7117d258feaa6fe8f4101f5b7c48781c94dbb6b1f7d3f3fd7eb0326c9ed3i0`,
    inscriptionNumber: 9_321_532,
    tokenId: 13,
  },
  {
    inscriptionId: `dfa22b24695cca385d2fb076a0e0e24ce737f71eb281a684d5f0e3f65cfe21d0i0`,
    inscriptionNumber: 10_151_324,
    tokenId: 16,
  },
  {
    inscriptionId: `500ee9c588e05f48fdc75842023f8cc1a6a317edc741a8525408aaf037976d9ci0`,
    inscriptionNumber: 9_323_871,
    tokenId: 20,
  },
  {
    inscriptionId: `0180432dadc62870e98237ffdfee96d8a335dc84cee83d3d6651493b359852efi0`,
    inscriptionNumber: 9_324_869,
    tokenId: 21,
  },
  {
    inscriptionId: `7c405f2e9cd68f4802abc20c970cd28dd223591e54dfb87cac19e7466b2c9a01i0`,
    inscriptionNumber: 9_323_962,
    tokenId: 22,
  },
  {
    inscriptionId: `96ff4e02eb0c3e88b97f5c928e412c8cf57268f1da039e000514321117b186c3i0`,
    inscriptionNumber: 9_321_524,
    tokenId: 25,
  },
  {
    inscriptionId: `4e08135b6f7bebd60717ed48208427880e67966696f89cc61f95cf41380a2ecbi0`,
    inscriptionNumber: 9_321_527,
    tokenId: 28,
  },
  {
    inscriptionId: `05410668c384d0b4434a64c39e39c26ef41896d4ea4479bef2b23854306dd681i0`,
    inscriptionNumber: 9_323_838,
    tokenId: 29,
  },
  {
    inscriptionId: `ff51dc2aad5834cac8c0f7c779b3dc71fed2ad6814da222301ec711b1661b00ci0`,
    inscriptionNumber: 9_321_525,
    tokenId: 35,
  },
  {
    inscriptionId: `142c64fbd3e10eacbc5306541cfa6d7fad006292cc28dad85b6b7657bec969fei0`,
    inscriptionNumber: 9_321_130,
    tokenId: 38,
  },
  {
    inscriptionId: `2908fdb46b95fce9376931e216f917b192f389af43576785570b49e30a29d5e0i0`,
    inscriptionNumber: 9_321_126,
    tokenId: 43,
  },
  {
    inscriptionId: `d27c3715c205e95fa4db74846ab277d7e038b6e3c80c8930691536140524e7b2i0`,
    inscriptionNumber: 9_321_125,
    tokenId: 44,
  },
  {
    inscriptionId: `b07c1ac38a3df03249d49098b6cb80af979a3cf60406899651cc5615e5284b8ei0`,
    inscriptionNumber: 9_321_129,
    tokenId: 45,
  },
  {
    inscriptionId: `63cad99d0828689fd0b7c865737428237c461aac0b700c42f747b15947a62503i0`,
    inscriptionNumber: 9_268_408,
    tokenId: 47,
  },
  {
    inscriptionId: `dd116d7cb0d31a5630dd9e483809e821f8df0b0cb52308e4ce58ac2bcafa7919i0`,
    inscriptionNumber: 9_323_839,
    tokenId: 51,
  },
  {
    inscriptionId: `e34966eaafeebb716a45664a7e8ff9f30b29b4d9df99a74439ad3b70fa26b909i0`,
    inscriptionNumber: 9_324_642,
    tokenId: 52,
  },
  {
    inscriptionId: `5b62c35f1ab5b633ee9b06965171feea3ef89eda2465e39ecbabff67a6c47ee6i0`,
    inscriptionNumber: 9_321_528,
    tokenId: 55,
  },
  {
    inscriptionId: `02150e53d5768ffdf4f3d0b4606dc5a1a08e3b0b18f033cf56bf7973379a53eei0`,
    inscriptionNumber: 9_321_529,
    tokenId: 56,
  },
  {
    inscriptionId: `440f36f3ec02e8666801385d757db54354c858e484a898c6663de8d8a1da13b0i0`,
    inscriptionNumber: 9_321_128,
    tokenId: 57,
  },
  {
    inscriptionId: `cbcfd16e8744e100072775d40035b1b1c8bdc5081e6f261a959f411fea856123i0`,
    inscriptionNumber: 9_321_536,
    tokenId: 62,
  },
  {
    inscriptionId: `5c0d72fd38fc4d8d74689b95c755c5f429247bf3d33615f3afe5d13809534820i0`,
    inscriptionNumber: 9_323_870,
    tokenId: 69,
  },
  {
    inscriptionId: `daa1d00d8715d02c203387bc4384306abb74d1ff9dad3ad8197251b722a94a3fi0`,
    inscriptionNumber: 9_321_531,
    tokenId: 70,
  },
  {
    inscriptionId: `9b6da3f9a6e9490ef9ab4525b081554f9def987ddb54afdfccb5e209ffbf942ei0`,
    inscriptionNumber: 9_321_526,
    tokenId: 71,
  },
  {
    inscriptionId: `9b43ccc9202252d745dcfee87a2a6386d04e6a6f7a512fedf314321e0f6ee2c5i0`,
    inscriptionNumber: 9_323_836,
    tokenId: 73,
  },
  {
    inscriptionId: `b72d4b10c0a36a443d4ac665763844a73ccd84cc69889fd829c69dc614917f31i0`,
    inscriptionNumber: 10_032_647,
    tokenId: 76,
  },
  {
    inscriptionId: `17f9c6e9887e375d27ad0860021538f5e327ab9ce0c6ad09dc1e1199b317cfbfi0`,
    inscriptionNumber: 10_032_648,
    tokenId: 81,
  },
  {
    inscriptionId: `791f24b8796f9878700c49ff7c0c88678faa4d720a5c1fd000ec09ea11380760i0`,
    inscriptionNumber: 9_321_537,
    tokenId: 85,
  },
  {
    inscriptionId: `eebd29f2268e267e6fcb6afe2d835650c67fcda3c3d34e25b9c6ffbf864a7abai0`,
    inscriptionNumber: 9_321_534,
    tokenId: 86,
  },
  {
    inscriptionId: `2f53392e4a19fdd37f88a1a994ac563d8f6101ec506ec3c1a1dcdc4d19f5a548i0`,
    inscriptionNumber: 9_321_127,
    tokenId: 88,
  },
];

type Item = {
  id: string;
  number: number;
  transaction_hash: string;
  transaction_fee: number;
  creator: string;
  initial_owner: string;
  current_owner: string;
  block_timestamp: number;
  block_number: number;
  block_hash: string;
  sat_ordinal: `${number}`;
  sat_rarity: number;
  sat_coinbase_height: number;
  content_length: number;
};

// console.log(uniques);
const potentials = Object.values(uniques) as Item[];
// const mintedNumbers = ALL_MINTED_NEKOS.map((x) => x.inscriptionId);
// const potentialNumbers = potentials.map((x: Item) => x.ethscription_number);

// const foundMintedTxs = potentials
//   .map((x) => {
//     return ALL_MINTED_NEKOS.find((z) => z.inscriptionId === x.transaction_hash)
//       ? x
//       : null;
//   })
//   .filter(Boolean) as Item[];

// const notFounds: Item[] = potentials
//   .map((x) => {
//     return ALL_MINTED_NEKOS.find((z) => z.inscriptionId === x.transaction_hash)
//       ? null
//       : x;
//   })
//   .filter(Boolean) as Item[];

const allNekos = (
  await Promise.all(
    potentials.map(async (x: Item) => {
      const resp = await fetch(`https://ordinals.com/content/${x.id}`);
      if (!resp.ok) {
        // console.error(`Failed to fetch content for`, x.id);
        return null;
      }

      const content = await resp.text();
      const json = JSON.parse(content);
      // const meta = {
      //   protocol: json?.protocol,
      //   token: {
      //     id: json?.token?.id,
      //     traits: json?.token?.traits,
      //   },
      //   collectionInscriptionId: json?.collectionInscriptionId,
      //   digest: json?.digest,
      // };
      const isORD721 = Boolean(
        json.protocol && json.protocol.type && json.token
      );
      const isBTC721 = Boolean(
        json.protocol &&
          !json.protocol.type &&
          json.protocol.name &&
          json.content &&
          json.attributes
      );

      if (isBTC721) {
        // const { digest: _any, ...item } = x;

        return {
          data: {
            protocol: { name: "ORD721", version: "1.0", type: "token" },
            token: {
              id: json.tokenId,
              traits: json.attributes.reduce(
                (acc: any, attr: any) => ({
                  // biome-ignore lint/performance/noAccumulatingSpread: bruh
                  ...acc,
                  [attr.trait_type]: attr.value,
                }),
                {} as any
              ),
              uri: json.content,
            },
          },
          meta: x,
        };
      }

      if (isORD721) {
        // console.log(
        //   "Found neko:",
        //   json.token.id,
        //   x.transaction_hash,
        //   json.token.traits
        // );

        return { data: json, meta: x };
      }
      return null;
    })
  )
).filter(Boolean);

export async function sha256digest(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
  const hashArray = new Uint8Array(hashBuffer);
  return Array.from(hashArray)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// missing: 7, 9, 11, 23, 34, 40, 50, 60, 64, 68, 80, 97
console.log(
  JSON.stringify(
    allNekos.sort((a: any, b: any) => a.data.token.id - b.data.token.id),
    null,
    2
  )
);

// console.log(
//   await fetch(
//     `https://ordinals.com/content/142c64fbd3e10eacbc5306541cfa6d7fad006292cc28dad85b6b7657bec969fei0`
//   )
//     .then((x) => x.json())
//     .then(async (x) => {
//       const { digest: _any, ...item } = x;

//       const sha = await sha256digest(JSON.stringify(item));
//       return sha;
//     })
// );

// console.log("wwwwwwwwwwwwwwwww", allNekos);
// const ALL_NEKOS = (allNekos as ProtocolItem[]).sort(
//   (a, b) => a.token.id - b.token.id
// );

// const foundUniques = [...foundMintedTxs, ...toFindTxs]
//   .filter(Boolean)
//   .reduce((acc: any, item: Item) => {
//     acc[item.transaction_hash] = item;

//     return acc;
//   }, {} as any);

// console.log(ALL_NEKOS, ALL_NEKOS.length);
// console.log(Object.values(foundUniques).length);
// console.log(
//   foundMintedTxs.length,
//   toFindTxs.length,
//   foundMintedTxs.length + toFindTxs.length
// );
// console.log(toFindTxs.length);

// console.log(
//   JSON.stringify(potentials, null, 2),
//   potentials.length,
//   ALL_MINTED_NEKOS.length
// );
