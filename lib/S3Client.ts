import 'server-only';
import { S3Client } from "@aws-sdk/client-s3";
import { env } from "./env";

export const S3 = new S3Client({
  region: "us-east-1", // Must be an actual region name
  endpoint: env.AWS_ENDPOINT_URL_S3, // e.g. https://t3.storage.dev
  forcePathStyle: true, // Required for T3 or other S3-compatible endpoints
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY!,
  },
});
