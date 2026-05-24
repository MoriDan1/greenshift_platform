import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data", "report.pdf");
    const buffer = await fs.promises.readFile(filePath);
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="bilancio-sostenibilita.pdf"`,
      },
    });
  } catch (err) {
    return new NextResponse("File non trovato", { status: 404 });
  }
}
