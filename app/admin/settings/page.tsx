import {
  IconBrandStripe,
  IconBrandGithub,
  IconBrandGmail,
  IconCloud,
  IconDatabase,
  IconCheck,
  IconX,
} from "@tabler/icons-react";

import { env, hasGitHub, hasResend, hasStorage, hasStripe } from "@/lib/env";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { appUrl } from "@/lib/env";

export const metadata = {
  title: "Settings",
  description: "Platform configuration and deployment status.",
};

export default function AdminSettingsPage() {
  const integrations = [
    {
      name: "Database",
      description: "PostgreSQL via Prisma — course, enrolment and progress data.",
      configured: Boolean(env.DATABASE_URL),
      detail: env.DATABASE_URL
        ? "Connected"
        : "DATABASE_URL is not set",
      icon: IconDatabase,
    },
    {
      name: "Payments",
      description: "Stripe Checkout for course purchases and refunds.",
      configured: hasStripe,
      detail: hasStripe
        ? "Connected"
        : "STRIPE_SECRET_KEY is not set — courses can be created but not sold",
      icon: IconBrandStripe,
    },
    {
      name: "Email delivery",
      description: "Resend delivers the one-time codes used to sign in.",
      configured: hasResend,
      detail: hasResend
        ? `Sending as ${env.RESEND_FROM_EMAIL}`
        : "RESEND_API_KEY is not set — email sign-in is unavailable",
      icon: IconBrandGmail,
    },
    {
      name: "GitHub sign-in",
      description: "Optional social login alongside the email one-time code.",
      configured: hasGitHub,
      detail: hasGitHub
        ? "Connected"
        : "AUTH_GITHUB_CLIENT_ID / SECRET are not set",
      icon: IconBrandGithub,
    },
    {
      name: "Media storage",
      description: "S3-compatible storage for course thumbnails and lesson video.",
      configured: hasStorage,
      detail: hasStorage
        ? `Bucket "${env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}"`
        : "AWS credentials are not set — uploads are unavailable",
      icon: IconCloud,
    },
  ];

  const missing = integrations.filter((integration) => !integration.configured);

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          How this deployment is wired up, and what still needs attention.
        </p>
      </div>

      {missing.length > 0 && (
        <Alert>
          <IconX className="size-4" />
          <AlertTitle>
            {missing.length} integration{missing.length === 1 ? "" : "s"} not
            configured
          </AlertTitle>
          <AlertDescription>
            {missing.map((integration) => integration.name).join(", ")} —{" "}
            {missing.length === 1 ? "that feature" : "those features"} will be
            unavailable until the matching environment variable is set.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Deployment</CardTitle>
          <CardDescription>Core settings for this instance.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Canonical URL
            </p>
            <p className="mt-1 font-medium break-all">{appUrl}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Environment
            </p>
            <p className="mt-1 font-medium capitalize">
              {env.NODE_ENV}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Integrations</h2>

        <div className="grid gap-4 md:grid-cols-2">
          {integrations.map((integration) => (
            <Card key={integration.name}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                <div className="flex gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <integration.icon className="size-5" />
                  </span>
                  <div>
                    <CardTitle className="text-base">{integration.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {integration.description}
                    </CardDescription>
                  </div>
                </div>

                <Badge
                  variant={integration.configured ? "default" : "secondary"}
                  className="shrink-0 gap-1"
                >
                  {integration.configured ? (
                    <>
                      <IconCheck className="size-3" />
                      Ready
                    </>
                  ) : (
                    "Not set"
                  )}
                </Badge>
              </CardHeader>

              <Separator />

              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground">
                  {integration.detail}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
