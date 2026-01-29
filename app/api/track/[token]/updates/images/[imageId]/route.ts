import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string; imageId: string }> },
) {
  try {
    const { token, imageId } = await params;

    const project = await prisma.project.findUnique({
      where: { uniqueToken: token },
      select: { id: true },
    });

    if (!project) {
      return new Response("Not found", { status: 404 });
    }

    const image = await prisma.progressUpdateImage.findFirst({
      where: {
        id: imageId,
        progressUpdate: { projectId: project.id },
      },
      select: { fileData: true, mimeType: true, fileName: true },
    });

    if (!image) {
      return new Response("Not found", { status: 404 });
    }

    return new Response(image.fileData, {
      headers: {
        "Content-Type": image.mimeType || "image/*",
        "Content-Disposition": `inline; filename=\"${image.fileName || "image"}\"`,
        "Cache-Control": "private, max-age=0, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Track update image error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
