import { NextApiRequest, NextApiResponse } from "next";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const loadCredentials = async (): Promise<{ accessKeyId: string; secretAccessKey: string }> => {
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (!accessKeyId || !secretAccessKey) {
    throw new Error("AWS credentials not found in environment variables");
  }
  return {
    accessKeyId,
    secretAccessKey,
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { file } = req.body;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const credentials = await loadCredentials();

    const s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials,
    });

    const uploadParams = {
      Bucket: "click2deploy-prod-backups-eu-west-2",
      Key: file.name,
      Body: file,
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    return res.status(200).json({ message: "File uploaded successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error uploading file" });
  }
}
