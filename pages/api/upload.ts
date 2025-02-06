/* eslint-disable @typescript-eslint/no-require-imports */
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import axios from "axios";

const formidable = require("formidable"); // ✅ Use `require()` instead of `import`

export const config = {
  api: {
    bodyParser: false, // ⛔ Disable bodyParser to handle multipart/form-data
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const form = new formidable.IncomingForm(); // ✅ Now works with CommonJS
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "Error parsing form" });
    }

    if (!files.resume || !Array.isArray(files.resume) || !files.resume[0]) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = files.resume[0]; // Get uploaded file

    try {
      // ✅ Read file as a Buffer
      const fileBuffer = fs.readFileSync(file.filepath);

      // ✅ Convert Buffer to Blob
      const fileBlob = new Blob([fileBuffer], { type: file.mimetype });

      const formData = new FormData();
      formData.append("resume", fileBlob, file.originalFilename);

      // ✅ Send file to backend
      const backendResponse = await axios.post("http://localhost:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      res.status(200).json(backendResponse.data);
    } catch {
      res.status(500).json({ error: "Error sending file to backend" });
    }
  });
}
