import nekos from "./final-nekos-meta.json" with { type: "json" };

// {
//     "block_hash": "0x63b52be2e50bc426e23d3d29638acc054f5d77abd0ab15a5913f62046c138c00",
//     "block_number": 17673466,
//     "block_timestamp": 1689116087,
//     "content_sha": "0x3420e1c19389a3cac01ae5b6ab21cf8a54762b8ef25dd7c7cf4342c02af1c2c4",
//     "creator": "0xa20c07f94a127fd76e61fbea1019cce759225002",
//     "current_owner": "0xa20c07f94a127fd76e61fbea1019cce759225002",
//     "ethscription_number": 422794,
//     "index": 1,
//     "name": "0xNeko Cats #1",
//     "previous_owner": "0xc33f8610941be56fb0d84e25894c0d928cc97dde",
//     "receiver": "0xa20c07f94a127fd76e61fbea1019cce759225002",
//     "traits": {
//       "block": 17673466,
//       "year": 2023,
//       "gen": "Ethscriptions",
//       "background": "blue",
//       "cat": "gold",
//       "eyes": "red",
//       "cursor": "mouse"
//     },
//     "transaction_fee": 3116065174402432,
//     "transaction_hash": "0x77469acb50576b226f04949c54f39dd99989581cd7a5716b6b496ed90d001e5b",
//     "transaction_index": 115
//   },

function sortItems(items: any[]) {
  const sortedItems = items.map((item: any) => {
    const sortedKeys = Object.keys(item).sort();
    const sortedItem = {} as any;
    sortedKeys.forEach((key) => {
      sortedItem[key] =
        item[key] && typeof item[key] === "object"
          ? Object.fromEntries(
              Object.entries(item[key]).sort((a, b) =>
                a[0].localeCompare(b[0]),
              ),
            )
          : item[key];
    });
    return sortedItem;
  });

  return sortedItems;
}

const nekoOrdinals = nekos.map((neko) => ({
  id: `${neko.meta.transaction_hash}i0`,
  block_hash: `0x${neko.meta.block_hash}`,
  block_number: neko.meta.block_number,
  block_timestamp: neko.meta.block_timestamp,
  content_sha: `0x${neko.data.digest || ""}`,
  creator: neko.meta.creator,
  current_owner: neko.meta.current_owner,
  number: neko.meta.number,
  index: neko.data.token.id,
  name: `0xNeko Ordinals #${neko.data.token.id}`,
  previous_owner: "0x",
  initial_owner: neko.meta.initial_owner,
  traits: {
    ...neko.data.token.traits,
    block: neko.meta.block_number,
    year: 2023,
    gen: "Ordinals",
  },
  transaction_fee: neko.meta.transaction_fee,
  transaction_hash: `0x${neko.meta.transaction_hash}`,
  transaction_index: null,
  event_log_index: null,
  sat_ordinal: Number(neko.meta.sat_ordinal),
}));

console.log(
  JSON.stringify(
    sortItems(nekoOrdinals).sort((a, b) => a.index - b.index),
    null,
    2,
  ),
);
