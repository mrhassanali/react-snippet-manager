"use client";

import type React from "react";

import { useCallback, useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  name: string;
}

interface MultiplePhotoUploadProps {
  onFilesChange?: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number; // in MB for individual files
  maxTotalSize?: number; // in MB for all files combined
  acceptedFileTypes?: string[];
  className?: string;
  title?: string;
  description?: string;
  isFloatingLabel?: boolean;
  required?: boolean;
  label?: string;
  id?: string;
}

export function MultiplePhotoUpload({
  onFilesChange,
  maxFiles = 10,
  maxSize = 5 * 1024 * 1024, // 5MB default per file
  maxTotalSize = 10 * 1024 * 1024, // 10MB default total size
  acceptedFileTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"],
  className,
  title = "Attach Screenshot of the Issue",
  description = "Click to upload or drag and drop files here",
  isFloatingLabel = false,
  required = false,
  label = "Upload Photos",
  id = "multiple-photo-upload",
}: MultiplePhotoUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Convert MB to bytes
  const maxSizeBytes = maxSize;
  const maxTotalSizeBytes = maxTotalSize;

  const maxSizeInMB = maxSize / (1024 * 1024);
  const maxTotalSizeInMB = maxTotalSize / (1024 * 1024);

  const validateFile = useCallback(
    (file: File): string | null => {
      if (file.size > maxSizeBytes) {
        return `File "${file.name}" is too large. Maximum size is ${maxSizeInMB}MB`;
      }

      if (!acceptedFileTypes.includes(file.type)) {
        return `File "${file.name}" has invalid type. Please upload images only.`;
      }

      // Calculate current total size plus new file
      const currentTotalSize = uploadedFiles.reduce(
        (total, f) => total + f.file.size,
        0,
      );

      if (currentTotalSize + file.size > maxTotalSizeBytes) {
        return `Adding this file would exceed the maximum total size of ${maxTotalSize}MB`;
      }

      return null;
    },
    [
      maxSizeBytes,
      maxTotalSizeBytes,
      acceptedFileTypes,
      uploadedFiles,
      maxTotalSize,
      maxSizeInMB,
    ],
  );

  const createFilePreview = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });
  };

  const handleFiles = useCallback(
    async (newFiles: File[]) => {
      setError(null);

      // Check if adding new files would exceed max limit
      if (uploadedFiles.length + newFiles.length > maxFiles) {
        setError(
          `Maximum ${maxFiles} files allowed. You can upload ${maxFiles - uploadedFiles.length} more files.`,
        );
        return;
      }

      // Validate each file
      for (const file of newFiles) {
        const validationError = validateFile(file);
        if (validationError) {
          setError(validationError);
          return;
        }
      }

      // Create uploaded file objects with previews
      const newUploadedFiles: UploadedFile[] = [];
      for (const file of newFiles) {
        const preview = await createFilePreview(file);
        newUploadedFiles.push({
          id: `${Date.now()}-${Math.random()}`,
          file,
          preview,
          name: file.name,
        });
      }

      const updatedFiles = [...uploadedFiles, ...newUploadedFiles];
      setUploadedFiles(updatedFiles);
      onFilesChange?.(updatedFiles.map((f) => f.file));
    },
    [uploadedFiles, maxFiles, onFilesChange, validateFile],
  );

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(Array.from(files));
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (fileId: string) => {
    const updatedFiles = uploadedFiles.filter((f) => f.id !== fileId);
    setUploadedFiles(updatedFiles);
    onFilesChange?.(updatedFiles.map((f) => f.file));
    setError(null);
  };

  // Calculate current total size
  const currentTotalSizeMB = uploadedFiles.length
    ? (
        uploadedFiles.reduce((total, f) => total + f.file.size, 0) /
        (1024 * 1024)
      ).toFixed(2)
    : "0";

  return (
    <div className={cn("w-full", className)}>
      {/* Main Upload Area */}
      <Card className="mb-6 border-2 border-dashed border-gray-300 p-0 transition-colors hover:border-gray-400">
        <CardContent className={cn("p-0", isFloatingLabel && "relative")}>
          {isFloatingLabel && (
            <>
              <label
                htmlFor={id}
                className={cn(
                  "absolute -top-2.5 left-3 z-10 px-1 text-sm transition-all",
                  "bg-white leading-normal font-normal",
                  // error ? "text-destructive" : "text-[#1C1B1F]",
                  required &&
                    "font-normal text-[#1C1B1F] after:ml-0.5 after:text-red-500 after:content-['*']",
                )}
              >
                {label}
              </label>
            </>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedFileTypes.join(",")}
            onChange={handleFileInputChange}
            multiple
            className="hidden"
            aria-label="Upload photos"
          />

          <div
            onClick={handleClick}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={cn(
              "cursor-pointer rounded-lg px-6 py-16 text-center transition-colors",
              isDragActive
                ? "border-blue-400 bg-blue-50"
                : "border-gray-300 bg-gray-50 hover:border-gray-400",
            )}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleClick();
              }
            }}
            aria-label="Click to upload or drag and drop photos"
          >
            <div className="flex flex-col items-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                <Upload className="h-6 w-6 text-gray-500" />
              </div>
              <p className="text-sm font-normal text-gray-600">{title}</p>
              <p className="mb-2 text-sm text-gray-600">
                {isDragActive ? "Drop your files here" : description}
              </p>
              <p className="text-xs text-gray-400">
                PNG, JPG, WebP, GIF up to {maxSizeInMB}MB each • Max {maxFiles}{" "}
                files • Total max {maxTotalSizeInMB}MB
              </p>
            </div>
          </div>

          {error && (
            <div className="mt-4 text-center text-sm text-red-600">{error}</div>
          )}
        </CardContent>
      </Card>

      {/* Uploaded Files Grid */}
      {uploadedFiles.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {uploadedFiles.map((uploadedFile) => (
            <div key={uploadedFile.id} className="group relative">
              <Card className="overflow-hidden border border-gray-200 transition-shadow hover:shadow-md">
                <CardContent className="p-0">
                  <div className="relative aspect-[3/4] bg-gray-50">
                    <Image
                      src={
                        uploadedFile.preview ||
                        "/placeholder.svg?height=160&width=120"
                      }
                      alt={uploadedFile.name}
                      width={120}
                      height={160}
                      className="h-full w-full object-cover"
                      unoptimized
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute top-1 right-1 h-5 w-5 rounded-full border border-gray-300 bg-white/80 p-0 hover:bg-white"
                      onClick={() => removeFile(uploadedFile.id)}
                      aria-label={`Remove ${uploadedFile.name}`}
                    >
                      <X className="h-3 w-3 text-gray-600" />
                    </Button>
                  </div>
                  <div className="p-2 text-center">
                    <p
                      className="truncate text-xs font-normal text-gray-700"
                      title={uploadedFile.name}
                    >
                      {uploadedFile.name}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}

      {/* Upload Summary */}
      {uploadedFiles.length > 0 && (
        <div className="mt-4 text-center text-xs text-gray-600">
          {uploadedFiles.length} of {maxFiles} files uploaded (
          {currentTotalSizeMB}MB of {maxTotalSizeInMB} MB used)
        </div>
      )}
    </div>
  );
}
