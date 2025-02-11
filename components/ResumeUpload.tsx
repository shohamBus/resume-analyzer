/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import axios from "axios";

const ResumeUpload = () => {
    const [resumes, setResumes] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [analysisResults, setAnalysisResults] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            setResumes(Array.from(files));
            setError(null);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (resumes.length === 0) {
            setError("Please select at least one resume file.");
            return;
        }

        setUploading(true);
        const formData = new FormData();
        resumes.forEach((resume) => {
            formData.append(`resume`, resume);
        });

        try {
            const response = await axios.post("/api/upload", formData);
            setAnalysisResults([...analysisResults, response.data]);
        } catch (error) {
            setError("Failed to upload resumes.");
        } finally {
            setUploading(false);
        }
    };


    return (
        <>
            <form onSubmit={handleSubmit}>
                <input
                    type="file"
                    accept=".pdf"
                    multiple
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
                    {uploading ? "Uploading..." : "Analyze Resumes"}
                </button>
            </form>
            <div className="flex flex-col">
                {resumes.map((resume, index) => {
                    const objectURL = URL.createObjectURL(resume);
                    return (
                        <div key={index}>
                            <iframe
                                className="h-[600px] w-full "
                                src={objectURL}
                                title={`PDF Viewer ${index}`}
                            />
                        </div>
                    );
                })}
            </div>
            <div className="flex flex-col">
                {analysisResults?.map((result, index) => (
                    <div key={index} className="h-[600px] mt-6 p-4 bg-gray-50 rounded-lg shadow-md  w-fit">
                        <h3 className="text-lg font-semibold text-black">Extracted Text from Resume {index + 1}:</h3>
                        <pre className="text-gray-700 text-sm bg-gray-200 p-2 rounded-md overflow-x-auto">{result.extracted_text}</pre>
                    </div>
                ))}
            </div>
        </>
    );
};


export default ResumeUpload;