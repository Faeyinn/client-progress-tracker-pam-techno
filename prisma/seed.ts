import "dotenv/config";
import prisma from "../lib/prisma";
import * as bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Starting database seed...");

  // 1. Create Admin User
  const hashedPassword = await bcrypt.hash("jaeyipam", 10);

  const admin = await prisma.user.upsert({
    where: { username: "jaeyi" },
    update: {},
    create: {
      username: "jaeyi",
      password: hashedPassword,
    },
  });

  console.log("✅ Admin user created:", admin.username);

  // 2. Create Sample Projects
  const project1 = await prisma.project.create({
    data: {
      clientName: "Jaeyi Company",
      clientPhone: "62895600077007",
      projectName: "Website Company Profile",
      deadline: new Date("2026-02-28"),
      status: "On Progress",
      logs: {
        create: [
          {
            title: "Project Kickoff",
            description:
              "Meeting dengan klien untuk diskusi requirement dan timeline proyek",
            percentage: 10,
          },
          {
            title: "UI/UX Design",
            description:
              "Mockup design untuk homepage, about, dan contact page sudah selesai",
            percentage: 30,
          },
        ],
      },
    },
  });

  console.log("✅ Sample projects created:");
  console.log(`   - ${project1.projectName} (Token: ${project1.uniqueToken})`);

  console.log("\n🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
