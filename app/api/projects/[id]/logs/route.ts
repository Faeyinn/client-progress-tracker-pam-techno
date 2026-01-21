import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
      // TODO: Implement WhatsApp notification logic here
      console.log(`Sending WhatsApp notification for project ${projectId}`);
    }

    return NextResponse.json(log, { status: 201 });
  } catch (error) {
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
    return NextResponse.json(
      { message: "Gagal mengambil data log" },
      { status: 500 },
    );
  }
}
