import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendWhatsAppFonnte } from "@/lib/whatsapp";
import { requireAdminSession } from "@/lib/api/admin";
import { supabase } from "@/lib/supabase";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdminSession();
    const { id: projectId } = await params;

    const contentType = request.headers.get("content-type") || "";
    let title, description, percentage, sendNotification;
    let visualDescription = "",
      phaseRaw = "",
      linksRaw = "[]",
      imageFiles: File[] = [];

    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      title = String(form.get("title") || "");
      description = String(form.get("description") || "");
      percentage = String(form.get("percentage") || "0");
      sendNotification = form.get("sendNotification") === "true";

      // Visual update fields
      visualDescription = String(form.get("visualDescription") || "");
      phaseRaw = String(form.get("phase") || "");
      linksRaw = String(form.get("links") || "[]");
      imageFiles = form
        .getAll("images")
        .filter((x): x is File => x instanceof File && x.size > 0);
    } else {
      const body = await request.json();
      title = body.title;
      description = body.description;
      percentage = body.percentage;
      sendNotification = body.sendNotification;
    }

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

    // Prepare links
    let links: { label: string; url: string }[] = [];
    try {
      const parsed = JSON.parse(linksRaw);
      if (Array.isArray(parsed)) {
        links = parsed
          .map((l: any) => ({
            label: String(l.label || "Link").trim(),
            url: String(l.url || "").trim(),
          }))
          .filter((l) => l.url && /^https?:\/\//i.test(l.url));
      }
    } catch {
      links = [];
    }

    // Combined Creation in Transaction
    const log = await (prisma.$transaction(async (tx) => {
      let progressUpdateId = null;

      if (
        visualDescription.trim() ||
        imageFiles.length > 0 ||
        links.length > 0
      ) {
        console.log("CREATE_LOG_INFO: Creating new ProgressUpdate.");

        // Upload images to Supabase first
        const uploadedImages = await Promise.all(
          imageFiles.map(async (f, index) => {
            const fileBuffer = await f.arrayBuffer();
            const fileName = `${projectId}/${Date.now()}-${f.name.replace(/\s+/g, "-")}`;

            const { error: uploadError } = await supabase.storage
              .from("project-assets")
              .upload(fileName, fileBuffer, {
                contentType: f.type,
                upsert: false,
              });

            if (uploadError) {
              console.error("Supabase upload error:", uploadError);
              throw new Error("Gagal mengupload gambar ke storage");
            }

            const {
              data: { publicUrl },
            } = supabase.storage.from("project-assets").getPublicUrl(fileName);

            return {
              fileName: f.name,
              mimeType: f.type,
              fileSize: f.size,
              fileUrl: publicUrl,
              sortOrder: index,
            };
          }),
        );

        const update = await tx.progressUpdate.create({
          data: {
            projectId,
            description: visualDescription.trim() || description.trim(),
            phase: phaseRaw ? (phaseRaw as any) : null,
            links: { create: links },
            images: {
              create: uploadedImages,
            },
          },
        });
        progressUpdateId = update.id;
        console.log(
          `CREATE_LOG_INFO: ProgressUpdate created with ID ${progressUpdateId}.`,
        );
      }

      const newLog = await (tx.projectLog as any).create({
        data: {
          projectId,
          title,
          description,
          percentage: percentageInt,
          progressUpdateId: progressUpdateId,
        },
        include: {
          progressUpdate: {
            include: {
              images: true,
              links: true,
            },
          },
        },
      });
      console.log(`CREATE_LOG_INFO: ProjectLog created with ID ${newLog.id}.`);

      await tx.project.update({
        where: { id: projectId },
        data: {
          updatedAt: new Date(),
          status: percentageInt === 100 ? "Done" : "On Progress",
        },
      });
      console.log(`CREATE_LOG_INFO: Project ${projectId} updated.`);

      return newLog;
    }) as any);

    if (sendNotification && project.clientPhone) {
      console.log(
        `CREATE_LOG_INFO: Sending WhatsApp notification to ${project.clientPhone}.`,
      );
      try {
        const origin =
          request.headers.get("origin") || new URL(request.url).origin;
        const magicLink = `${origin}/track/${project.uniqueToken}`;
        const message =
          `Halo, *${project.clientName}*! 👋\n\n` +
          `Ada update terbaru mengenai progres proyek Anda:\n` +
          `🔹 *${project.projectName}*\n\n` +
          `📌 **Update:** ${title}\n` +
          `📊 **Progress:** ${percentageInt}%\n\n` +
          `📝 **Keterangan:**\n` +
          `${visualDescription.trim() || description.trim() || "-"}\n\n` + // Use visual description if available
          `🔗 **Lihat Detail:**\n` +
          `${magicLink}\n\n` +
          `Terima kasih atas kepercayaan Anda.\n\n` +
          `Salam,\n` +
          `*PAM Techno Team*`;

        const sendResult = await sendWhatsAppFonnte({
          to: project.clientPhone,
          message,
        });
        if (!sendResult.ok) {
          console.error(
            "CREATE_LOG_WHATSAPP_ERROR: Fonnte API call failed.",
            sendResult,
          );
          if (process.env.NODE_ENV !== "production") {
            console.log("DEV_MODE: WhatsApp message would be:\n" + message);
          }
        } else {
          console.log(
            "CREATE_LOG_INFO: WhatsApp notification sent successfully.",
          );
        }
      } catch (e) {
        console.error("CREATE_LOG_WHATSAPP_ERROR_DETAIL:", e);
      }
    }

    return NextResponse.json(
      {
        id: log.id,
        title: log.title,
        description: log.description,
        percentage: log.percentage,
        createdAt: log.createdAt,
        progressUpdate: (log as any).progressUpdate
          ? {
              id: (log as any).progressUpdate.id,
              description: (log as any).progressUpdate.description,
              phase: (log as any).progressUpdate.phase,
              createdAt: (log as any).progressUpdate.createdAt,
              images: (log as any).progressUpdate.images.map((img: any) => ({
                id: img.id,
                url: img.fileUrl,
                fileName: img.fileName,
                mimeType: img.mimeType,
              })),
              links: (log as any).progressUpdate.links.map((l: any) => ({
                id: l.id,
                label: l.label,
                url: l.url,
              })),
            }
          : null,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("CREATE_LOG_ERROR_DETAIL:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdminSession();
    const { id: projectId } = await params;
    console.log(`GET_LOGS_INFO: Fetching logs for project ID ${projectId}.`);

    const logs: any[] = await prisma.projectLog.findMany({
      where: { projectId },
      include: {
        progressUpdate: {
          include: {
            images: { orderBy: { sortOrder: "asc" } },
            links: { orderBy: { createdAt: "asc" } },
          },
        },
      },
      orderBy: [{ createdAt: "desc" }],
    });

    const payload = logs.map((log: any) => ({
      id: log.id,
      projectId: log.projectId,
      title: log.title,
      description: log.description,
      percentage: log.percentage,
      createdAt: log.createdAt,
      progressUpdate: log.progressUpdate
        ? {
            id: log.progressUpdate.id,
            description: log.progressUpdate.description,
            phase: log.progressUpdate.phase,
            createdAt: log.progressUpdate.createdAt,
            images: log.progressUpdate.images.map((img: any) => ({
              id: img.id,
              url: img.fileUrl,
              fileName: img.fileName,
              mimeType: img.mimeType,
            })),
            links: log.progressUpdate.links.map((l: any) => ({
              id: l.id,
              label: l.label,
              url: l.url,
            })),
          }
        : null,
    }));

    return NextResponse.json(payload);
  } catch (error) {
    console.error("GET_LOGS_ERROR_DETAIL:", error);
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { message: "Failed to fetch logs" },
      { status: 500 },
    );
  }
}
