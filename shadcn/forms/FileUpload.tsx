import { Controller, Control } from "react-hook-form";
import { Field, FieldError } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import Dropzone from "react-dropzone";
import { toast } from "sonner";
import { uploadFileToSupabase } from "@/lib/supabase/storage";
import { useState } from "react";
import { FileText, Upload, X } from "lucide-react";

interface FileUploadProps {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  maxFiles?: number;
  maxSize?: number;
  bucketName: string;
  accept?: Record<string, string[]>;
  assetUrlFn: (path: string) => string;
}

export function FileUpload({
  name,
  control,
  maxFiles = 3,
  maxSize = 5 * 1024 * 1024,
  bucketName,
  accept = {
    "image/*": [".png", ".jpg", ".jpeg", ".gif"],
  },
  assetUrlFn,
}: FileUploadProps) {
  const [uploadingFiles, setUploadingFiles] = useState(false);

  const handleUpload = async (
    acceptedFiles: File[],
    onChange: (value: string | string[]) => void,
    currentValue?: string[]
  ) => {
    try {
      // Check if adding new files would exceed the limit
      const totalFiles = (currentValue?.length || 0) + acceptedFiles.length;
      if (totalFiles > maxFiles) {
        toast.error(`Maximum ${maxFiles} file are allowed`);
        return;
      }

      setUploadingFiles(true);

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
          toast.success("File uploaded successfully!");
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
      const successfulUploads = uploadedPaths.filter((path): path is string => path !== null);

      // Update form with new file paths
      const newValue = [...(currentValue || []), ...successfulUploads];
      onChange(newValue);

      if (successfulUploads.length > 0) {
        toast.success("Files uploaded successfully!");
      }
    } catch (error) {
      toast.error("Failed to upload files");
      console.error(error);
    } finally {
      setUploadingFiles(false);
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
                onDrop={(acceptedFiles) => handleUpload(acceptedFiles, onChange, value)}
                maxSize={maxSize}
                maxFiles={maxFiles}
                accept={accept}
                disabled={uploadingFiles}
              >
                {({ getRootProps, getInputProps, isDragActive }) => (
                  <div
                    {...getRootProps()}
                    className={cn(
                      "border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors",
                      isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300",
                      "hover:border-gray-400",
                      uploadingFiles && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <input {...getInputProps()} disabled={uploadingFiles} />
                    <div className="flex flex-col items-center justify-center text-center">
                      <Upload className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-sm font-semibold text-gray-900">
                        {uploadingFiles
                          ? "Uploading..."
                          : maxFiles === 1
                          ? "Upload a file"
                          : `Upload up to ${maxFiles} files`}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {maxFiles === 1
                          ? "Drag and drop or click to select a file"
                          : "Drag and drop or click to select files"}
                      </p>
                      <p className="mt-2 text-xs text-gray-500">Maximum file size: {maxSize / 1024 / 1024} MB</p>
                    </div>
                  </div>
                )}
              </Dropzone>
            )}

            {/* Uploaded Images Grid - Single vs Multiple */}
            <div className={cn("grid gap-4", maxFiles === 1 ? "grid-cols-1" : "grid-cols-2")}>
              {Array.isArray(value) &&
                value?.map((file: string, index: number) => (
                  <div key={index} className="relative border rounded-lg p-2">
                    {uploadingFiles ? (
                      <div className="w-full h-40 flex items-center justify-center bg-gray-50 rounded-lg">
                        <div className="flex flex-col items-center space-y-2">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                          <p className="text-sm text-gray-500">Uploading...</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center bg-gray-50 rounded-md p-2">
                              <FileText className="w-6 h-6 text-gray-500" />
                            </div>
                            <div className="flex flex-col">
                              <a
                                href={assetUrlFn(file)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-medium text-gray-900 hover:underline"
                              >
                                {file.split("/").pop() || "Attachment"}
                              </a>
                              <p className="text-xs text-gray-500">Click to open or download</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* <a
                              href={assetUrlFn(file)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline"
                            >
                              Open
                            </a> */}
                            <button
                              type="button"
                              onClick={() => {
                                const newVal = value.filter((_: string, i: number) => i !== index);
                                onChange(maxFiles === 1 ? "" : newVal);
                              }}
                              disabled={uploadingFiles}
                              className="p-1.5 bg-red-500 rounded-full  transition-opacity disabled:opacity-50"
                            >
                              <X className="w-4 h-4 text-white" />
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}

              {value && !Array.isArray(value) && typeof value === "string" && (
                <div className="relative  border rounded-lg p-2">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center bg-gray-50 rounded-md p-2">
                        <FileText className="w-6 h-6 text-gray-500" />
                      </div>
                      <div className="flex flex-col">
                        <a
                          href={assetUrlFn(value)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-gray-900 hover:underline"
                        >
                          {value.split("/").pop() || "Attachment"}
                        </a>
                        <p className="text-xs text-gray-500">Click to open or download</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* <a
                        href={assetUrlFn(value)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Open
                      </a> */}
                      <button
                        type="button"
                        onClick={() => {
                          onChange("");
                        }}
                        disabled={uploadingFiles}
                        className="p-1.5 bg-red-500 rounded-full  transition-opacity disabled:opacity-50"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {fieldState.invalid && fieldState.error && <FieldError errors={[fieldState.error]} />}

            {/* Show remaining slots - Only for multiple files */}
            {maxFiles > 1 && (
              <p className="text-sm text-gray-500 mt-2">
                {value?.length || 0} of {maxFiles} File uploaded
              </p>
            )}
          </div>
        </Field>
      )}
    />
  );
}



/*
<FileUpload
                  name={`resume`}
                  control={form.control}
                  maxFiles={CAREER_APPLICATION_ATTACHMENT_MAX_LENGTH}
                  maxSize={CAREER_APPLICATION_MAX_SIZE}
                  bucketName={CAREER_APPLICATION_BUCKET_NAME}
                  assetUrlFn={CAREER_APPLICATION_ASSET_URL}
                  key={`resume`}
                  accept={{
                    "application/pdf": [".pdf"],
                    "application/msword": [".doc"],
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
                  }}
                />
                */
