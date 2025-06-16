import { S3Client } from "@aws-sdk/client-s3";

// Initialize the S3 client with your AWS region
export const s3Client = new S3Client({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.S3_BUCKET_ACCESS_KEY as string,
    secretAccessKey: process.env.S3_BUCKET_SECRET_KEY as string,
  },
});