import { api } from "./api";

export type ScanCategory = "plastico" | "papel" | "metal" | "organico" | "vidro";

const SIMULATE_CATEGORIES: ScanCategory[] = ["plastico", "papel", "metal", "organico", "vidro"];

export async function submitScan(imageUri?: string) {
  const category = SIMULATE_CATEGORIES[
    Math.floor(Math.random() * SIMULATE_CATEGORIES.length)
  ];

  const response = await api.post("/scan", { category });

  return {
    category,
    pointsEarned: response.data.pointsEarned,
    totalPoints:  response.data.totalPoints,
    scanId:       response.data.scan.id,
    streak:       response.data.streak,
    imageUri,
  };
}
