import React, { useState, useRef } from "react";
import axios from "axios";
import {
  Upload,
  FileText,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";

const UploadResume = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const validateFile = (selectedFile) => {
    // Validate file type
    if (selectedFile.type !== "application/pdf") {
      setMessage("Please upload a PDF file.");
      setMessageType("error");
      return false;
    }
    // Validate file size (under 500KB)
    if (selectedFile.size > 500 * 1024) {
      setMessage("File size must be under 500KB.");
      setMessageType("error");
      return false;
    }
    return true;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
      setMessage(`${selectedFile.name} selected`);
      setMessageType("success");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const selectedFile = e.dataTransfer.files[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
      setMessage(`${selectedFile.name} selected`);
      setMessageType("success");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("No file selected.");
      setMessageType("error");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    setIsLoading(true);
    setMessage("");

    try {
      // Simulate network delay for demonstration
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const response = await axios.post(
        "http://localhost:8000/api/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setMessage(response.data.message);
      setMessageType("success");
    } catch (error) {
      console.error(error);
      setMessage("Error uploading file.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Skeleton Loader Component
  const SkeletonLoader = () => (
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
      <div className="h-12 bg-gray-300 rounded mt-4"></div>
    </div>
  );

  // Loading Spinner Component
  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center space-y-4">
      <Loader2 className="animate-spin text-blue-600" size={48} />
      <p className="text-gray-600 text-sm">Uploading your resume...</p>
    </div>
  );

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-xl">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center justify-center">
          <FileText className="mr-2 text-blue-600" size={24} />
          Upload Resume
        </h2>
      </div>

      {isLoading ? (
        <div className="min-h-[300px] flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner />
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div
            className={`flex items-center justify-center w-full 
              ${
                isDragOver
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 bg-gray-50"
              }
              flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer 
              hover:bg-gray-100 transition-colors duration-300`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerFileInput}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-10 h-10 text-gray-500 mb-2" />
              <p className="mb-2 text-sm text-gray-500">
                {file
                  ? file.name
                  : isDragOver
                  ? "Drop your file here"
                  : "Click to upload or drag and drop"}
              </p>
              <p className="text-xs text-gray-400">PDF (MAX. 500KB)</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={!file}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center disabled:bg-gray-400"
          >
            <Upload className="mr-2" size={20} />
            Upload Resume
          </button>
        </form>
      )}

      {message && !isLoading && (
        <div
          className={`mt-4 p-3 rounded-md flex items-center ${
            messageType === "error"
              ? "bg-red-50 text-red-700"
              : "bg-green-50 text-green-700"
          }`}
        >
          {messageType === "error" ? (
            <AlertCircle className="mr-2" size={20} />
          ) : (
            <CheckCircle className="mr-2" size={20} />
          )}
          <p className="text-sm">{message}</p>
        </div>
      )}
    </div>
  );
};

export default UploadResume;
