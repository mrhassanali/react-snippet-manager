import { toast } from "sonner";
import { createClient } from "./client";

/**
 * Uploads a file to a specified Supabase storage bucket.
 *
 * @param file - The file to be uploaded.
 * @param bucketName - The name of the Supabase storage bucket.
 * @param fileName - Optional. The name to use for the uploaded file. If not provided, the original file name is used.
 * @returns The data returned by Supabase upon successful upload, or undefined if an error occurs.
 * @throws Will display a toast error message if the upload fails.
 * @see {@link https://supabase.com/docs/guides/getting-started/tutorials/with-react#create-an-upload-widget Supabase React Upload Widget Documentation}
 */

export async function uploadFileToSupabase({
  file,
  bucketName,
  fileName,
  fileNameOrUrl,
  isRandomFileName = false,
}: {
  file: File;
  bucketName: string;
  fileName?: string;
  fileNameOrUrl?: string | null;
  isRandomFileName: boolean;
}) {
  try {
    const supabase = createClient();
    // const targetFileName = fileName || file.name;
    let data, error;

    // Generate a random file name if required
    const targetFileName = isRandomFileName
      ? `${crypto.randomUUID()}${getFileExtension(file.name)}`
      : fileName || file.name;

    if (fileNameOrUrl) {
      ({ data, error } = await supabase.storage
        .from(bucketName)
        .update(fileNameOrUrl, file));
    } else {
      ({ data, error } = await supabase.storage
        .from(bucketName)
        .upload(targetFileName, file));
    }

    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    toast.error(
      error instanceof Error
        ? error.message
        : "An error occurred while uploading the file."
    );
  }
}

/**
 * Delete files in a bucket
 */
export async function deleteFilesInBucket(
  fileNames: string[],
  bucketName: string
) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.storage
      .from(bucketName)
      .remove(fileNames);

    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    toast.error(
      error instanceof Error
        ? error.message
        : "An error occurred while deleting files."
    );
  }
}

// Helper function to get file extension
function getFileExtension(fileName: string): string {
  const ext = fileName.split(".").pop();
  return ext ? `.${ext}` : "";
}

