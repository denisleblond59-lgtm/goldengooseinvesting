import { GoogleGenAI } from "@google/genai";
import fs from "fs";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const html = fs.existsSync("index.html") ? fs.readFileSync("index.html", "utf8") : "";
const css = fs.existsSync("styles.css") ? fs.readFileSync("styles.css", "utf8") : "";

const prompt = `Tu es un développeur web expert.
Demande de modification (Issue GitHub) :
Titre: ${process.env.ISSUE_TITLE}
Description: ${process.env.ISSUE_BODY}

Code actuel index.html :
\`\`\`html
${html}
\`\`\`

Code actuel styles.css :
\`\`\`css
${css}
\`\`\`

Exécute les modifications demandées.
Réponds STRICTEMENT sous la forme d'un objet JSON valide au format suivant, sans aucun autre texte autour :
{
  "index_html": "contenu intégral mis à jour de index.html",
  "style_css": "contenu intégral mis à jour de styles.css"
}`;

async function run() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    const res = JSON.parse(response.text);
    if (res.index_html && fs.readFileSync("index.html", "utf8") !== res.index_html) {
      fs.writeFileSync("index.html", res.index_html);
    }
    if (res.style_css && fs.readFileSync("styles.css", "utf8") !== res.style_css) {
      fs.writeFileSync("styles.css", res.style_css);
    }
    console.log("Mise à jour appliquée avec succès.");
  } catch (e) {
    console.error("Erreur execution Gemini :", e);
    process.exit(1);
  }
}
run();
