import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL!,
  ssl: { rejectUnauthorized: false },
  family: 4,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const missions = [
  // ── scan_count ─────────────────────────────────────────
  {
    title: "Escaneie 1 item",
    description: "Comece o dia fazendo a diferença! Escaneie qualquer item reciclável.",
    type: "scan_count",
    target: 1,
    category: null,
    reward: 5,
  },
  {
    title: "Escaneie 2 itens",
    description: "Dois itens reciclados, dois passos para um mundo melhor!",
    type: "scan_count",
    target: 2,
    category: null,
    reward: 10,
  },
  {
    title: "Escaneie 3 itens",
    description: "Três é o número mágico! Escaneie 3 itens hoje.",
    type: "scan_count",
    target: 3,
    category: null,
    reward: 15,
  },
  {
    title: "Escaneie 5 itens",
    description: "Missão desafiadora! Escaneie 5 itens e mostre seu compromisso.",
    type: "scan_count",
    target: 5,
    category: null,
    reward: 25,
  },
  {
    title: "Escaneie 7 itens",
    description: "Super missão! Você consegue escanear 7 itens hoje?",
    type: "scan_count",
    target: 7,
    category: null,
    reward: 40,
  },

  // ── scan_category: plástico ────────────────────────────
  {
    title: "Escaneie 1 Plástico",
    description: "Encontre e escaneie 1 item de plástico para reciclar.",
    type: "scan_category",
    target: 1,
    category: "plastico",
    reward: 8,
  },
  {
    title: "Escaneie 3 Plásticos",
    description: "O plástico demora 400 anos para decompor. Escaneie 3!",
    type: "scan_category",
    target: 3,
    category: "plastico",
    reward: 20,
  },

  // ── scan_category: papel ───────────────────────────────
  {
    title: "Escaneie 1 Papel",
    description: "Uma folha reciclada salva árvores! Escaneie 1 item de papel.",
    type: "scan_category",
    target: 1,
    category: "papel",
    reward: 8,
  },
  {
    title: "Escaneie 3 Papéis",
    description: "Papel pode ser reciclado até 7 vezes! Escaneie 3 hoje.",
    type: "scan_category",
    target: 3,
    category: "papel",
    reward: 20,
  },

  // ── scan_category: metal ───────────────────────────────
  {
    title: "Escaneie 1 Metal",
    description: "Alumínio é 100% reciclável! Escaneie 1 item de metal.",
    type: "scan_category",
    target: 1,
    category: "metal",
    reward: 8,
  },
  {
    title: "Escaneie 2 Metais",
    description: "Latinhas e latas são super recicláveis. Encontre 2!",
    type: "scan_category",
    target: 2,
    category: "metal",
    reward: 15,
  },

  // ── scan_category: orgânico ────────────────────────────
  {
    title: "Escaneie 1 Orgânico",
    description: "Orgânicos viram adubo! Escaneie 1 resíduo orgânico.",
    type: "scan_category",
    target: 1,
    category: "organico",
    reward: 8,
  },
  {
    title: "Escaneie 2 Orgânicos",
    description: "A compostagem transforma lixo em vida. Escaneie 2!",
    type: "scan_category",
    target: 2,
    category: "organico",
    reward: 15,
  },

  // ── scan_category: vidro ───────────────────────────────
  {
    title: "Escaneie 1 Vidro",
    description: "Vidro é infinitamente reciclável! Escaneie 1 item de vidro.",
    type: "scan_category",
    target: 1,
    category: "vidro",
    reward: 8,
  },
  {
    title: "Escaneie 2 Vidros",
    description: "Garrafas e potes de vidro podem ter uma nova vida. Encontre 2!",
    type: "scan_category",
    target: 2,
    category: "vidro",
    reward: 15,
  },
];

async function main() {
  console.log("🌱 Seeding daily missions...");

  // Limpa missões antigas para re-seed (não afeta progresso dos usuários)
  const existing = await prisma.dailyMission.count();
  if (existing === 0) {
    await prisma.dailyMission.createMany({ data: missions });
    console.log(`✅ ${missions.length} missões criadas.`);
  } else {
    console.log(`⏭️  Já existem ${existing} missões. Pulando seed.`);
  }
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
