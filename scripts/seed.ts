import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  console.log("Seeding database with default Organization, Admin, and Candidate...");

  // 1. Create or get Organization
  let org = await prisma.organization.findFirst({
    where: { slug: "techcitta" },
  });

  if (!org) {
    org = await prisma.organization.create({
      data: {
        name: "Techcitta",
        slug: "techcitta",
        plan: "enterprise",
        planStatus: "active",
        status: "active",
        onboardingCompleted: true,
        onboardingStep: 3,
      },
    });
    console.log("Created Organization:", org.name, `(${org.id})`);
  } else {
    console.log("Found existing Organization:", org.name);
  }

  const hashedPassword = await bcrypt.hash("admin123", 10);
  const hashedCandidatePassword = await bcrypt.hash("candidate123", 10);

  // 2. Create Admin / Employer User
  let adminUser = await prisma.user.findUnique({
    where: { email: "admin@techcitta.com" },
  });

  if (!adminUser) {
    adminUser = await prisma.user.create({
      data: {
        email: "admin@techcitta.com",
        password: hashedPassword,
        name: "Admin User",
        role: "admin",
        emailVerifiedAt: new Date(),
        organizationId: org.id,
      },
    });

    await prisma.teamMember.create({
      data: {
        userId: adminUser.id,
        organizationId: org.id,
        role: "owner",
        acceptedAt: new Date(),
      },
    });

    console.log("Created Admin User: admin@techcitta.com / admin123");
  } else {
    console.log("Admin User already exists: admin@techcitta.com");
  }

  // 3. Create Candidate / Jobseeker User
  let candidateUser = await prisma.user.findUnique({
    where: { email: "candidate@techcitta.com" },
  });

  if (!candidateUser) {
    candidateUser = await prisma.user.create({
      data: {
        email: "candidate@techcitta.com",
        password: hashedCandidatePassword,
        name: "Alex Morgan",
        role: "jobseeker",
        emailVerifiedAt: new Date(),
        organizationId: org.id,
      },
    });

    // Create Candidate Profile
    await prisma.profile.create({
      data: {
        userId: candidateUser.id,
        currentRole: "Full Stack Software Engineer",
        totalExperience: "4 years",
        currentLocation: "Bangalore, India",
        skills: "React, Next.js, Node.js, TypeScript, PostgreSQL, Python, TailwindCSS",
        aboutYou: "Passionate full-stack developer with experience building scalable web applications.",
        isComplete: true,
        step: 4,
      },
    });

    console.log("Created Candidate User: candidate@techcitta.com / candidate123");
  } else {
    console.log("Candidate User already exists: candidate@techcitta.com");
  }

  // 4. Create sample Job
  const existingJob = await prisma.job.findFirst({
    where: { organizationId: org.id },
  });

  if (!existingJob) {
    await prisma.job.create({
      data: {
        organizationId: org.id,
        title: "Senior Full Stack Developer",
        description: "Looking for an experienced engineer skilled in TypeScript, Next.js, and Node.js.",
        department: "Engineering",
        location: "Hybrid / Remote",
        employmentType: "full-time",
        experienceLevel: "senior",
        salaryMin: 1800000,
        salaryMax: 2600000,
        currency: "INR",
        requiredSkills: "TypeScript, React, Next.js, PostgreSQL",
        status: "active",
      },
    });
    console.log("Created sample Job: Senior Full Stack Developer");
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
