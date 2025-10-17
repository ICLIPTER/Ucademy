import { env } from "@/lib/env";


export function useConstructUrl(key: string): string {
    return `https://${env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}.t3.storage.dev/${key}`;

}