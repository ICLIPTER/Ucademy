import { notFound } from "next/navigation";
import { StorageImage } from "@/components/ui/storage-image";
import { Award, ShieldCheck } from "lucide-react";

import { requireUser } from "@/app/data/user/require_user";
import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/format";
import { getPublicAssetUrl } from "@/lib/storage-url";
import Link from "next/link";
import { PrintButton } from "./_components/PrintButton";

export const metadata = {
  title: "Certificate",
  description: "Your verified Ucademy certificate of completion.",
};

export default async function CertificateDetailPage({
  params,
}: {
  params: Promise<{ serial: string }>;
}) {
  const { serial } = await params;
  const user = await requireUser();

  const certificate = await prisma.certificate.findFirst({
    where: { serial, userId: user.id },
    select: {
      id: true,
      serial: true,
      finalScore: true,
      issuedAt: true,
      course: {
        select: {
          title: true,
          subtitle: true,
          slug: true,
          fileKey: true,
          category: true,
          level: true,
          duration: true,
        },
      },
    },
  });

  if (!certificate) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Certificate</h1>
          <p className="text-muted-foreground">
            Issued {formatDate(certificate.issuedAt)}
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/certificates">Back to certificates</Link>
          </Button>
          <PrintButton />
        </div>
      </div>

      <Card className="print:shadow-none print:border-0">
        <div className="relative overflow-hidden rounded-t-xl border-b bg-gradient-to-br from-primary/10 via-background to-muted p-8 text-center print:bg-none">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(50%_50%_at_50%_0%,var(--primary)/15%,transparent_70%)]"
          />
          <Award className="mx-auto size-10 text-primary" />
          <p className="mt-4 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Certificate of completion
          </p>
        </div>

        <CardContent className="space-y-8 p-8 text-center print:p-0 print:pt-8">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">This certifies that</p>
            <p className="text-3xl font-bold tracking-tight">{user.name}</p>
            <p className="text-sm text-muted-foreground">has successfully completed</p>
            <p className="text-2xl font-semibold text-primary">
              {certificate.course.title}
            </p>
            {certificate.course.subtitle && (
              <p className="text-sm text-muted-foreground">
                {certificate.course.subtitle}
              </p>
            )}
          </div>

          <div className="mx-auto grid max-w-lg grid-cols-3 gap-4 border-y py-6 text-sm">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Issued on
              </p>
              <p className="mt-1 font-medium">
                {formatDate(certificate.issuedAt)}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Final score
              </p>
              <p className="mt-1 font-medium">
                {certificate.finalScore.toFixed(0)}%
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Certificate ID
              </p>
              <p className="mt-1 font-mono font-medium">{certificate.serial}</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3">
            <Badge variant="outline" className="gap-1.5 font-mono">
              <ShieldCheck className="size-3.5" />
              Verified by Ucademy
            </Badge>
            <p className="max-w-md text-xs text-muted-foreground">
              Anyone with this serial can verify the certificate. Share it with
              an employer or add it to your portfolio.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center print:hidden">
        <StorageImage
          src={getPublicAssetUrl(certificate.course.fileKey)}
          alt=""
          width={200}
          height={112}
          className="rounded-lg object-cover opacity-70"
        />
      </div>
    </div>
  );
}
