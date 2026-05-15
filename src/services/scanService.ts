import { api } from "./api";
import { NewAchievement } from "./achievementService";
import * as FileSystem from "expo-file-system";

export type ScanCategory = "plastico" | "papel" | "metal" | "organico" | "vidro";

const VALID_CATEGORIES: ScanCategory[] = ["plastico", "papel", "metal", "organico", "vidro"];

const AI_API_URL = "https://thedree-descarte-certo-api.hf.space/classify";
const CONFIDENCE_THRESHOLD = 0.5;

// ── Erro customizado para confiança baixa ────────────────
export class NotTrashError extends Error {
  constructor() {
    super("Nenhum resíduo reconhecido na imagem.");
    this.name = "NotTrashError";
  }
}

// ── Tipo do retorno de submitScan ─────────────────────────
export interface ScanResult {
  category: ScanCategory;
  confidence: number;
  pointsEarned: number;
  totalPoints: number;
  scanId: string;
  streak: number;
  newAchievements: NewAchievement[];
  imageUri?: string;
}

// ── Função principal ──────────────────────────────────────
export async function submitScan(imageUri: string, base64Str?: string): Promise<ScanResult> {
  // 1. Usa o base64 passado ou lê a imagem como base64
  let base64 = base64Str;
  if (!base64) {
    base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
  }

  // 2. Envia para a IA
  const aiRes = await fetch(AI_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: base64 }),
  });

  if (!aiRes.ok) {
    throw new Error("Erro ao classificar a imagem. Tente novamente.");
  }

  const aiData = await aiRes.json();
  const category = aiData.category as ScanCategory;
  const confidence = aiData.confidence as number;

  // 3. Valida se é uma categoria válida e se a confiança é suficiente
  if (!VALID_CATEGORIES.includes(category) || confidence < CONFIDENCE_THRESHOLD) {
    throw new NotTrashError();
  }

  // 4. Registra o scan no backend
  const response = await api.post("/scan", { category });

  return {
    category,
    confidence,
    pointsEarned: response.data.pointsEarned,
    totalPoints: response.data.totalPoints,
    scanId: response.data.scan.id,
    streak: response.data.streak,
    newAchievements: (response.data.newAchievements ?? []) as NewAchievement[],
    imageUri,
  };
}
