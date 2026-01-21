import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    const resolvedParams = await params;
    const { token } = resolvedParams;

    const project = await prisma.project.findUnique({
      where: { uniqueToken: token },
      include: {
        logs: {
          orderBy: [{ createdAt: "desc" }, { percentage: "desc" }],
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      project: {
        id: project.id,
        clientName: project.clientName,
        clientPhone: project.clientPhone,
        projectName: project.projectName,
        deadline: project.deadline,
        status: project.status,
        uniqueToken: project.uniqueToken,
        createdAt: project.createdAt,
      },
      logs: project.logs.map((log) => ({
        id: log.id,
        title: log.title,
        description: log.description,
        percentage: log.percentage,
        createdAt: log.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching project by token:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
