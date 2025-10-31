export async function getOgNekos() {
	const metaFile = Bun.file("./scripts/neko-og-meta.json");
	const metas = (await metaFile.json()).nfts
		.map((meta: any) => ({
			index: Number(meta.tokenId),
			name: meta.name,
			metadata: meta.raw.metadata,
		}))
		.sort((a: any, b: any) => a.index - b.index);

	// console.log(metas);

	const txsFile = Bun.file("./scripts/neko-og-txs.json");
	const txs = (await txsFile.json()).sort((a: any, b: any) => {
		return (
			Number(a.receipt.blockNumber) - Number(b.receipt.blockNumber) ||
			Number(a.receipt.transactionIndex) - Number(b.receipt.transactionIndex)
		);
	});

	const inferredTxs = await Promise.all(
		txs.map(async ({ receipt, block_timestamp }: any) => {
			// sasa
			const transaction_fee = Number(
				(
					BigInt(receipt.gasUsed) * BigInt(receipt.effectiveGasPrice)
				).toString(),
			);

			const creator = receipt.from.toLowerCase();
			const receiver = receipt.from.toLowerCase();

			const nekos = await Promise.all(
				receipt.logs.map(
					async (x: any, idx: number) =>
						await createNekoItem({
							idx,
							metas,
							receipt,
							transaction_fee,
							creator,
							initial_owner: receiver,
							logIndex: x.logIndex,
							topics: x.topics,
							blockTimestamp: block_timestamp,
						}),
				),
			);

			return nekos;
		}),
	);

	const items = inferredTxs.flat();

	return items;
}

export async function sha256digest(input: string): Promise<`0x${string}`> {
	const encoder = new TextEncoder();
	const data = encoder.encode(input);
	const hash = await crypto.subtle.digest("SHA-256", data);
	const hashArray = Array.from(new Uint8Array(hash));
	const hashHex = hashArray
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");

	return `0x${hashHex}`;
}

export async function createNekoItem({
	idx,
	metas,
	receipt,
	transaction_fee,
	creator,
	initial_owner,
	logIndex,
	topics,
	blockTimestamp,
}: any) {
	const tokenId = Number(BigInt(topics[3]));
	const meta = await fetch(
		`https://ipfs.io/ipfs/bafybeia6p4j2ry3a772idzlwua56xadw7yis46b6hlp6va4o6qsx7ug2qe/${tokenId}.json`,
	)
		.then((res) => res.text())
		.then((res) => JSON.parse(res));

	const traits = Object.fromEntries(
		meta.attributes.map((attr: any) => [
			attr.trait_type.toLowerCase(),
			attr.value.toLowerCase(),
		]),
	);

	const html = await fetch(
		`https://ipfs.io/ipfs/QmTgmhBLdFxq8TabME5f8Zn7GezNX1gjcHtrYwtmRzrDxL/${tokenId}.html`,
	).then((res) => res.text());
	const content_sha = await sha256digest(html);

	return {
		index: tokenId,
		name: `0xNeko OG #${tokenId}`,
		block_number: Number(receipt.blockNumber),
		block_hash: receipt.blockHash,
		block_timestamp: Number(BigInt(blockTimestamp)) / 1000,
		transaction_hash: receipt.transactionHash,
		transaction_index: receipt.transactionIndex,
		transaction_fee,
		event_log_index: logIndex,
		creator,
		initial_owner,
		content_sha,
		// current_owner: creator === receiver ? creator : "0x",
		// previous_owner: creator === receiver ? creator : "0x",
		current_owner: "0x",
		previous_owner: "0x",
		number: tokenId,
		traits: {
			block: Number(receipt.blockNumber),
			year: 2022,
			gen: "OG",
			...traits,
		},
	};
}

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

export async function writeOgNekos() {
	const items = await getOgNekos();
	const xxxx = items.concat(...(await addMissingOgs()));
	const nekos = xxxx.map((x: any) => {
		const initial_owner = x.receiver || x.initial_owner;
		const number = x.index;
		delete x.receiver;
		delete x.ethscription_number;

		return { ...x, id: x.transaction_hash, initial_owner, number };
	});

	// const allOgs = await Promise.all(xxxx.map((item) => item.id));
	console.log(
		JSON.stringify(
			sortItems(nekos).sort((a, b) => a.index - b.index),
			null,
			2,
		),
	);
}

