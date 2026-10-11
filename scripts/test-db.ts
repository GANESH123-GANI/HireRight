import { prisma } from "../src/lib/prisma";

async function main() {
  const users = await prisma.user.findMany({
    include: { organization: true, profile: true },
  });
  for (const u of users) {
    console.log(`User ID: ${u.id}, Email: ${u.email}, Role: ${u.role}, Org ID: ${u.organizationId}`);
  }
}

main().finally(() => prisma.$disconnect());
