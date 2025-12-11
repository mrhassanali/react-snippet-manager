"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
// import Image from "next/image";

interface PhotoUploadProps {
  onFileSelect?: (file: File | null) => void;
  maxSize?: number; // in bytes
  acceptedFileTypes?: string[];
  className?: string;
  title?: string;
  description?: string;
  value?: string;
}

export function PhotoUpload({
  onFileSelect,
  maxSize = 5 * 1024 * 1024, // 5MB default
  acceptedFileTypes = ["image/jpeg", "image/png", "image/webp"],
  className,
  title = "Your Profile Picture",
  description = "Upload your photo",
  value,
}: PhotoUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (value && value.length > 0) {
      // If value is a URL, set it as preview
      setPreview(value);
    }
  }, [value]);

  const onDrop = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setError(null);

      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.errors[0]?.code === "file-too-large") {
          setError(
            `File is too large. Maximum size is ${maxSize / (1024 * 1024)}MB`,
          );
        } else if (rejection.errors[0]?.code === "file-invalid-type") {
          setError(
            "Invalid file type. Please upload a JPEG, PNG, or WebP image.",
          );
        } else {
          setError("Invalid file. Please try again.");
        }
        return;
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setSelectedFile(file);
        onFileSelect?.(file);

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [maxSize, onFileSelect],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce(
      (acc, type) => {
        acc[type] = [];
        return acc;
      },
      {} as Record<string, string[]>,
    ),
    maxSize,
    multiple: false,
  });

  const removeFile = () => {
    setSelectedFile(null);
    setPreview(null);
    setError(null);
    onFileSelect?.(null);
  };

  return (
    <div className={cn("w-full max-w-[12rem]", className)}>
      <h3 className="mb-3 text-sm font-normal text-gray-900">{title}</h3>

      <Card
        className={cn(
          "border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-gray-400",
          preview && "p-0",
        )}
      >
        <CardContent className={cn(preview ? "p-0" : "p-1 py-3")}>
          {preview ? (
            <div className="relative">
              <div className="relative mx-auto aspect-square w-full max-w-[200px]">
                {/* <Image
                  src={preview || "/placeholder.svg"}
                  alt="Preview"
                  fill
                  sizes="(max-width: 200px) 100vw, 200px"
                  className="rounded-lg object-cover"
                  priority={true}
                /> */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview || "/placeholder.svg"}
                  alt="Preview"
                  className="h-full w-full object-cover"
                  loading="lazy"
                  onError={() => {
                    setError("Failed to load image");
                    setPreview(null);
                  }}
                />
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">{selectedFile?.name}</p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute top-1 right-1 h-5 w-5 rounded-full border border-gray-300 bg-white/80 p-0 hover:bg-white"
                  onClick={() => removeFile()}
                >
                  <X className="h-3 w-3 text-gray-600" />
                </Button>
              </div>
            </div>
          ) : (
            <div
              {...getRootProps()}
              className={cn(
                "cursor-pointer rounded-lg text-center transition-colors",
                isDragActive
                  ? "border-blue-300 bg-blue-50"
                  : "hover:bg-gray-50",
              )}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                  <Upload className="h-6 w-6 text-gray-400" />
                </div>
                <p className="mb-1 text-sm text-gray-600">
                  {isDragActive ? "Drop your photo here" : description}
                </p>
                <p className="text-xs text-gray-400">
                  PNG, JPG, WebP up to {maxSize / (1024 * 1024)}MB
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-3 text-center text-sm text-red-600">{error}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
