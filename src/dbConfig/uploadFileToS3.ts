import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY!,
  },
});

/**
 * Uploads a file to S3.
 * @param {Buffer} file - The file buffer to upload.
 * @param {string} fileName - The name of the file.
 * @param {string} folderName - The folder name in the S3 bucket.
 *  @returns {Promise<{status: boolean, fileName: string}>} - The upload status and file name.
 */

// Define types for the parameters
type UploadFileToS3Params = {
  file: Buffer;
  fileName: string;
  folderName: string;
};

// Uploads a file to S3
export async function uploadFileToS3({
  file,
  fileName,
  folderName,
}: UploadFileToS3Params): Promise<{ status: boolean; fileName: string }> {
  try {
    const fileBuffer = file;
    const uploadFilePath = `albums/07c1a${folderName}ba3/cover/${fileName}`;

    const fileExtension = fileName.split(".").pop();
    let contentType = ""; // Default content type

    switch (fileExtension) {
      case "png":
        contentType = "image/png";
        break;
      case "jpeg":
      case "jpg":
        contentType = "image/jpeg";
        break;
    }

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: uploadFilePath,
      Body: fileBuffer,
      ContentType: contentType,
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    return { status: true, fileName };
  } catch (error: any) {
    return { status: true, fileName };
  }
}

export async function uploadTrackToS3({
  file,
  fileName,
  folderName,
}: UploadFileToS3Params): Promise<{ status: boolean; fileName: string }> {
  try {
    const fileBuffer = file;
    const uploadFilePath = `albums/07c1a${folderName}ba3/tracks/${fileName}`;

    // Determine the content type based on the file extension
    const fileExtension = fileName.split(".").pop();
    let contentType = "application/octet-stream"; // Default content type

    switch (fileExtension) {
      case "mp3":
        contentType = "audio/mpeg";
        break;
      case "wav":
        contentType = "audio/wav";
        break;
      case "flac":
        contentType = "audio/flac";
        break;
      // Add more cases as needed
      default:
        contentType = "application/octet-stream";
    }

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: uploadFilePath,
      Body: fileBuffer,
      ContentType: contentType,
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    return { status: true, fileName };
  } catch (error: any) {
    return { status: true, fileName };
  }
}


// upload extra file for marketing 

type UploadMarketingFileToS3Params = {
  file: Buffer;
  fileName: string;
};


export async function uploadExtraFileToS3({
  file,
  fileName,
}: UploadMarketingFileToS3Params): Promise<{ status: boolean; fileName: string }> {
  try {
    const fileBuffer = file;
    const uploadFilePath = `labels/marketing/${fileName}`;

    // Determine the content type based on the file extension
    const fileExtension = fileName.split(".").pop();
    let contentType = "application/octet-stream"; // Default content type

    switch (fileExtension) {
      case "mp3":
        contentType = "audio/mpeg";
        break;
      case "wav":
        contentType = "audio/wav";
        break;
      case "flac":
        contentType = "audio/flac";
        break;
      case "pdf":
        contentType = "application/pdf";
        break;
      case "ppt":
      case "pptx":
        contentType = "application/vnd.ms-powerpoint";
        break;
      case "doc":
      case "docx":
        contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        break;
      case "png":
        contentType = "image/png";
        break;
      case "jpeg":
      case "jpg":
        contentType = "image/jpeg";
        break;
      case "mp4":
        contentType = "video/mp4";
        break;
      default:
        contentType = "application/octet-stream"; // Default content type for unhandled extensions
    }

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: uploadFilePath,
      Body: fileBuffer,
      ContentType: contentType,
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    return { status: true, fileName };
  } catch (error: any) {
    console.error("Error uploading file to S3:", error);
    return { status: false, fileName };
  }
}

// upload artist profile image


type UploadArtistProfileToS3Params = {
  file: Buffer;
  fileName: string;
};


export async function uploadArtistProfileToS3({
  file,
  fileName,
}: UploadArtistProfileToS3Params): Promise<{ status: boolean; fileName: string }> {
  try {
    const fileBuffer = file;
    const uploadFilePath = `labels/artist/${fileName}`;

    // Determine the content type based on the file extension
    const fileExtension = fileName.split(".").pop();
    let contentType = ""; // Default content type

    switch (fileExtension) {
      case "png":
        contentType = "image/png";
        break;
      case "jpeg":
      case "jpg":
        contentType = "image/jpeg";
        break;
    }

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: uploadFilePath,
      Body: fileBuffer,
      ContentType: contentType,
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    return { status: true, fileName };
  } catch (error: any) {
    console.error("Error uploading file to S3:", error);
    return { status: false, fileName };
  }
}


