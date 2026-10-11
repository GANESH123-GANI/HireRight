import { prisma } from "../src/lib/prisma";

async function main() {
  const admin = await prisma.user.findUnique({
    where: { email: "admin@techcitta.com" },
    include: { profile: true },
  });

  if (admin && !admin.profile) {
    await prisma.profile.create({
      data: {
        userId: admin.id,
        currentRole: "Recruitment Administrator",
        totalExperience: "8 years",
        currentLocation: "Headquarters",
        skills: "Talent Acquisition, Leadership, Screening, Technical Hiring",
        aboutYou: "Hiring administrator managing recruitment pipelines and candidate assessments.",
        isComplete: true,
        step: 4,
      },
    });
    console.log("Created profile for Admin user.");
  } else {
    console.log("Admin already has a profile.");
  }
}

main().finally(() => prisma.$disconnect());
