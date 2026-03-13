"use client";
import React, { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { ACCEPTED_PDF_TYPES, MAX_FILE_SIZE } from "@/lib/constants";

interface FileUploadProps {
  label?: string;
  value: File | null;
  onChange: (file: File) => void;
  accept?: string;
  maxSizeMB?: number;
  helperText?: string;
  className?: string;
}

const FileUpload = ({
  label,
  value,
  onChange,
  accept = ACCEPTED_PDF_TYPES,
  maxSizeMB = MAX_FILE_SIZE,
  helperText = "Max 50MB",
  className = "",
}: FileUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndSetFile(file);
  };

  const validateAndSetFile = (file: File) => {
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`File is too large. Max size is ${maxSizeMB}MB.`);
      return;
    }
    onChange(file);
  };

  // Drag and Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndSetFile(file);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      )}

      <div
        className={`
          border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
          ${isDragging ? "border-primary bg-primary/5 scale-[1.01]" : "border-border/50 hover:border-primary/40"}
          ${value ? "border-primary/20 bg-primary/5" : ""}
        `}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="flex flex-col items-center gap-2">
          <div
            className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${
              value ? "bg-primary text-white" : "bg-primary/10 text-primary"
            }`}
          >
            <Upload className="h-5 w-5" />
          </div>

          <p className="text-sm font-medium">
            {value ? value.name : `Click or drag to upload ${label || "file"}`}
          </p>

          <p className="text-xs text-muted-foreground">
            {value
              ? `${(value.size / (1024 * 1024)).toFixed(2)} MB`
              : helperText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
