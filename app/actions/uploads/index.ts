"use server"

import { s3Client } from "@/app/configs/s3"
import prisma from "@/prisma/prismaClient";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export const uploadToS3 = async (formData: FormData) => {
    //extract the file from the form data
  const file = formData.get('file') as File;
  const threadId = formData.get('threadId') as string;
  // Create a readable stream from the file path
  try {
    const fileName = file.name;
    const fileStream = await file.arrayBuffer();
    // Upload the file to S3
    const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET,
        Key: fileName,
        Body: fileStream,
        ContentType: 'application/pdf',
      });
      const data = await s3Client.send(command);
      if(data.$metadata.httpStatusCode !== 200){
        throw new Error('Failed to upload file to S3');
      }
      //return the public url of the uploaded file
      const url = `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
      //update the attachment metadata
      // await prisma.attachmentMetaData.create({
      //   data: {
      //     fileName: file.name,
      //     fileType: file.type,
      //     fileSize: file.size,
      //     url: url,
      //     threadId: threadId,
      //   },
      // });
      console.log(url,'getting file url')
      return {
        success: true,
        url: url,
      }
  } catch (error) {
    console.log(error,'error in uploading to s3')
    return {
      success: false,
      message: "Error in uploadding file"
  }
}
}