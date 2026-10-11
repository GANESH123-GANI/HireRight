import { prisma } from "../src/lib/prisma";

async function main() {
  const tables: any[] = await prisma.$queryRawUnsafe(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
  `);
  console.log("Total tables in DB:", tables.length);
  console.log("Tables:", tables.map(t => t.table_name).join(", "));
}

main().finally(() => prisma.$disconnect());
