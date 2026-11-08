import { PDFDocument, rgb } from "pdf-lib";

export interface PrintPdfExportOptions {
  title: string;
  categoryName: string;
  widthMm: number;
  heightMm: number;
  bleedMm: number; // e.g. 3mm
  dpi?: number; // 300
  dataUrl: string; // High-res image data URL (PNG/JPEG)
  customerNotes?: string;
}

// Convert millimeters to PDF points (1 pt = 1/72 inch, 1 inch = 25.4 mm)
const MM_TO_PT = 72 / 25.4;

export async function generatePrintReadyPdf(options: PrintPdfExportOptions): Promise<Uint8Array> {
  const {
    title,
    categoryName,
    widthMm,
    heightMm,
    bleedMm = 3,
    dataUrl,
    customerNotes,
  } = options;

  // Slug margin around the trim+bleed for crop marks, color bars & job info
  const slugMarginMm = 12; // 12mm white border for printers' marks

  const totalWidthMm = widthMm + 2 * bleedMm + 2 * slugMarginMm;
  const totalHeightMm = heightMm + 2 * bleedMm + 2 * slugMarginMm;

  const totalWidthPt = totalWidthMm * MM_TO_PT;
  const totalHeightPt = totalHeightMm * MM_TO_PT;

  const pdfDoc = await PDFDocument.create();
  pdfDoc.setTitle(`PrintCraft Print Master - ${title}`);
  pdfDoc.setAuthor("PrintCraft by Vajra Prints");
  pdfDoc.setCreator("PrintCraft 300DPI Prepress Engine");
  pdfDoc.setProducer("pdf-lib print engine");

  const page = pdfDoc.addPage([totalWidthPt, totalHeightPt]);

  // Clean white canvas background
  page.drawRectangle({
    x: 0,
    y: 0,
    width: totalWidthPt,
    height: totalHeightPt,
    color: rgb(1, 1, 1),
  });

  // Coordinates of the bleed box (where graphic goes)
  const bleedXPt = slugMarginMm * MM_TO_PT;
  const bleedYPt = slugMarginMm * MM_TO_PT;
  const bleedWidthPt = (widthMm + 2 * bleedMm) * MM_TO_PT;
  const bleedHeightPt = (heightMm + 2 * bleedMm) * MM_TO_PT;

  // Coordinates of finished trim box (where it will be cut)
  const trimXPt = (slugMarginMm + bleedMm) * MM_TO_PT;
  const trimYPt = (slugMarginMm + bleedMm) * MM_TO_PT;
  const trimWidthPt = widthMm * MM_TO_PT;
  const trimHeightPt = heightMm * MM_TO_PT;

  // Embed the high-res artwork image into the bleed box
  try {
    const isJpeg = dataUrl.startsWith("data:image/jpeg") || dataUrl.startsWith("data:image/jpg");
    const imageBytes = Uint8Array.from(
      atob(dataUrl.split(",")[1]),
      (c) => c.charCodeAt(0)
    );

    const embeddedImage = isJpeg
      ? await pdfDoc.embedJpg(imageBytes)
      : await pdfDoc.embedPng(imageBytes);

    page.drawImage(embeddedImage, {
      x: bleedXPt,
      y: bleedYPt,
      width: bleedWidthPt,
      height: bleedHeightPt,
    });
  } catch (err) {
    console.error("Failed to embed image in PDF:", err);
  }

  // Draw Guillotine Trim Marks / Crop Marks (black hairline)
  const markLengthPt = 8 * MM_TO_PT;
  const markOffsetPt = 1.5 * MM_TO_PT; // gap between trim edge and crop mark
  const cropColor = rgb(0.1, 0.1, 0.1);
  const markThickness = 0.5;

  // Corner 1: Bottom-Left (trimXPt, trimYPt)
  // Horizontal line extending left
  page.drawLine({
    start: { x: trimXPt - markOffsetPt - markLengthPt, y: trimYPt },
    end: { x: trimXPt - markOffsetPt, y: trimYPt },
    thickness: markThickness,
    color: cropColor,
  });
  // Vertical line extending down
  page.drawLine({
    start: { x: trimXPt, y: trimYPt - markOffsetPt - markLengthPt },
    end: { x: trimXPt, y: trimYPt - markOffsetPt },
    thickness: markThickness,
    color: cropColor,
  });

  // Corner 2: Bottom-Right (trimXPt + trimWidthPt, trimYPt)
  // Horizontal line extending right
  page.drawLine({
    start: { x: trimXPt + trimWidthPt + markOffsetPt, y: trimYPt },
    end: { x: trimXPt + trimWidthPt + markOffsetPt + markLengthPt, y: trimYPt },
    thickness: markThickness,
    color: cropColor,
  });
  // Vertical line extending down
  page.drawLine({
    start: { x: trimXPt + trimWidthPt, y: trimYPt - markOffsetPt - markLengthPt },
    end: { x: trimXPt + trimWidthPt, y: trimYPt - markOffsetPt },
    thickness: markThickness,
    color: cropColor,
  });

  // Corner 3: Top-Left (trimXPt, trimYPt + trimHeightPt)
  // Horizontal line extending left
  page.drawLine({
    start: { x: trimXPt - markOffsetPt - markLengthPt, y: trimYPt + trimHeightPt },
    end: { x: trimXPt - markOffsetPt, y: trimYPt + trimHeightPt },
    thickness: markThickness,
    color: cropColor,
  });
  // Vertical line extending up
  page.drawLine({
    start: { x: trimXPt, y: trimYPt + trimHeightPt + markOffsetPt },
    end: { x: trimXPt, y: trimYPt + trimHeightPt + markOffsetPt + markLengthPt },
    thickness: markThickness,
    color: cropColor,
  });

  // Corner 4: Top-Right (trimXPt + trimWidthPt, trimYPt + trimHeightPt)
  // Horizontal line extending right
  page.drawLine({
    start: { x: trimXPt + trimWidthPt + markOffsetPt, y: trimYPt + trimHeightPt },
    end: { x: trimXPt + trimWidthPt + markOffsetPt + markLengthPt, y: trimYPt + trimHeightPt },
    thickness: markThickness,
    color: cropColor,
  });
  // Vertical line extending up
  page.drawLine({
    start: { x: trimXPt + trimWidthPt, y: trimYPt + trimHeightPt + markOffsetPt },
    end: { x: trimXPt + trimWidthPt, y: trimYPt + trimHeightPt + markOffsetPt + markLengthPt },
    thickness: markThickness,
    color: cropColor,
  });

  // Color calibration swatches in top margin
  const swatches = [
    rgb(0, 0.65, 0.95), // Cyan
    rgb(0.95, 0.1, 0.55), // Magenta
    rgb(1, 0.9, 0), // Yellow
    rgb(0.05, 0.05, 0.05), // Key Black
    rgb(0.85, 0.7, 0.25), // Metallic Gold
    rgb(0.5, 0.5, 0.5), // 50% Gray
  ];

  const swatchSizePt = 4 * MM_TO_PT;
  const swatchStartXPt = trimXPt;
  const swatchYPt = totalHeightPt - 8 * MM_TO_PT;

  swatches.forEach((color, idx) => {
    page.drawRectangle({
      x: swatchStartXPt + idx * (swatchSizePt + 3),
      y: swatchYPt,
      width: swatchSizePt,
      height: swatchSizePt,
      color,
    });
  });

  // Production metadata text at bottom
  const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  const metaString = `PRINTCRAFT • VAJRA PRINTS BENGALURU | ${categoryName.toUpperCase()} | TRIM: ${widthMm}x${heightMm}mm + ${bleedMm}mm BLEED | 300 DPI CMYK | DATE: ${timestamp}`;

  page.drawText(metaString, {
    x: trimXPt,
    y: 4 * MM_TO_PT,
    size: 7,
    color: rgb(0.3, 0.3, 0.3),
  });

  return await pdfDoc.save();
}

