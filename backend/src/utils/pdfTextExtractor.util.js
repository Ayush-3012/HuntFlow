import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

export const extractTextFromPdfBuffer = async (buffer) => {
  const uint8Array = new Uint8Array(buffer);
  const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;

  let fullText = "";

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const viewport = page.getViewport({ scale: 1.0 });

    // Group items by line (Y coordinate)
    const lines = new Map();

    content.items.forEach((item) => {
      // Round Y coordinate to group items on same line
      const y = Math.round(item.transform[5]);

      if (!lines.has(y)) {
        lines.set(y, []);
      }

      lines.get(y).push({
        text: item.str,
        x: item.transform[4], // X coordinate for sorting
      });
    });

    // Sort lines by Y (top to bottom)
    const sortedLines = Array.from(lines.entries()).sort((a, b) => b[0] - a[0]); // Descending Y (top first)

    // Build text line by line
    sortedLines.forEach(([y, items]) => {
      // Sort items within line by X (left to right)
      items.sort((a, b) => a.x - b.x);

      // Join items with space
      const lineText = items.map((item) => item.text).join(" ");

      fullText += lineText.trim() + "\n";
    });

    fullText += "\n"; // Page separator
  }

  // Post-process
  return postProcessExtractedText(fullText);
};

function postProcessExtractedText(text) {
  return (
    text
      // Remove excessive spaces
      .replace(/ {2,}/g, " ")

      // Normalize section headers to have newlines before them
      .replace(
        /\s+(Overview|Experience|Projects|Education|Skills|Certifications)\s+/g,
        "\n\n$1\n",
      )

      // Fix bullet points - ensure they're on new lines
      .replace(/\s+•\s+/g, "\n• ")

      // Remove excessive newlines
      .replace(/\n{3,}/g, "\n\n")

      // Trim
      .trim()
  );
}
