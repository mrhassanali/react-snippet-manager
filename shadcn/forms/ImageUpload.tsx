import { Controller, Control } from "react-hook-form";
import { Field, FieldError } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import Dropzone from "react-dropzone";
import { toast } from "sonner";
import { uploadFileToSupabase } from "@/lib/supabase/storage";
import { useState } from "react";
import { Upload, X } from "lucide-react";

interface ImageUploadProps {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  maxFiles?: number;
  maxSize?: number;
  bucketName: string;
  accept?: Record<string, string[]>;
  assetUrlFn: (path: string) => string;
}


export function ImageUpload({
  name,
  control,
  maxFiles = 3,
  maxSize = 5 * 1024 * 1024,
  bucketName,
  accept = {
    "image/*": [".png", ".jpg", ".jpeg", ".gif"],
  },
  assetUrlFn,
}: ImageUploadProps) {
  const [uploadingImages, setUploadingImages] = useState(false);

  const handleUpload = async (
    acceptedFiles: File[],
    onChange: (value: string | string[]) => void,
    currentValue?: string[]
  ) => {
    try {
      // Check if adding new files would exceed the limit
      const totalFiles = (currentValue?.length || 0) + acceptedFiles.length;
      if (totalFiles > maxFiles) {
        toast.error(`Maximum ${maxFiles} images are allowed`);
        return;
      }

      setUploadingImages(true);

      // For single file upload, replace existing file
      if (maxFiles === 1) {
        const file = acceptedFiles[0];
        const data = await uploadFileToSupabase({
          file,
          bucketName,
          fileName: file.name,
          isRandomFileName: true,
        });

        if (data?.path) {
          onChange(data.path);
          toast.success("Image uploaded successfully!");
        }
        return;
      }

      // Upload multiple files
      const uploadPromises = acceptedFiles.map(async (file) => {
        const data = await uploadFileToSupabase({
          file,
          bucketName,
          fileName: file.name,
          isRandomFileName: true,
        });
        return data?.path || null;
      });

      const uploadedPaths = await Promise.all(uploadPromises);

      // Filter out any failed uploads (null values)
      const successfulUploads = uploadedPaths.filter(
        (path): path is string => path !== null
      );

      // Update form with new file paths
      const newValue = [...(currentValue || []), ...successfulUploads];
      onChange(newValue);

      if (successfulUploads.length > 0) {
        toast.success("Images uploaded successfully!");
      }
    } catch (error) {
      toast.error("Failed to upload images");
      console.error(error);
    } finally {
      setUploadingImages(false);
    }
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <div className="space-y-4">
            {(!value || (Array.isArray(value) && value.length < maxFiles)) && (
            <Dropzone
              onDrop={(acceptedFiles) =>
                handleUpload(acceptedFiles, onChange, value)
              }
              maxSize={maxSize}
              maxFiles={maxFiles}
              accept={accept}
              disabled={uploadingImages}
            >
              {({ getRootProps, getInputProps, isDragActive }) => (
                <div
                  {...getRootProps()}
                  className={cn(
                    "border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors",
                    isDragActive
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300",
                    "hover:border-gray-400",
                    uploadingImages && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <input {...getInputProps()} disabled={uploadingImages} />
                  <div className="flex flex-col items-center justify-center text-center">
                    <Upload className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-sm font-semibold text-gray-900">
                      {uploadingImages
                        ? "Uploading..."
                        : maxFiles === 1
                        ? "Upload an image"
                        : `Upload up to ${maxFiles} images`}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {maxFiles === 1
                        ? "Drag and drop or click to select an image"
                        : "Drag and drop or click to select images"}
                    </p>
                    <p className="mt-2 text-xs text-gray-500">
                      Maximum file size: {maxSize / 1024 / 1024} MB
                    </p>
                  </div>
                </div>
              )}
            </Dropzone>
            )}

            {/* Uploaded Images Grid - Single vs Multiple */}
            <div
              className={cn(
                "grid gap-4",
                maxFiles === 1 ? "grid-cols-1" : "grid-cols-2"
              )}
            >
              {Array.isArray(value) &&
                value?.map((file: string, index: number) => (
                  <div
                    key={index}
                    className="relative group border rounded-lg p-2"
                  >
                    {uploadingImages ? (
                      <div className="w-full h-40 flex items-center justify-center bg-gray-50 rounded-lg">
                        <div className="flex flex-col items-center space-y-2">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                          <p className="text-sm text-gray-500">Uploading...</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <img
                          src={assetUrlFn(file)}
                          alt={`Upload ${index + 1}`}
                          className={cn(
                            "w-full object-cover rounded-lg",
                            maxFiles === 1 ? "h-auto" : "h-40"
                          )}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            onChange(
                              value.filter(
                                (_: string, i: number) => i !== index
                              )
                            );
                          }}
                          disabled={uploadingImages}
                          className="absolute top-4 right-4 p-1.5 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                      </>
                    )}
                  </div>
                ))}

              {value && !Array.isArray(value) && typeof value === "string" && (
                <div className="relative group border rounded-lg p-2">
                  <img
                    src={assetUrlFn(value)}
                    alt={`Uploaded Image`}
                    className={cn(
                      "w-full object-cover rounded-lg",
                      maxFiles === 1 ? "h-65" : "h-40"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      onChange("");
                    }}
                    disabled={uploadingImages}
                    className="absolute top-4 right-4 p-1.5 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              )}
            </div>

            {fieldState.invalid && fieldState.error && (
              <FieldError errors={[fieldState.error]} />
            )}

            {/* Show remaining slots - Only for multiple files */}
            {maxFiles > 1 && (
              <p className="text-sm text-gray-500 mt-2">
                {value?.length || 0} of {maxFiles} images uploaded
              </p>
            )}
          </div>
        </Field>
      )}
    />
  );
}
