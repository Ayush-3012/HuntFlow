import PDFDocument from "pdfkit";

export function generateResumePdf({
  user,
  overview,
  experienceText,
  projects,
  educationText,
  skillsText,
  certificationsText,
}) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margin: 50,
        bufferPages: true,
      });
      const buffers = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      // === HEADER ===
      doc.fontSize(18).font("Helvetica-Bold").text(user.name.toUpperCase());
      doc.moveDown(0.4);

      // Contact info with proper spacing
      doc.fontSize(11).font("Helvetica");
      const contactParts = [
        { text: user.mob, link: `tel:${user.mob}`, color: "#000" },
        { text: " | ", color: "#000" },
        { text: user.email, link: `mailto:${user.email}`, color: "blue" },
        { text: " | ", color: "#000" },
        { text: "LinkedIn", link: user.linkedIn, color: "blue" },
        { text: " | ", color: "#000" },
        { text: "GitHub", link: user.github, color: "blue" },
        { text: " | ", color: "#000" },
        { text: "Portfolio", link: user.portfolio, color: "blue" },
      ];

      contactParts.forEach((part, i) => {
        doc.fillColor(part.color);
        const opts = { continued: i < contactParts.length - 1 };
        if (part.link) opts.link = part.link;
        doc.text(part.text, opts);
      });

      doc.fillColor("#000");
      doc.moveDown(1.2);

      // === SECTION HELPER ===
      const addSection = (title) => {
        if (doc.y > 700) doc.addPage(); // Prevent overflow

        doc.moveDown(0.6);
        doc.fontSize(12).font("Helvetica-Bold").text(title.toUpperCase());
        doc.moveDown(0.3);

        // Underline
        doc
          .strokeColor("#333")
          .lineWidth(0.5)
          .moveTo(doc.page.margins.left, doc.y)
          .lineTo(doc.page.width - doc.page.margins.right, doc.y)
          .stroke();

        doc.moveDown(0.5);
        doc.fontSize(10).font("Helvetica");
      };

      // === OVERVIEW ===
      if (overview?.trim()) {
        addSection("Summary");
        doc.text(overview.trim(), {
          align: "justify",
          lineGap: 3,
        });
      }

      // === EXPERIENCE ===
      addSection("Experience");
      const expLines = experienceText.split("\n").filter((l) => l.trim());

      expLines.forEach((line) => {
        const clean = line.trim();
        if (!clean) return;

        // Job title line (bold)
        if (/^(Analyst|Developer|Engineer|Intern)/i.test(clean)) {
          doc.moveDown(0.4);
          doc.font("Helvetica-Bold").text(clean);
          doc.font("Helvetica");
          return;
        }

        // Bullet points
        if (clean.startsWith("•") || clean.startsWith("-")) {
          const bulletText = clean.replace(/^[•\-]\s*/, "");
          doc.text(`• ${bulletText}`, {
            indent: 20,
            lineGap: 2,
          });
        } else {
          doc.text(clean, { lineGap: 2 });
        }
      });

      // === PROJECTS ===
      addSection("Projects");
      projects.forEach((project, idx) => {
        if (idx > 0) doc.moveDown(0.5);

        // Project name + link
        doc.font("Helvetica-Bold");
        if (project.liveUrl) {
          doc.fillColor("#000").text(project.name, { continued: true });
          doc.fillColor("blue").text(" (Live)", {
            link: project.liveUrl,
          });
          doc.fillColor("#000");
        } else {
          doc.text(project.name);
        }

        doc.moveDown(0.2);
        doc.font("Helvetica");

        // Project bullets
        (project.bullets || []).forEach((bullet) => {
          const cleanBullet = bullet.replace(/^[•\-]\s*/, "");
          doc.text(`• ${cleanBullet}`, {
            indent: 20,
            lineGap: 2,
          });
        });
      });

      // === EDUCATION ===
      addSection("Education");
      const eduLines = educationText
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);

      if (eduLines.length >= 3) {
        doc.font("Helvetica-Bold").text(eduLines[0]); // Degree
        doc.font("Helvetica");
        doc.text(eduLines[1]); // College
        if (eduLines[2]) doc.text(eduLines[2]); // Year/CGPA
        if (eduLines[3]) doc.text(eduLines[3]); // Additional info
      } else {
        doc.text(educationText);
      }

      // === SKILLS ===
      addSection("Skills");
      const skills = Array.isArray(skillsText) ? skillsText : [skillsText];

      skills.forEach((skill) => {
        if (!skill.trim()) return;
        doc.text(`• ${skill.trim()}`, {
          indent: 20,
          lineGap: 2,
        });
      });

      // === CERTIFICATIONS ===
      if (certificationsText?.title) {
        addSection("Certifications");

        doc.font("Helvetica-Bold");
        if (user.certificationLink) {
          doc
            .fillColor("#000")
            .text(certificationsText.title, { continued: true });
          doc.fillColor("blue").text(" (Link)", {
            link: user.certificationLink,
          });
          doc.fillColor("#000");
        } else {
          doc.text(certificationsText.title);
        }

        doc.font("Helvetica");

        if (certificationsText.duration) {
          doc.fontSize(9).text(certificationsText.duration);
          doc.fontSize(10);
        }

        if (certificationsText.description) {
          doc.moveDown(0.3);
          doc.text(`${certificationsText.description}`, {
            indent: 20,
            lineGap: 2,
          });
        }
      }

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
