import fs from "node:fs/promises";

const HIRO_API_URL = `https://api.hiro.so/ordinals/v1/inscriptions?mime_type=application/json&from_number=910032&order=asc&to_number=12500100&limit=50`;

// fetch inscriptions paginated with `offset` recursively until all are fetched
async function fetchInscriptions(offset = 0) {
  console.log(`Fetching inscriptions at offset ${offset}...`);
  const url = `${HIRO_API_URL}&offset=${offset}`;
  const response = await fetch(url);

  if (!response.ok) {
    console.error(
      `Failed to fetch inscriptions at offset ${offset}`,
      response.status,
      response.statusText,
    );
    return;
  }

  const { results: inscriptions, ...data } = await response.json();

  if (data.total === 0 && inscriptions.length === 0) {
    console.log("No more inscriptions found");
    return;
  }

  console.log(
    "Page inscriptions",
    inscriptions[0].number,
    inscriptions.at(-1).number,
    data,
  );

  const filteredInscriptions = inscriptions.filter((x: any) => {
    return x.content_length > 10_000 && x.content_length < 15_000;
  });

  if (filteredInscriptions.length > 0) {
    console.log(
      `========================= Found potential 0xNeko inscriptions ========================= `,
      filteredInscriptions.length,
    );

    const nekos = JSON.parse(await fs.readFile("./nekos.json", "utf8"));

    await fs.writeFile(
      "./nekos.json",
      JSON.stringify([...nekos, ...filteredInscriptions]),
    );
    console.log(
      `========================= Saved ${filteredInscriptions.length} neko inscriptions ========================= `,
    );
  }

  const nextOffset = offset + inscriptions.length;
  if (nextOffset < data.total) {
    console.log("Delaying 500ms...");
    await delay(500);
    console.log("Fetching next page...", nextOffset);
    await fetchInscriptions(nextOffset);
  }
}

async function delay(ms = 1000) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

fetchInscriptions(60_200);
