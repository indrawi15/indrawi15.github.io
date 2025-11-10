import fs from "fs";
import { JSDOM } from "jsdom";

const html = fs.readFileSync("index.html", "utf8");
const dom = new JSDOM(html);
const document = dom.window.document;

// Ambil semua project
const projects = [...document.querySelectorAll(".project-card")].map(card => ({
  title: card.querySelector("h3")?.textContent.trim() || "",
  details: [card.querySelector("p")?.textContent.trim() || ""],
  image: card.querySelector("img")?.getAttribute("src") || ""
}));

// Ambil semua experience (kalau ada detail-card)
const experience = [...document.querySelectorAll(".detail-card")].map(card => ({
  role: card.querySelector("h4")?.textContent.trim() || "",
  techStack: card.querySelector("p strong")?.textContent.replace("Tech Stack:", "").trim() || "",
  bullets: [...card.querySelectorAll("p")]
    .map(p => p.textContent.replace("Tech Stack:", "").trim())
    .filter(p => !p.startsWith("Tech Stack"))
}));

// Data CV lengkap
const resume = {
  name: "Indra Wijaya",
  contact: {
    email: "indrawijaya571@gmail.com",
    phone: "+62 85780329416",
    location: "Bogor, Indonesia"
  },
  profile:
    "Graduate of Informatics – Bhayangkara University Jakarta Raya (GPA 3.63) specializing in Data Science, Machine Learning, and Business Intelligence. Experienced in data analysis, predictive modeling, and interactive dashboard development.",
  skillsOverview: {
    programming: ["Python", "SQL"],
    dataTools: ["Pandas", "NumPy", "Scikit-learn", "TensorFlow", "Keras"],
    visualization: ["Looker Studio", "Matplotlib", "Seaborn"],
    deployment: ["Flask", "Google Colab", "Git"],
    other: ["Feature Engineering", "Statistical Analysis", "Data Cleaning"]
  },
  experience,
  projects,
  education: [
    {
      degree: "Bachelor of Informatics",
      school: "Bhayangkara University Jakarta Raya",
      year: 2025,
      gpa: 3.61
    }
  ],
  certifications: [
    "Associate Data Scientist – LSP Informatika (BNSP)",
    "Certified Independent Study – GreatEdu Data Science Bootcamp"
  ]
};

// Simpan file JSON
fs.writeFileSync("resume.json", JSON.stringify(resume, null, 2));
console.log(`✅ resume.json berhasil dibuat: ${projects.length} proyek, ${experience.length} pengalaman`);
