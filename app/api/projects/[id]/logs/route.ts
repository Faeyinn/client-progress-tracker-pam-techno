import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendWhatsAppFonnte } from "@/lib/whatsapp";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const resolvedParams = await params;
    const projectId = resolvedParams.id;
    const body = await request.json();

    const { title, description, percentage, sendNotification } = body;

    // Ensure percentage is a number
    const percentageInt = parseInt(percentage.toString(), 10);

    if (!title || !description || isNaN(percentageInt)) {
      return NextResponse.json(
        { message: "Semua field wajib diisi dan percentage harus angka" },
        { status: 400 },
      );
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 },
      );
    }

    const log = await prisma.projectLog.create({
      data: {
        projectId,
        title,
        description,
        percentage: percentageInt,
      },
    });

    // Update project updated_at and status based on percentage
    await prisma.project.update({
      where: { id: projectId },
      data: {
        updatedAt: new Date(),
        status: percentageInt === 100 ? "Done" : "On Progress",
      },
    });

    if (sendNotification) {
      if (project.clientPhone) {
        try {
          const origin =
            request.headers.get("origin") || new URL(request.url).origin;
          const magicLink = `${origin}/track/${project.uniqueToken}`;

          const message =
            `Halo *${project.clientName}* !\n` +
            `Ada update progress untuk proyek: *${project.projectName}*\n\n` +
            `Update: *${title}*\n` +
            `Progress: *${percentageInt}%*\n\n` +
            `Lihat detail: ${magicLink}`;

          const sendResult = await sendWhatsAppFonnte({
            to: project.clientPhone,
            message,
          });

          if (!sendResult.ok) {
            console.error("WhatsApp log update send failed:", sendResult);
          }
        } catch (error) {
          console.error("WhatsApp log update threw:", error);
        }
      }
    }

    return NextResponse.json(log, { status: 201 });
  } catch (error) {
    console.error("Create log error:", error);
    return NextResponse.json(
      { message: "Gagal membuat log baru" },
      { status: 500 },
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const resolvedParams = await params;
    const projectId = resolvedParams.id;

    const logs = await prisma.projectLog.findMany({
      where: { projectId },
      orderBy: [{ createdAt: "desc" }, { percentage: "desc" }],
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("Get logs error:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data log" },
      { status: 500 },
    );
  }
}