export async function writeEthsNekos() {
	const file = Bun.file("./public/0xnekos-eths.json");
	const nekos = await file.json();

	const items = nekos.map((x) => {
		const initial_owner = x.receiver;
		const number = x.ethscription_number;
		delete x.receiver;
		delete x.ethscription_number;

		return {
			...x,
			id: x.transaction_hash,
			initial_owner,
			number,
			event_log_index: null,
		};
	});

	// const items = nekos
	//   .map((neko: any, idx: number) => {
	//     return {
	//       ...neko,
	//       index: idx + 1,
	//       name: `0xNeko Cats #${idx + 1}`,
	//       traits: { ...neko.traits, gen: "Ethscriptions" },
	//     };
	//   })
	//   .sort((a, b) => a.index - b.index);

	// const ogs = await Promise.all(
	//   items.map(async (item: any) => {
	//     const resp = await fetch(
	//       `https://mainnet.api.calldata.space/ethscriptions/${item.transaction_hash}/owners`
	//     );
	//     const { result } = await resp.json();
	//     const {
	//       creator,
	//       initial: receiver,
	//       currrent: current_owner,
	//       previous: previous_owner,
	//     } = result;

	//     return {
	//       ...item,
	//       traits: { ...item.traits, gen: "Ethscriptions" },
	//       creator,
	//       receiver,
	//       current_owner,
	//       previous_owner,
	//     };
	//   })
	// );

	console.log(JSON.stringify(sortItems(items), null, 2));
}

