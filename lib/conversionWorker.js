import fs from "node:fs";
import path from "node:path";
import { promises as fsp } from "node:fs";

import archiver from "archiver";
import sharp from "sharp";
import { PDFDocument } from "pdf-lib";
import { renderPdfToPngs } from "./pdfRenderer.js";

function parsePageRange(pageRangeStr, totalPages) {
  const s = (pageRangeStr || "").trim().toLowerCase();
  if (s === "" || s === "all") {
    return Array.from({ length: totalPages }, (_, i) => i);
  }

  const indices = new Set();
  for (const part of s.split(",")) {
    const token = part.trim();
    if (token === "") {
      continue;
    }
    if (token.includes("-")) {
      const [startStr, endStr] = token.split("-").map((v) => v.trim());
      const start = Number(startStr);
      const end = Number(endStr);
      if (!Number.isInteger(start) || !Number.isInteger(end)) {
        throw new Error(`Invalid range: '${token}'`);
      }
      if (start < 1 || end > totalPages || start > end) {
        throw new Error(`Range '${token}' out of bounds (doc has ${totalPages} pages)`);
      }
      for (let i = start - 1; i < end; i += 1) {
        indices.add(i);
      }
    } else {
      const n = Number(token);
      if (!Number.isInteger(n)) {
        throw new Error(`Invalid page: '${token}'`);
      }
      if (n < 1 || n > totalPages) {
        throw new Error(`Page ${n} out of bounds (doc has ${totalPages} pages)`);
      }
      indices.add(n - 1);
    }
  }
  return Array.from(indices).sort((a, b) => a - b);
}

function ensureValidDpi(dpi) {
  if (![72, 150, 300].includes(dpi)) {
    throw new Error("DPI must be 72, 150, or 300.");
  }
}

function ensureValidFormat(fmt) {
  const v = String(fmt || "").toUpperCase();
  if (v !== "PNG" && v !== "JPEG") {
    throw new Error("Format must be PNG or JPEG.");
  }
  return v;
}


async function makeZip(tmpDir, zipName, fileNames) {
  const zipPath = path.join(tmpDir, zipName);
  await fsp.mkdir(path.dirname(zipPath), { recursive: true });

  const output = fs.createWriteStream(zipPath);
  const archive = archiver("zip", { zlib: { level: 5 } });

  return new Promise((resolve, reject) => {
    output.on("close", () => resolve(zipPath));
    archive.on("error", reject);

    archive.pipe(output);
    for (const name of fileNames) {
      const filePath = path.join(tmpDir, name);
      archive.file(filePath, { name });
    }
    archive.finalize();
  });
}

