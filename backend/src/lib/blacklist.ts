import { prisma } from "./prisma";

export async function blacklistToken(token: string) {
  await prisma.blacklistedToken.create({ data: { token } });
}

export async function isBlacklisted(token: string): Promise<boolean> {
  const found = await prisma.blacklistedToken.findUnique({ where: { token } });
  return !!found;
}

// limpa tokens com mais de 7 dias — chamar periodicamente
export async function cleanExpiredTokens() {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  await prisma.blacklistedToken.deleteMany({
    where: { createdAt: { lt: sevenDaysAgo } },
  });
}