export async function addMissingOgs() {
	const ogs = await Promise.all(
		[
			{
				block_hash:
					"0x3a2dda998b89aee746acb0faa6797820ecaa969e4e15e2e66de19ece3972efdf",
				block_number: 14_767_067,
				block_timestamp: 1_652_430_295_000,
				content_sha: null,
				from: "0x18A4EBeEA97AAF45d7dE8c248b09AB9c25BC1906",
				event_log_index: 47,
				transaction_fee: 20_003_387_004_919_800,
				transaction_hash:
					"0xe548650b420450863955b8020c5bae8f32c0fad65169f3a6d67cbc6b58771b7e",
				transaction_index: 38,
			},
			{
				block_hash:
					"0x3a2dda998b89aee746acb0faa6797820ecaa969e4e15e2e66de19ece3972efdf",
				block_number: 14_767_067,
				block_timestamp: 1_652_430_295_000,
				content_sha: null,
				from: "0x18A4EBeEA97AAF45d7dE8c248b09AB9c25BC1906",
				event_log_index: 48,
				transaction_fee: 20_003_387_004_919_800,
				transaction_hash:
					"0xe548650b420450863955b8020c5bae8f32c0fad65169f3a6d67cbc6b58771b7e",
				transaction_index: 38,
			},
			{
				block_hash:
					"0x3a2dda998b89aee746acb0faa6797820ecaa969e4e15e2e66de19ece3972efdf",
				block_number: 14_767_067,
				block_timestamp: 1_652_430_295_000,
				content_sha: null,
				from: "0x18A4EBeEA97AAF45d7dE8c248b09AB9c25BC1906",
				event_log_index: 49,
				transaction_fee: 20_003_387_004_919_800,
				transaction_hash:
					"0xe548650b420450863955b8020c5bae8f32c0fad65169f3a6d67cbc6b58771b7e",
				transaction_index: 38,
			},
			{
				block_hash:
					"0x3a2dda998b89aee746acb0faa6797820ecaa969e4e15e2e66de19ece3972efdf",
				block_number: 14_767_067,
				block_timestamp: 1_652_430_295_000,
				content_sha: null,
				from: "0x18A4EBeEA97AAF45d7dE8c248b09AB9c25BC1906",
				event_log_index: 50,
				transaction_fee: 20_003_387_004_919_800,
				transaction_hash:
					"0xe548650b420450863955b8020c5bae8f32c0fad65169f3a6d67cbc6b58771b7e",
				transaction_index: 38,
			},
			{
				block_hash:
					"0x3a2dda998b89aee746acb0faa6797820ecaa969e4e15e2e66de19ece3972efdf",
				block_number: 14_767_067,
				block_timestamp: 1_652_430_295_000,
				content_sha: null,
				from: "0x18A4EBeEA97AAF45d7dE8c248b09AB9c25BC1906",
				event_log_index: 51,
				transaction_fee: 20_003_387_004_919_800,
				transaction_hash:
					"0xe548650b420450863955b8020c5bae8f32c0fad65169f3a6d67cbc6b58771b7e",
				transaction_index: 38,
			},
			{
				block_hash:
					"0x3a2dda998b89aee746acb0faa6797820ecaa969e4e15e2e66de19ece3972efdf",
				block_number: 14_767_067,
				block_timestamp: 1_652_430_295_000,
				content_sha: null,
				from: "0x18A4EBeEA97AAF45d7dE8c248b09AB9c25BC1906",
				event_log_index: 52,
				transaction_fee: 20_003_387_004_919_800,
				transaction_hash:
					"0xe548650b420450863955b8020c5bae8f32c0fad65169f3a6d67cbc6b58771b7e",
				transaction_index: 38,
			},
		].map(async ({ from: creator, ...item }, idx) => {
			// "block_hash": "0x63b52be2e50bc426e23d3d29638acc054f5d77abd0ab15a5913f62046c138c00",
			// "block_number": 14767067,
			// "block_timestamp": 1652430295000,
			// "content_sha": "0xf214a2a99530f9e5191b96c5ab0229d8e221cf20aaa441da383a03fcf4f94662",
			// "creator": "0x63f8104ff09e10369aee48d21db5ae37da447003",
			// "current_owner": "0x63f8104ff09e10369aee48d21db5ae37da447003",
			// "ethscription_number": -1,
			// "event_log_index": 44,
			// "index": 93,
			// "name": "0xNeko OG #93",
			// "previous_owner": "0x63f8104ff09e10369aee48d21db5ae37da447003",
			// "receiver": "0x63f8104ff09e10369aee48d21db5ae37da447003",
			// "traits": {
			//   "block": 14767067,
			//   "year": 2022,
			//   "gen": "OG",
			//   "background": "grey",
			//   "cat": "cream",
			//   "eyes": "black",
			//   "cursor": "milk"
			// },
			// "transaction_fee": 6743368606263520,
			// "transaction_hash": "0xbfaca5645aaf9361e1a4042516c8cac006bad02c1925b6e10a87efd7f3f356e8",
			// "transaction_index": 35

			const tokenId = 93 + idx + 1;
			const html = await fetch(
				`https://ipfs.io/ipfs/QmTgmhBLdFxq8TabME5f8Zn7GezNX1gjcHtrYwtmRzrDxL/${tokenId}.html`,
			).then((res) => res.text());
			const content_sha = await sha256digest(html);
			const meta = await fetch(
				`https://ipfs.io/ipfs/bafybeia6p4j2ry3a772idzlwua56xadw7yis46b6hlp6va4o6qsx7ug2qe/${tokenId}.json`,
			)
				.then((res) => res.text())
				.then((res) => JSON.parse(res));

			const traits = Object.fromEntries(
				meta.attributes.map((attr: any) => [
					attr.trait_type.toLowerCase(),
					attr.value.toLowerCase(),
				]),
			);

			return {
				...item,
				content_sha,
				creator: creator.toLowerCase(),
				initial_owner: creator.toLowerCase(),
				current_owner: "0x",
				previous_owner: "0x",
				number: tokenId,
				index: tokenId,
				name: `0xNeko OG #${tokenId}`,
				traits: {
					...traits,
					block: item.block_number,
					year: 2022,
					gen: "OG",
				},
			};
		}),
	);

	return ogs;
	// console.log(JSON.stringify(sortItems(await Promise.all(ogs)), null, 2));
}

writeOgNekos();
// writeEthsNekos();
