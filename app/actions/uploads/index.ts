"use server"

import { s3Client } from "@/app/configs/s3"
import { authOptions } from "@/libs/authOptions";
import prisma from "@/prisma/prismaClient";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getServerSession } from "next-auth";

export const uploadToS3 = async (formData: FormData) => {
  //get session
  const session = await getServerSession(authOptions);
    //extract the file from the form data
  const file = formData.get('file') as File;
  // Create a readable stream from the file path
  try {
    const fileName = file.name;
    const fileStream = await file.arrayBuffer();
   // Upload the file to S3
    const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET,
        Key: fileName,
        Body: new Uint8Array(fileStream),
        ContentType: file.type,
      });
      const data = await s3Client.send(command);
      if(data.$metadata.httpStatusCode !== 200){
        throw new Error('Failed to upload file to S3');
      }
      //return the public url of the uploaded file
      const url = `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
      //update the attachment metadata
      try {
        await prisma.attachmentMetaData.create({
        data: {
          userid: session?.user.id || "",
          fileName: file.name,
          fileType: file.type.split('/')[1] || 'unknown',   //eg application/pdf => pdf
          fileSize: file.size,
          url: url,
        },
      });
      } catch (error) {
        console.log(error, 'error in saving attachment metadata');
        return {
          success: false,
          message: "Error in saving attachment metadata",
      }
    }
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