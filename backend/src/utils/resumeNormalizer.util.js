export function normalizeExperience(text) {
  if (!text) return "";

  let lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const normalized = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    const isDateLine =
      /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\s+\d{4}\s*[–—-]\s*(Present|(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\s+\d{4})/i.test(
        line,
      );

    if (isDateLine) {
      const dateRange = line;
      const jobTitleLine = lines[i + 1] || "";

      if (jobTitleLine) {
        normalized.push(`${jobTitleLine} ${dateRange}`);
        i += 2;
      } else {
        normalized.push(line);
        i++;
      }
    } else if (/^(Analyst|Developer|Engineer|Intern|Manager)/i.test(line)) {
      const nextLine = lines[i + 1] || "";
      const isNextDate =
        /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)/i.test(
          nextLine,
        );

      if (isNextDate) {
        normalized.push(`${line} ${nextLine}`);
        i += 2;
      } else {
        normalized.push(line);
        i++;
      }
    } else {
      normalized.push(line);
      i++;
    }
  }

  // Join and clean up
  return normalized
    .join("\n")
    .replace(/([^\n])\s*•/g, "$1\n•")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function normalizeSkills(text) {
  if (!text) return [];

  const rawText = Array.isArray(text) ? text.join("\n") : text;

  return (
    rawText
      .split(/\n|•/)
      .map((line) => line.trim())
      .filter(Boolean)
      .filter((line) => {
        if (
          /\b(developed|utilized|implemented|created|built|designed|managed|led)\b/i.test(
            line,
          )
        ) {
          return false;
        }
        if (line.length > 150) return false;

        return true;
      })
      // Clean up formatting
      .map((line) => {
        return line
          .replace(/\s*:\s*/g, ": ")
          .replace(/\s*,\s*/g, ", ")
          .replace(/^[-–—]\s*/, "");
      })
      .filter(
        (line, index, self) =>
          self.findIndex((l) => l.toLowerCase() === line.toLowerCase()) ===
          index,
      )
  );
}

export function normalizeCertification(text) {
  if (!text) return null;

  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && l !== "|" && l !== "•" && !/^link$/i.test(l));

  if (lines.length === 0) return null;

  let title = "";
  let duration = "";
  let descriptionParts = [];

  const durationRegex =
    /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\s+\d{4}\s*[-–—]\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\s+\d{4}\b/i;

  for (const line of lines) {
    const durationMatch = line.match(durationRegex);

    if (!title) {
      if (durationMatch) {
        title = line.substring(0, durationMatch.index).trim();
        duration = durationMatch[0];

        const afterDuration = line
          .substring(durationMatch.index + durationMatch[0].length)
          .trim();
        if (afterDuration && afterDuration !== "|") {
          descriptionParts.push(afterDuration);
        }
      } else {
        title = line;
      }
      continue;
    }

    if (durationMatch && !duration) {
      duration = durationMatch[0];

      const beforeDuration = line.substring(0, durationMatch.index).trim();
      const afterDuration = line
        .substring(durationMatch.index + durationMatch[0].length)
        .trim();

      if (beforeDuration && beforeDuration !== title) {
        descriptionParts.push(beforeDuration);
      }
      if (afterDuration && afterDuration !== "|") {
        descriptionParts.push(afterDuration);
      }
      continue;
    }

    if (line !== title && !line.match(durationRegex)) {
      descriptionParts.push(line);
    }
  }

  return {
    title: title || "Certification",
    duration: duration || "",
    description: descriptionParts.join(" ").trim(),
  };
}

export function normalizeOverview(text) {
  if (!text) return "";

  return text
    .replace(/^["']|["']$/g, "")
    .replace(/\n{2,}/g, "\n")
    .replace(/\s{2,}/g, " ")
    .trim();
}