async function cmd_convert(payload) {
  const inputPath = payload.input_path;
  const tmpDir = payload.tmp_dir;
  const fmt = ensureValidFormat(payload.format || "PNG");
  const dpi = Number(payload.dpi ?? 150);
  ensureValidDpi(dpi);
  const pagesStr = String(payload.pages ?? "all");

  const pdfBytes = await fsp.readFile(inputPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const totalPages = pdfDoc.getPageCount();
  const pages = parsePageRange(pagesStr, totalPages);
  if (!pages.length) {
    throw new Error("No pages selected.");
  }

  // Render pages to PNG using a separate Node.js process (avoids bundling issues with pdfjs-dist).
  const pngNames = await renderPdfToPngs({
    inputPath,
    tmpDir,
    pages,
    dpi,
  });

  const imageNames = [];

  for (const pngName of pngNames) {
    const pngPath = path.join(tmpDir, pngName);
    const outName = fmt === "JPEG" ? pngName.replace(/\.png$/, ".jpg") : pngName;
    const outPath = path.join(tmpDir, outName);

    if (fmt === "JPEG") {
      await sharp(pngPath).jpeg({ quality: 92 }).toFile(outPath);
      await fsp.unlink(pngPath).catch(() => {});
    } else {
      // For PNG, the renderer already produces a PNG file.
      // Keep the rendered file as-is.
      // If needed, we could re-encode via sharp for compression.
      if (outPath !== pngPath) {
        await fsp.rename(pngPath, outPath);
      }
    }

    imageNames.push(outName);
  }

  const zipName = "converted_images.zip";
  await makeZip(tmpDir, zipName, imageNames);

  return {
    count: pages.length,
    total_pages: totalPages,
    image_names: imageNames,
    zip_name: zipName,
  };
}

function ensurePageSize(name) {
  const sizes = {
    A4: [595.28, 841.89],
    LETTER: [612, 792],
    A3: [841.89, 1190.55],
  };
  const normalized = String(name || "").toUpperCase();
  if (!sizes[normalized]) {
    throw new Error("Page size must be A4, Letter, or A3.");
  }
  return sizes[normalized];
}

function ensureOrientation(value) {
  const normalized = String(value || "").toLowerCase();
  if (normalized !== "portrait" && normalized !== "landscape") {
    throw new Error("Orientation must be portrait or landscape.");
  }
  return normalized;
}

async function cmd_img2pdf(payload) {
  const imagePaths = Array.isArray(payload.image_paths) ? payload.image_paths : [];
  const pageSize = [...ensurePageSize(payload.page_size || "A4")];
  const orientation = ensureOrientation(payload.orientation || "portrait");
  const tmpDir = payload.tmp_dir;

  if (orientation === "landscape") {
    pageSize.reverse();
  }

  const validInputs = [];
  for (const p of imagePaths) {
    const ext = path.extname(p).toLowerCase();
    // sharp supports many formats, but we only accept a common set
    if (![".png", ".jpg", ".jpeg", ".webp", ".tiff", ".gif", ".bmp"].includes(ext)) {
      continue;
    }
    validInputs.push(p);
  }

  if (!validInputs.length) {
    throw new Error("No valid image files found.");
  }

  const pdfDoc = await PDFDocument.create();
  for (const inputPath of validInputs) {
    const inputData = await fsp.readFile(inputPath);
    const ext = path.extname(inputPath).toLowerCase();
    const isJpg = ext === ".jpg" || ext === ".jpeg";

    const image = isJpg
      ? await pdfDoc.embedJpg(inputData)
      : await pdfDoc.embedPng(inputData);

    const { width: iw, height: ih } = image.scale(1);
    const [w, h] = pageSize;

    const scale = Math.min(w / iw, h / ih, 1);
    const drawWidth = iw * scale;
    const drawHeight = ih * scale;
    const x = (w - drawWidth) / 2;
    const y = (h - drawHeight) / 2;

    const page = pdfDoc.addPage([w, h]);
    page.drawImage(image, {
      x,
      y,
      width: drawWidth,
      height: drawHeight,
    });
  }

  const pdfBytes = await pdfDoc.save();
  const firstNameBase = path.basename(validInputs[0], path.extname(validInputs[0]));
  const pdfName = `converted-${firstNameBase}.pdf`;
  const outPath = path.join(tmpDir, pdfName);
  await fsp.writeFile(outPath, pdfBytes);

  return {
    pdf_name: pdfName,
    pages: validInputs.length,
  };
}

async function attemptCompressPdf({ inputPath, tmpDir, profile }) {
  const sourceBytes = await fsp.readFile(inputPath);
  const sourceDoc = await PDFDocument.load(sourceBytes);
  const pageCount = sourceDoc.getPageCount();

  // Render PDF pages to PNG using pdfjs-dist
  const pngFiles = await renderPdfToPngs({
    inputPath,
    tmpDir,
    pages: Array.from({ length: pageCount }, (_, i) => i),
    dpi: profile.dpi,
  });

  const resultDoc = await PDFDocument.create();
  for (let i = 0; i < pageCount; i += 1) {
    const srcPage = sourceDoc.getPage(i);
    const { width, height } = srcPage.getSize();

    // Convert PNG to JPEG for better compression
    const pngPath = path.join(tmpDir, pngFiles[i]);
    const buffer = await sharp(pngPath)
      .jpeg({ quality: profile.jpg_quality })
      .toBuffer();

    const embedded = await resultDoc.embedJpg(buffer);
    const page = resultDoc.addPage([width, height]);
    page.drawImage(embedded, {
      x: 0,
      y: 0,
      width,
      height,
    });
  }

  const outName = `candidate-${profile.name}.pdf`;
  const outPath = path.join(tmpDir, outName);
  await fsp.writeFile(outPath, await resultDoc.save());

  const size = (await fsp.stat(outPath)).size;
  return { path: outPath, size };
}

async function cmd_compress_pdf(payload) {
  const inputPath = payload.input_path;
  const tmpDir = payload.tmp_dir;
  const targetPercent = Number(payload.target_percent ?? 30);
  const forceCompression = Boolean(payload.force_compression);
  const originalFilename = String(payload.original_filename || "document.pdf");

  if (targetPercent < 1 || targetPercent > 90) {
    throw new Error("Target percent must be between 1 and 90.");
  }

  const originalSize = (await fsp.stat(inputPath)).size;

  const profiles = [
    { name: "light", dpi: 150, jpg_quality: 85 },
    { name: "balanced", dpi: 120, jpg_quality: 72 },
    { name: "aggressive", dpi: 96, jpg_quality: 62 },
  ];

  let bestAttempt = null;
  let selectedAttempt = null;

  for (const profile of profiles) {
    const attempt = await attemptCompressPdf({ inputPath, tmpDir, profile });
    const reduction = originalSize > 0 ? (1 - attempt.size / originalSize) * 100 : 0;

    const record = {
      ...attempt,
      reduction,
      profile: profile.name,
    };

    if (!bestAttempt || record.reduction > bestAttempt.reduction) {
      bestAttempt = record;
    }
    if (!selectedAttempt && record.reduction >= targetPercent) {
      selectedAttempt = record;
    }
  }

  if (!selectedAttempt) {
    selectedAttempt = bestAttempt;
  }

  let forcedUsed = false;
  if (forceCompression && selectedAttempt.reduction < targetPercent) {
    const forcePlans = [
      { name: "force-96dpi-q55", dpi: 96, jpg_quality: 55 },
      { name: "force-84dpi-q45", dpi: 84, jpg_quality: 45 },
      { name: "force-72dpi-q38", dpi: 72, jpg_quality: 38 },
      { name: "force-60dpi-q30", dpi: 60, jpg_quality: 30 },
    ];

    let forceBest = null;
    let forceSelected = null;

    for (const plan of forcePlans) {
      const attempt = await attemptCompressPdf({ inputPath, tmpDir, profile: plan });
      const reduction = originalSize > 0 ? (1 - attempt.size / originalSize) * 100 : 0;
      const record = { ...attempt, reduction, profile: plan.name };

      if (!forceBest || record.reduction > forceBest.reduction) {
        forceBest = record;
      }
      if (!forceSelected && record.reduction >= targetPercent) {
        forceSelected = record;
      }
    }

    const chosenForceAttempt = forceSelected || forceBest;
    if (chosenForceAttempt && chosenForceAttempt.reduction > selectedAttempt.reduction) {
      selectedAttempt = chosenForceAttempt;
      forcedUsed = true;
    }
  }

  const base = path.basename(originalFilename, path.extname(originalFilename)) || "document";
  const outName = `compressed-${base}.pdf`;
  const outPath = path.join(tmpDir, outName);
  await fsp.copyFile(selectedAttempt.path, outPath);

  return {
    pdf_name: outName,
    original_bytes: originalSize,
    compressed_bytes: selectedAttempt.size,
    reduction_percent: Math.round(selectedAttempt.reduction * 100) / 100,
    target_percent: Math.round(targetPercent * 100) / 100,
    achieved_target: selectedAttempt.reduction >= targetPercent,
    profile: selectedAttempt.profile,
    force_requested: forceCompression,
    forced_used: forcedUsed,
  };
}

async function cmd_compress_image(payload) {
  const inputPath = payload.input_path;
  const tmpDir = payload.tmp_dir;
  const targetPercent = Number(payload.target_percent ?? 30);
  const forceCompression = Boolean(payload.force_compression);
  const originalFilename = String(payload.original_filename || "image");

  if (targetPercent < 1 || targetPercent > 90) {
    throw new Error("Target percent must be between 1 and 90.");
  }

  const originalSize = (await fsp.stat(inputPath)).size;

  const metadata = await sharp(inputPath).metadata();
  const hasAlpha = Boolean(metadata.hasAlpha);

  const profiles = [
    { name: "light", quality: 88, scale: 1.0, png_colors: null },
    { name: "balanced", quality: 76, scale: 1.0, png_colors: 192 },
    { name: "aggressive", quality: 64, scale: 0.92, png_colors: 128 },
  ];

  async function compressProfile(profile) {
    const candidatePath = path.join(tmpDir, `img_candidate_${profile.name}`);

    let image = sharp(inputPath);
    if (profile.scale < 1) {
      image = image.resize({
        width: Math.max(1, Math.round((metadata.width || 0) * profile.scale)),
        height: Math.max(1, Math.round((metadata.height || 0) * profile.scale)),
      });
    }

    let outPath;
    if (hasAlpha) {
      image = image.ensureAlpha();
      if (profile.png_colors) {
        image = image.png({ palette: true, colors: profile.png_colors, compressionLevel: 9 });
      } else {
        image = image.png({ compressionLevel: 9 });
      }
      outPath = `${candidatePath}.png`;
      await image.toFile(outPath);
    } else {
      image = image.jpeg({ quality: profile.quality, progressive: true, mozjpeg: true });
      outPath = `${candidatePath}.jpg`;
      await image.toFile(outPath);
    }

    const size = (await fsp.stat(outPath)).size;
    const reduction = originalSize > 0 ? (1 - size / originalSize) * 100 : 0;
    return { path: outPath, size, reduction, profile: profile.name };
  }

  let bestAttempt = null;
  let selectedAttempt = null;

  for (const profile of profiles) {
    const attempt = await compressProfile(profile);
    if (!bestAttempt || attempt.reduction > bestAttempt.reduction) {
      bestAttempt = attempt;
    }
    if (!selectedAttempt && attempt.reduction >= targetPercent) {
      selectedAttempt = attempt;
    }
  }

  if (!selectedAttempt) {
    selectedAttempt = bestAttempt;
  }

  let forcedUsed = false;
  if (forceCompression && selectedAttempt.reduction < targetPercent) {
    const forcePlans = [
      { name: "force-75", quality: 75, scale: 0.9, png_colors: 96 },
      { name: "force-60", quality: 60, scale: 0.82, png_colors: 64 },
      { name: "force-45", quality: 45, scale: 0.72, png_colors: 48 },
      { name: "force-35", quality: 35, scale: 0.62, png_colors: 32 },
    ];

    let forceBest = null;
    let forceSelected = null;

    for (const plan of forcePlans) {
      const attempt = await compressProfile(plan);
      if (!forceBest || attempt.reduction > forceBest.reduction) {
        forceBest = attempt;
      }
      if (!forceSelected && attempt.reduction >= targetPercent) {
        forceSelected = attempt;
      }
    }

    const chosenForceAttempt = forceSelected || forceBest;
    if (chosenForceAttempt && chosenForceAttempt.reduction > selectedAttempt.reduction) {
      selectedAttempt = chosenForceAttempt;
      forcedUsed = true;
    }
  }

  const base = path.basename(originalFilename, path.extname(originalFilename)) || "image";
  const outName = `compressed-${base}${path.extname(selectedAttempt.path)}`;
  const outPath = path.join(tmpDir, outName);
  await fsp.copyFile(selectedAttempt.path, outPath);

  return {
    image_name: outName,
    original_bytes: originalSize,
    compressed_bytes: selectedAttempt.size,
    reduction_percent: Math.round(selectedAttempt.reduction * 100) / 100,
    target_percent: Math.round(targetPercent * 100) / 100,
    achieved_target: selectedAttempt.reduction >= targetPercent,
    force_requested: forceCompression,
    forced_used: forcedUsed,
  };
}

async function cmd_convert_image_format(payload) {
  const inputPath = payload.input_path;
  const tmpDir = payload.tmp_dir;
  const originalFilename = String(payload.original_filename || "image");
  const targetFormat = String(payload.target_format || "JPEG").toUpperCase();
  const jpegQuality = Math.max(30, Math.min(95, Number(payload.jpeg_quality) || 92));

  const normalized = targetFormat === "JPG" ? "JPEG" : targetFormat;
  if (normalized !== "PNG" && normalized !== "JPEG") {
    throw new Error("Target format must be PNG or JPEG.");
  }

  const sourceExt = path.extname(inputPath).toLowerCase();
  if (![".png", ".jpg", ".jpeg"].includes(sourceExt)) {
    throw new Error("Only PNG and JPEG files are supported for format conversion.");
  }

  const sourceFormat = sourceExt === ".png" ? "PNG" : "JPEG";
  if (sourceFormat === normalized) {
    throw new Error("Source and target formats must be different.");
  }

  const originalSize = (await fsp.stat(inputPath)).size;
  const base = path.basename(originalFilename, path.extname(originalFilename)) || "image";
  const outExt = normalized === "JPEG" ? ".jpg" : ".png";
  const outName = `converted-${base}${outExt}`;
  const outPath = path.join(tmpDir, outName);

  const image = sharp(inputPath);
  if (normalized === "JPEG") {
    const metadata = await image.metadata();
    let outImage = image;
    if (metadata.hasAlpha) {
      outImage = image.flatten({ background: { r: 255, g: 255, b: 255 } });
    }
    await outImage.jpeg({ quality: jpegQuality, progressive: true, mozjpeg: true }).toFile(outPath);
  } else {
    const metadata = await image.metadata();
    const outImage = metadata.hasAlpha ? image : image;
    await outImage.png({ compressionLevel: 9 }).toFile(outPath);
  }

  const convertedSize = (await fsp.stat(outPath)).size;
  return {
    image_name: outName,
    source_format: sourceFormat,
    target_format: normalized,
    original_bytes: originalSize,
    converted_bytes: convertedSize,
  };
}

async function cmd_modify_pdf(payload) {
  const operation = String(payload.operation || "").trim().toLowerCase();
  if (operation !== "merge" && operation !== "visual_edit") {
    throw new Error("Invalid PDF edit operation.");
  }

  const tmpDir = payload.tmp_dir;

  if (operation === "merge") {
    const inputPaths = Array.isArray(payload.input_paths) ? payload.input_paths : [];
    if (inputPaths.length < 2) {
      throw new Error("Merge requires at least two PDF files.");
    }

    const mergedDoc = await PDFDocument.create();
    let mergedPages = 0;

    for (const p of inputPaths) {
      const bytes = await fsp.readFile(p);
      const doc = await PDFDocument.load(bytes);
      const pages = await mergedDoc.copyPages(doc, doc.getPageIndices());
      pages.forEach((page) => mergedDoc.addPage(page));
      mergedPages += doc.getPageCount();
    }

    const outName = "merged-document.pdf";
    const outPath = path.join(tmpDir, outName);
    await fsp.writeFile(outPath, await mergedDoc.save());

    return {
      filename: outName,
      page_count: mergedPages,
      output_count: 1,
      summary: `Merged ${inputPaths.length} PDFs into one file.`,
    };
  }

  const inputPath = payload.input_path;
  if (!inputPath) {
    throw new Error("This operation requires exactly one PDF file.");
  }

  const sourceBytes = await fsp.readFile(inputPath);
  const sourceDoc = await PDFDocument.load(sourceBytes);
  const totalPages = sourceDoc.getPageCount();
  const baseName = path.basename(inputPath, path.extname(inputPath)) || "document";

  const slots = Array.isArray(payload.slots) ? payload.slots : [];
  if (!slots.length) {
    throw new Error("Edit must include at least one page slot.");
  }

  const editedDoc = await PDFDocument.create();
  for (const slot of slots) {
    if (!slot || typeof slot !== "object") {
      throw new Error("Each slot must be an object.");
    }
    const pageNumber = Number(slot.page || 0);
    const rotation = Number(slot.rotation || 0);

    if (!Number.isInteger(pageNumber) || pageNumber < 1 || pageNumber > totalPages) {
      throw new Error(`Page ${pageNumber} out of bounds (doc has ${totalPages} pages)`);
    }

    if (![0, 90, 180, 270].includes(rotation)) {
      throw new Error("Rotation must be one of 0, 90, 180, or 270.");
    }

    const [copied] = await editedDoc.copyPages(sourceDoc, [pageNumber - 1]);
    copied.setRotation(rotation);
    editedDoc.addPage(copied);
  }

  const outName = `edited-${baseName}.pdf`;
  const outPath = path.join(tmpDir, outName);
  await fsp.writeFile(outPath, await editedDoc.save());

  return {
    filename: outName,
    page_count: slots.length,
    output_count: 1,
    summary: `Applied page edits to ${slots.length} slot(s).`,
  };
}

const COMMANDS = {
  convert: cmd_convert,
  img2pdf: cmd_img2pdf,
  compress_pdf: cmd_compress_pdf,
  compress_image: cmd_compress_image,
  convert_image_format: cmd_convert_image_format,
  modify_pdf: cmd_modify_pdf,
};

export async function runConversionWorker(command, payload) {
  const fn = COMMANDS[command];
  if (!fn) {
    throw new Error(`Unknown command: ${command}`);
  }
  return fn(payload);
}
