import "dotenv/config";
import prisma from "../lib/prisma";
import * as bcrypt from "bcryptjs";
import { ProjectPhase, ArtifactType } from "@prisma/client";

async function main() {
  console.log("🌱 Starting database seed...");

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
      artifacts: {
        create: [
          {
            title: "Initial Wireframe",
            description: "Low-fidelity wireframe for the homepage layout",
            phase: ProjectPhase.DESIGN,
            type: ArtifactType.WIREFRAME,
            sourceLinkUrl: "https://www.figma.com/design/wD4at4GNS0B4opQ0DQTSFz/Web-Neo-Telemetri?node-id=0-1&p=f&t=pohd9Z8mTE2QkaW1-0",
          },
          {
            title: "Meeting Notes - Kickoff",
            description: "Notes from the initial requirement gathering meeting",
            phase: ProjectPhase.DISCOVERY,
            type: ArtifactType.MEETING_NOTES,
            sourceLinkUrl: "https://docs.google.com/document/d/1Ud8qyHRfdbbvcfsyOnqn94WKLLH3xn0FX-IrlXKsBx0/edit?ouid=105375265089657845508&usp=docs_home&ths=true",
          },
        ],
      },
      updates: {
        create: [
          {
            phase: ProjectPhase.DESIGN,
            description: "Finalized the color palette and typography choices.",
            links: {
              create: [
                {
                  label: "Typography System",
                  url: "https://figma.com/typography",
                },
              ],
            },
          },
        ],
      },
      feedbacks: {
        create: [
          {
            message: "Tolong warna birunya dibuat lebih terang sedikit.",
          },
          {
            message: "Bagian 'About Us' butuh foto tim yang lebih besar.",
          },
        ],
      },
    },
  });

  const project2 = await prisma.project.create({
    data: {
      clientName: "Toko Bahagia",
      clientPhone: "6281234567890",
      projectName: "Aplikasi E-Commerce Android",
      deadline: new Date("2025-12-01"),
      status: "Done",
      logs: {
        create: [
          {
            title: "Development Completed",
            description: "Semua fitur utama telah selesai dikembangkan",
            percentage: 90,
          },
          {
            title: "Final Testing & Deployment",
            description: "Aplikasi telah dirilis ke Play Store",
            percentage: 100,
          },
        ],
      },
      artifacts: {
        create: [
          {
            title: "User Flow Diagram",
            description: "Checkout process flow",
            phase: ProjectPhase.DESIGN,
            type: ArtifactType.USER_FLOW,
            sourceLinkUrl: "https://miro.com/app/board/uXjVGLZ1XYk=/?share_link_id=636048091155",
          },
        ],
      },
      updates: {
        create: [
          {
            phase: ProjectPhase.LAUNCH,
            description: "App successfully published to Google Play Console.",
          },
        ],
      },
      feedbacks: {
        create: [
          {
            message: "Mantap gan, aplikasinya lancar jaya!",
          },
        ],
      },
    },
  });

  console.log("✅ Sample projects created:");
  console.log(`   - ${project1.projectName} (Token: ${project1.uniqueToken})`);
  console.log(`   - ${project2.projectName} (Token: ${project2.uniqueToken})`);

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
