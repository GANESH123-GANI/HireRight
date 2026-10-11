import { prisma } from "../src/lib/prisma";
import { createSession, verifyPassword } from "../src/lib/auth";

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: "admin@techcitta.com" },
    include: { organization: true },
  });

  if (!user) {
    console.error("User not found!");
    return;
  }

  const valid = await verifyPassword("admin123", user.password);
  console.log("Password valid for admin@techcitta.com:", valid);

  const session = await createSession(user.id, user.organizationId);
  console.log("Created session token:", session.token.slice(0, 10) + "...");
}

main().finally(() => prisma.$disconnect());
