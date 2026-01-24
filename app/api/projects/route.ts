import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendWhatsAppFonnte } from "@/lib/whatsapp";
import type { Prisma } from "@prisma/client";

type ProjectWithLatestLog = Prisma.ProjectGetPayload<{
  include: {
    logs: {
      orderBy: [{ createdAt: "desc" }, { percentage: "desc" }];
      take: 1;
    };
  };
}>;

function normalizePhone(input: string): string {
  let phone = input.replace(/\D/g, "");
  if (phone.startsWith("0")) phone = "62" + phone.slice(1);
  if (!phone.startsWith("62")) phone = "62" + phone;
  return phone;
}

function isValidIndoWhatsApp(phone: string): boolean {
  return /^62\d{8,15}$/.test(phone);
}

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        logs: {
          orderBy: [{ createdAt: "desc" }, { percentage: "desc" }],
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const projectsWithProgress = projects.map((project: ProjectWithLatestLog) => {
      const progress = project.logs[0]?.percentage || 0;
      // Ensure status is consistent with progress, handling existing data issues
      const status = progress === 100 ? "Done" : project.status;

      return {
        ...project,
        progress,
        status,
      };
    });

    return NextResponse.json(projectsWithProgress);
  } catch (error: unknown) {
    const errorObject =
      typeof error === "object" && error !== null
        ? (error as Record<string, unknown>)
        : null;

    const message =
      (errorObject &&
        typeof errorObject.message === "string" &&
        errorObject.message) ||
      (error instanceof Error ? error.message : "Unknown error");

    const stack =
      errorObject && typeof errorObject.stack === "string"
        ? errorObject.stack
        : error instanceof Error
          ? error.stack
          : undefined;

    const code = errorObject ? errorObject.code : undefined;
    const meta = errorObject ? errorObject.meta : undefined;

    console.error("Get projects error details:", {
      message,
      stack,
      code,
      meta,
    });

    return NextResponse.json(
      { message: "Gagal mengambil data proyek", error: message },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    const clientName =
      typeof body?.clientName === "string"
        ? body.clientName
        : typeof body?.client_name === "string"
          ? body.client_name
          : "";
    const clientPhone =
      typeof body?.clientPhone === "string"
        ? body.clientPhone
        : typeof body?.client_phone === "string"
          ? body.client_phone
          : "";
    const projectName =
      typeof body?.projectName === "string"
        ? body.projectName
        : typeof body?.project_name === "string"
          ? body.project_name
          : "";
    const deadline =
      typeof body?.deadline === "string" || body?.deadline instanceof Date
        ? body.deadline
        : "";

    if (!clientName || !clientPhone || !projectName || !deadline) {
      return NextResponse.json(
        { message: "Semua field wajib diisi" },
        { status: 400 },
      );
    }

    const formattedPhone = normalizePhone(clientPhone);
    if (!isValidIndoWhatsApp(formattedPhone)) {
      return NextResponse.json(
        { message: "Format nomor WhatsApp tidak valid" },
        { status: 400 },
      );
    }

    const project = await prisma.project.create({
      data: {
        clientName,
        clientPhone: formattedPhone,
        projectName,
        deadline: new Date(deadline),
        status: "On Progress",
      },
    });

    const origin = request.headers.get("origin") || new URL(request.url).origin;
    const magicLink = `${origin}/track/${project.uniqueToken}`;
    const message =
      `Halo *${project.clientName}* !\n` +
      `Proyek Anda: *${project.projectName}*\n\n` +
      `Ini link tracking progress proyek Anda:\n${magicLink}\n\n` +
      `Simpan link ini agar mudah diakses kembali.`;

    const sendResult = await sendWhatsAppFonnte({
      to: project.clientPhone,
      message,
    });

    if (!sendResult.ok) {
      console.error("WhatsApp magic link send failed:", sendResult);
    }

    return NextResponse.json(
      {
        ...project,
        whatsapp: { sent: sendResult.ok },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create project error:", error);
    return NextResponse.json(
      { message: "Gagal membuat proyek baru" },
      { status: 500 },
    );
  }
}
