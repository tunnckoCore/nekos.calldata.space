import { fetchAllNekos } from "@/lib/preps";

const nekos = await fetchAllNekos();

console.log(JSON.stringify(nekos, null, 2));
