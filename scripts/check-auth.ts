import { prisma } from "../src/lib/prisma";
import { verifyPassword } from "../src/lib/auth";

async function main() {
  const users = await prisma.user.findMany({
    include: { organization: true, profile: true },
  });
  for (const u of users) {
    const pw = u.role === "admin" ? "admin123" : "candidate123";
    const valid = await verifyPassword(pw, u.password);
    console.log(`User: ${u.email}, Role: ${u.role}, Password '${pw}' valid: ${valid}, Org Status: ${u.organization?.status}, EmailVerified: ${u.emailVerifiedAt}`);
  }
}

main().finally(() => prisma.$disconnect());
