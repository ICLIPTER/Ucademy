import Link from "next/link";
import { StorageImage } from "@/components/ui/storage-image";
import { Award, GraduationCap, ShieldCheck } from "lucide-react";

import {
  getCertifiableCourses,
  getCertificates,
} from "@/app/data/certificate/get-certificates";
import { EmptyState } from "@/app/admin/courses/_components/general/EmptyState";
import { ClaimCertificateButton } from "./_components/ClaimCertificateButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getPublicAssetUrl } from "@/lib/storage-url";
import { formatDate } from "@/lib/format";

export const metadata = {
  title: "Certificates",
  description: "Your verified course completion certificates.",
};

export default async function CertificatesPage() {
  const [certificates, certifiable] = await Promise.all([
    getCertificates(),
    getCertifiableCourses(),
  ]);

  return (
    <div className="space-y-10">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Certificates</h1>
        <p className="text-muted-foreground">
          Every certificate has a unique serial that can be verified by anyone.
        </p>
      </div>

      {certificates.length === 0 && certifiable.length === 0 ? (
        <EmptyState
          title="No certificates yet"
          description="Finish every lesson in an enrolled course and your certificate will appear here."
          buttonText="Browse courses"
          href="/courses"
          icon={<GraduationCap className="size-10 text-primary" />}
        />
      ) : null}

      {certifiable.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Ready to claim</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {certifiable.map((course) => (
              <Card key={course.id}>
                <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{course.title}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      You completed every lesson — claim your certificate.
                    </p>
                  </div>
                  <ClaimCertificateButton courseId={course.id} />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {certificates.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Issued</h2>

          <div className="grid gap-6 md:grid-cols-2">
            {certificates.map((certificate) => (
              <Card key={certificate.id} className="overflow-hidden">
                <div className="relative h-40 w-full bg-gradient-to-br from-primary/15 via-muted to-muted">
                  <StorageImage
                    src={getPublicAssetUrl(certificate.course.fileKey)}
                    alt=""
                    fill
                    className="object-cover opacity-25"
                    sizes="(min-width: 768px) 50vw, 100vw"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
                    <Award className="size-8 text-primary" />
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">
                      Certificate of completion
                    </p>
                  </div>
                </div>

                <CardContent className="space-y-4 p-5">
                  <div>
                    <p className="font-semibold">{certificate.course.title}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      Issued {formatDate(certificate.issuedAt)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <Badge variant="outline" className="gap-1.5 font-mono">
                      <ShieldCheck className="size-3.5" />
                      {certificate.serial}
                    </Badge>

                    <Button asChild variant="outline" size="sm">
                      <Link href={`/dashboard/certificates/${certificate.serial}`}>
                        View
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
