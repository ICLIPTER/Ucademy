import { requireUser } from "@/app/data/user/require_user";
import { prisma } from "@/lib/db";
import { ProfileSettingsForm } from "./_components/ProfileSettingsForm";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/format";

export const metadata = {
  title: "Settings",
  description: "Manage your Ucademy profile and account.",
};

export default async function SettingsPage() {
  const sessionUser = await requireUser();

  // `bio` and `jobTitle` are profile fields, not part of the auth session
  // payload, so they are read straight from the database.
  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: {
      name: true,
      email: true,
      jobTitle: true,
      bio: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) return null;

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your profile and account preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Details associated with your account.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Email
            </p>
            <p className="mt-1 font-medium">{user.email}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Member since
            </p>
            <p className="mt-1 font-medium">{formatDate(user.createdAt)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Role
            </p>
            <Badge variant="secondary" className="mt-1 capitalize">
              {user.role ?? "learner"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <ProfileSettingsForm
        name={user.name ?? ""}
        email={user.email}
        jobTitle={user.jobTitle ?? ""}
        bio={user.bio ?? ""}
      />
    </div>
  );
}
