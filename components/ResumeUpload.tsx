/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import axios from "axios";

const ResumeUpload = () => {
    const [resume, setResume] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setResume(file);
            setError(null);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!resume) {
            setError("Please select a resume file.");
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append("resume", resume); // ✅ Attach the file

        try {
            const response = await axios.post("/api/upload", formData); // ✅ No manual headers!
            setAnalysisResult(response.data);
            setError(null);
        } catch {
            setError("Error uploading resume. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-4">Upload Your Resume</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border file:border-gray-300 file:text-gray-700 
            hover:file:bg-gray-100"
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                    type="submit"
                    disabled={uploading}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg shadow-md
            hover:bg-blue-700 disabled:bg-gray-400"
                >
                    {uploading ? "Uploading..." : "Analyze Resume"}
                </button>
            </form>

            {analysisResult && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold">Extracted Text:</h3>
                    <pre className="text-gray-700 text-sm bg-gray-200 p-2 rounded-md overflow-x-auto">{analysisResult.extracted_text}</pre>

                    <h4 className="mt-4 text-md font-semibold">Recommended Jobs:</h4>
                    <ul className="list-disc list-inside text-gray-700">
                        {analysisResult.jobs.map((job: any, index: number) => (
                            <li key={index} className="mt-1">{job.title} at {job.company}</li>
                        ))}
                    </ul>

                    <h4 className="mt-4 text-md font-semibold">Skills Extracted:</h4>
                    <ul className="list-disc list-inside text-gray-700">
                        {analysisResult.skills.map((skill: string, index: number) => (
                            <li key={index} className="mt-1">{skill}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ResumeUpload;
