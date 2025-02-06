import express from "express";
import multer from "multer";
import pdfParse from "pdf-parse";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post("/upload", upload.single("resume"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const data = await pdfParse(req.file.buffer);
    const text = data.text;

    // Mock skill extraction and job matching
    const skills = ["JavaScript", "React", "Node.js"];
    const jobs = [
      { title: "Frontend Developer", company: "Google" },
      { title: "Software Engineer", company: "Tesla" },
    ];

    res.json({ extracted_text: text, skills, jobs });
  } catch {
    res.status(500).json({ error: "Error parsing PDF" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
