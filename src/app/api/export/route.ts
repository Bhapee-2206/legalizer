import { NextResponse } from "next/server";
import { jsPDF } from "jspdf";

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let content = "", title = "", format = "";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      content = body.content || "";
      title = body.title || "";
      format = body.format || "";
    } else if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      content = formData.get("content")?.toString() || "";
      title = formData.get("title")?.toString() || "";
      format = formData.get("format")?.toString() || "";
    } else {
      // Try JSON fallback
      try {
        const body = await req.json();
        content = body.content || "";
        title = body.title || "";
        format = body.format || "";
      } catch {
        return new Response("Unsupported content type", { status: 415 });
      }
    }

    if (!content || !format) {
      return new Response("Missing content or format", { status: 400 });
    }

    // Sanitize filename
    const baseName = (title || "legal_document")
      .replace(/\.[^/.]+$/, "")
      .replace(/[\\/:*?"<>|]/g, "")
      .trim()
      .replace(/\s+/g, "_") || "legal_document";

    if (format === "word") {
      const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>${baseName}</title>
  <style>
    body { font-family: 'Times New Roman', serif; padding: 60px; line-height: 1.8; font-size: 12pt; }
    p { margin-bottom: 12pt; }
  </style>
</head>
<body>`;
      const footer = `</body></html>`;
      const wordContent = header + content.replace(/\n/g, "<br>") + footer;
      const wordBytes = Buffer.from("\ufeff" + wordContent, "utf-8");

      return new Response(wordBytes, {
        status: 200,
        headers: {
          "Content-Type": "application/vnd.ms-word",
          "Content-Disposition": `attachment; filename="${baseName}.doc"`,
          "Content-Length": String(wordBytes.length),
          "Cache-Control": "no-cache",
        },
      });
    }

    if (format === "pdf") {
      // Server-side text PDF using jsPDF (no canvas needed)
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;
      const maxWidth = pageWidth - margin * 2;

      pdf.setFont("times", "normal");
      pdf.setFontSize(11);

      const lines = pdf.splitTextToSize(content, maxWidth);
      let y = margin;
      const lineHeight = 7;
      const pageHeight = pdf.internal.pageSize.getHeight();

      for (const line of lines) {
        if (y + lineHeight > pageHeight - margin) {
          pdf.addPage();
          y = margin;
        }
        pdf.text(line, margin, y);
        y += lineHeight;
      }

      const pdfBuffer = Buffer.from(pdf.output("arraybuffer"));

      return new Response(pdfBuffer, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${baseName}.pdf"`,
          "Content-Length": String(pdfBuffer.length),
          "Cache-Control": "no-cache",
        },
      });
    }

    return NextResponse.json({ error: "Invalid format. Use 'pdf' or 'word'." }, { status: 400 });
  } catch (error: any) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Export failed: " + error.message }, { status: 500 });
  }
}
