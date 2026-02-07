function extractSection(text, startLabel, endLabels = []) {
  if (!text) return "";

  const normalizedText = text
    .replace(/\u00A0/g, " ")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\r\n/g, "\n");

  const startRegex = new RegExp(`\\b${startLabel}\\b`, "i");
  const match = startRegex.exec(normalizedText);

  if (!match) {
    console.warn(`❌ Section "${startLabel}" not found`);
    return "";
  }

  // console.log(`✅ Found "${startLabel}" at position ${match.index}`);

  let startIndex = match.index + match[0].length;

  const nextNewline = normalizedText.indexOf("\n", startIndex);
  if (nextNewline !== -1 && nextNewline - startIndex < 10) {
    startIndex = nextNewline + 1;
  }

  let endIndex = normalizedText.length;

  endLabels.forEach((label) => {
    const endRegex = new RegExp(`\\b${label}\\b`, "i");
    const endMatch = endRegex.exec(normalizedText.slice(startIndex));

    if (endMatch) {
      const absoluteIndex = startIndex + endMatch.index;
      if (absoluteIndex < endIndex) {
        endIndex = absoluteIndex;
        // console.log(`   Ending at "${label}" (position ${absoluteIndex})`);
      }
    }
  });

  const extracted = normalizedText.slice(startIndex, endIndex);

  return extracted
    .replace(/\f/g, "")
    .replace(/[\u0000-\u001F]/g, (char) => (char === "\n" ? char : "")) // Keep only newlines
    .replace(/\bLink\b/gi, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function extractExperience(text) {
  return extractSection(text, "Experience", [
    "Projects",
    "Education",
    "Skills",
    "Certifications",
  ]);
}

export function extractEducation(text) {
  return extractSection(text, "Education", [
    "Skills",
    "Certifications",
    "Projects",
    "Experience",
  ]);
}

export function extractSkills(text) {
  return extractSection(text, "Skills", [
    "Education",
    "Certifications",
    "Projects",
    "Experience",
  ]);
}

export function extractCertifications(text) {
  return extractSection(text, "Certifications", [
    "Education",
    "Skills",
    "Projects",
    "Experience",
  ]);
}

export function extractProjects(text) {
  return extractSection(text, "Projects", [
    "Education",
    "Skills",
    "Certifications",
    "Experience",
  ]);
}
