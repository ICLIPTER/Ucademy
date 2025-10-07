import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3 } from "@/lib/S3Client";
import { env } from "process";

export const fileUploadSchema = z.object({
  fileName: z.string().min(1, { message: "File name is required" }),
  contentType: z.string().min(1, { message: "Content type is required" }),
  size: z.number().min(1, { message: "Size is required" }),
  isImage: z.boolean(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = fileUploadSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const { fileName, contentType } = validation.data;

    // Encode file name to handle spaces/special characters
    const safeName = encodeURIComponent(fileName);
    const uniqueKey = `${uuidv4()}-${safeName}`;

    const command = new PutObjectCommand({
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
      Key: uniqueKey,
      ContentType: contentType,
    });

    const presignedUrl = await getSignedUrl(S3, command, {
      expiresIn: 360, // 6 minutes
    });

    return NextResponse.json({
      presignedUrl,
      key: uniqueKey,
    });
  } catch (error) {
    console.error("S3 upload error:", error);
    return NextResponse.json(
      { error: "Failed to generate presigned URL" },
      { status: 500 }
    );
  }
}
