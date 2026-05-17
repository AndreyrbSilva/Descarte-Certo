import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

import { encrypt } from "../src/lib/crypto";

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

const achievements = [
  // ── total_scans ──────────────────────────────────────────
  { key: "first_scan",      title: "Primeiro Passo",        description: "Realize seu primeiro escaneamento.",                         icon: "star",       type: "total_scans",        threshold: 1,    reward: 5,   sortOrder: 1  },
  { key: "scans_10",        title: "Coletor Iniciante",     description: "Escaneie 10 itens recicláveis.",                             icon: "recycle",    type: "total_scans",        threshold: 10,   reward: 15,  sortOrder: 2  },
  { key: "scans_50",        title: "Coletor Dedicado",      description: "Escaneie 50 itens recicláveis.",                             icon: "medal",      type: "total_scans",        threshold: 50,   reward: 30,  sortOrder: 3  },
  { key: "scans_100",       title: "Coletor Mestre",        description: "Escaneie 100 itens recicláveis.",                            icon: "trophy",     type: "total_scans",        threshold: 100,  reward: 50,  sortOrder: 4  },
  { key: "scans_500",       title: "Lenda da Reciclagem",   description: "Escaneie 500 itens recicláveis. Você é uma inspiração!",     icon: "crown",      type: "total_scans",        threshold: 500,  reward: 100, sortOrder: 5  },

  // ── total_points ─────────────────────────────────────────
  { key: "points_100",      title: "Pontuação Bronze",      description: "Acumule 100 pontos reciclando.",                             icon: "medal",      type: "total_points",       threshold: 100,  reward: 10,  sortOrder: 6  },
  { key: "points_500",      title: "Pontuação Prata",       description: "Acumule 500 pontos reciclando.",                             icon: "medal",      type: "total_points",       threshold: 500,  reward: 25,  sortOrder: 7  },
  { key: "points_1000",     title: "Pontuação Ouro",        description: "Acumule 1000 pontos reciclando.",                            icon: "medal",      type: "total_points",       threshold: 1000, reward: 50,  sortOrder: 8  },
  { key: "points_2000",     title: "Pontuação Diamante",    description: "Acumule 2000 pontos. Você brilha!",                          icon: "diamond",    type: "total_points",       threshold: 2000, reward: 100, sortOrder: 9  },

  // ── streak ───────────────────────────────────────────────
  { key: "streak_7",        title: "Chama Acesa",           description: "Mantenha uma sequência de 7 dias.",                          icon: "flame",      type: "streak",             threshold: 7,    reward: 20,  sortOrder: 10 },
  { key: "streak_14",       title: "Fogo Eterno",           description: "Mantenha uma sequência de 14 dias.",                         icon: "flame",      type: "streak",             threshold: 14,   reward: 30,  sortOrder: 11 },
  { key: "streak_30",       title: "Imparável",             description: "Mantenha uma sequência de 30 dias!",                         icon: "flame",      type: "streak",             threshold: 30,   reward: 50,  sortOrder: 12 },
  { key: "streak_60",       title: "Lenda da Sequência",    description: "60 dias seguidos! Impressionante!",                          icon: "lightning",   type: "streak",             threshold: 60,   reward: 75,  sortOrder: 13 },
  { key: "streak_90",       title: "Imortal",               description: "90 dias seguidos! Você é imbatível!",                        icon: "diamond",    type: "streak",             threshold: 90,   reward: 100, sortOrder: 14 },

  // ── ranking_turma ────────────────────────────────────────
  { key: "turma_top10",     title: "Destaque da Turma",     description: "Entre no top 10 da sua turma.",                               icon: "trend",      type: "ranking_turma",      threshold: 10,   reward: 10,  sortOrder: 15 },
  { key: "turma_top5",      title: "Elite da Turma",        description: "Entre no top 5 da sua turma.",                                icon: "trophy",     type: "ranking_turma",      threshold: 5,    reward: 20,  sortOrder: 16 },
  { key: "turma_top3",      title: "Pódio da Turma",        description: "Entre no top 3 da sua turma!",                                icon: "medal",      type: "ranking_turma",      threshold: 3,    reward: 30,  sortOrder: 17 },
  { key: "turma_top1",      title: "Campeão da Turma",      description: "Chegue ao primeiro lugar da sua turma!",                      icon: "crown",      type: "ranking_turma",      threshold: 1,    reward: 50,  sortOrder: 18 },

  // ── ranking_escola ───────────────────────────────────────
  { key: "escola_top15",    title: "Referência Escolar",    description: "Entre no top 15 da escola.",                                  icon: "trend",      type: "ranking_escola",     threshold: 15,   reward: 15,  sortOrder: 19 },
  { key: "escola_top10",    title: "Estrela da Escola",     description: "Entre no top 10 da escola.",                                  icon: "star",       type: "ranking_escola",     threshold: 10,   reward: 25,  sortOrder: 20 },
  { key: "escola_top5",     title: "Elite Escolar",         description: "Entre no top 5 da escola!",                                   icon: "trophy",     type: "ranking_escola",     threshold: 5,    reward: 40,  sortOrder: 21 },
  { key: "escola_top3",     title: "Pódio da Escola",       description: "Entre no top 3 da escola!",                                   icon: "medal",      type: "ranking_escola",     threshold: 3,    reward: 60,  sortOrder: 22 },
  { key: "escola_top1",     title: "Rei da Escola",         description: "Primeiro lugar da escola inteira!",                           icon: "crown",      type: "ranking_escola",     threshold: 1,    reward: 100, sortOrder: 23 },

  // ── ranking_consistency ──────────────────────────────────
  { key: "turma_consist_2", title: "Consistente (Turma)",   description: "Fique no top 3 da turma por 2 meses seguidos.",               icon: "shield",     type: "ranking_consistency", threshold: 2,   reward: 40,  sortOrder: 24 },
  { key: "turma_consist_4", title: "Veterano (Turma)",      description: "Fique no top 3 da turma por 4 meses seguidos!",               icon: "shield",     type: "ranking_consistency", threshold: 4,   reward: 80,  sortOrder: 25 },
  { key: "escola_consist_2",title: "Consistente (Escola)",  description: "Fique no top 3 da escola por 2 meses seguidos.",              icon: "shield",     type: "ranking_consistency", threshold: 2,   reward: 60,  sortOrder: 26 },
  { key: "escola_consist_4",title: "Veterano (Escola)",     description: "Fique no top 3 da escola por 4 meses seguidos!",              icon: "shield",     type: "ranking_consistency", threshold: 4,   reward: 120, sortOrder: 27 },

  // ── category_diversity ───────────────────────────────────
  { key: "eco_diverso",     title: "Eco Diverso",           description: "Escaneie todas as 5 categorias de resíduos.",                 icon: "rainbow",    type: "category_diversity", threshold: 5,    reward: 20,  sortOrder: 28 },

  // ── missions_completed ───────────────────────────────────
  { key: "missions_1",      title: "Missão Cumprida",       description: "Complete sua primeira missão diária.",                        icon: "target",     type: "missions_completed", threshold: 1,    reward: 5,   sortOrder: 29 },
  { key: "missions_10",     title: "Maratonista",           description: "Complete 10 missões diárias.",                                icon: "target",     type: "missions_completed", threshold: 10,   reward: 30,  sortOrder: 30 },
  { key: "missions_30",     title: "Herói das Missões",     description: "Complete 30 missões diárias!",                                icon: "target",     type: "missions_completed", threshold: 30,   reward: 60,  sortOrder: 31 },
];

