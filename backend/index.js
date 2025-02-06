/* eslint-disable @typescript-eslint/no-require-imports */
const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const cors = require("cors");

const app = express();
app.use(cors()); 
app.use(express.json()); // ✅ Keep for normal routes, but NOT for file uploads

const storage = multer.memoryStorage(); 
const upload = multer({ storage });

app.post("/upload", upload.single("resume"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const data = await pdfParse(req.file.buffer);
    const text = data.text;

    // Mocked skill extraction & job matching
    res.json({
      extracted_text: text,
      skills: ["React", "JavaScript"],
      jobs: [{ title: "Frontend Developer", company: "Google" }]
    });
  } catch {
    res.status(500).json({ error: "Error parsing PDF" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
