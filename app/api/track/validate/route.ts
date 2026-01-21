import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { message: "Token wajib diisi" },
        { status: 400 },
      );
    }

    const project = await prisma.project.findUnique({
      where: { uniqueToken: token },
    });

    if (project) {
      return NextResponse.json({ valid: true, projectId: project.id });
    } else {
      return NextResponse.json(
        { message: "Token tidak valid" },
        { status: 404 },
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