async function main() {
  console.log("🌱 Seeding daily missions...");

  const existingMissions = await prisma.dailyMission.count();
  if (existingMissions === 0) {
    await prisma.dailyMission.createMany({ data: missions });
    console.log(`✅ ${missions.length} missões criadas.`);
  } else {
    console.log(`⏭️  Já existem ${existingMissions} missões. Pulando seed.`);
  }

  console.log("\n🏆 Seeding achievements...");

  let created = 0;
  let skipped = 0;

  for (const a of achievements) {
    const existing = await prisma.achievement.findUnique({ where: { key: a.key } });
    if (existing) {
      skipped++;
      continue;
    }
    await prisma.achievement.create({ data: a });
    created++;
  }

  console.log(`✅ ${created} troféus criados, ${skipped} já existiam.`);

  // ── Admin user seed ─────────────────────────────────────────
  console.log("\n👤 Checking admin user...");

  const existingAdmin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  });

  if (!existingAdmin) {
    const adminPassword = await bcrypt.hash("admin123", 10);
    const adminMatricula = encrypt("000000");

    await prisma.user.create({
      data: {
        name:      "Administrador",
        matricula: adminMatricula,
        email:     "admin@descartecerto.com",
        password:  adminPassword,
        turma:     "ADM",
        role:      "ADMIN",
      },
    });

    console.log("✅ Admin criado (matrícula: 000000, senha: admin123)");
    console.log("⚠️  IMPORTANTE: Troque a senha do admin após o primeiro login!");
  } else {
    console.log(`⏭️  Admin já existe (${existingAdmin.email}). Pulando.`);
  }
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
