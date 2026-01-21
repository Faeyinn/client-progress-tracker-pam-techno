import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        logs: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 },
      );
    }

    const latestLog = project.logs[0];
    if (
      latestLog &&
      latestLog.percentage === 100 &&
      project.status !== "Done"
    ) {
      await prisma.project.update({
        where: { id: project.id },
        data: { status: "Done" },
      });
      project.status = "Done";
    }

    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const body = await request.json();

    const { clientName, clientPhone, projectName, deadline, status } = body;

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        clientName,
        clientPhone,
        projectName,
        deadline: deadline ? new Date(deadline) : undefined,
        status,
      },
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update project" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete project" },
      { status: 500 },
    );
  }
}
