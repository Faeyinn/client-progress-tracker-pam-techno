import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json(
        { message: "Nomor WhatsApp wajib diisi" },
        { status: 400 },
      );
    }

    let searchPhone = phone.toString().replace(/\D/g, "");

    if (searchPhone.startsWith("0")) {
      searchPhone = "62" + searchPhone.substring(1);
    }

    const projects = await prisma.project.findMany({
      where: {
        clientPhone: searchPhone,
      },
      orderBy: { createdAt: "desc" },
    });

    if (projects.length === 0) {
      return NextResponse.json(
        { message: "Nomor WhatsApp tidak terdaftar dalam sistem kami." },
        { status: 404 },
      );
    }

    // TODO: Implement Fonnte API or other WhatsApp Gateway here
    // For now, we mock the success response.
    // In a real app, you would generate a message with the token(s) and send it.

    // const message = `Halo ${projects[0].clientName}, berikut adalah token proyek Anda:\n` +
    //   projects.map(p => `- ${p.projectName}: ${process.env.NEXT_PUBLIC_APP_URL}/track/${p.uniqueToken}`).join('\n');
    // await sendWhatsApp(searchPhone, message);

    console.log(
      `[Validation Mock] Recovery requested for ${searchPhone}. Found ${projects.length} projects.`,
    );

    return NextResponse.json({
      success: true,
      message: "Link akses telah dikirim ke WhatsApp Anda",
    });
  } catch (error) {
    console.error("Recovery error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
