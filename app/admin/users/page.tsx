
import { Search, Users } from "lucide-react";

import { adminGetUsers } from "@/app/data/admin/admin-get-users";
import { EmptyState } from "../courses/_components/general/EmptyState";
import { UserRowActions } from "./_components/UserRowActions";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { formatCompactNumber, formatCurrency, formatDate } from "@/lib/format";
import { Input } from "@/components/ui/input";

export const metadata = {
  title: "Learners",
  description: "Manage the learners on your platform.",
};

const PAGE_SIZE = 12;

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const page = Number.parseInt(params.page ?? "1", 10) || 1;

  const { users, total, totalPages } = await adminGetUsers({
    query,
    page,
    pageSize: PAGE_SIZE,
  });

  const buildHref = (nextPage: number) => {
    const search = new URLSearchParams();
    if (query) search.set("q", query);
    if (nextPage > 1) search.set("page", String(nextPage));
    const searchString = search.toString();
    return searchString ? `/admin/users?${searchString}` : "/admin/users";
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Learners</h1>
        <p className="text-muted-foreground">
          {formatCompactNumber(total)} registered{" "}
          {total === 1 ? "learner" : "learners"}.
        </p>
      </div>

      <form method="get" className="relative max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Search by name or email…"
          className="h-10 pl-9"
          aria-label="Search learners"
        />
      </form>

      {users.length === 0 ? (
        <EmptyState
          title="No learners found"
          description={
            query
              ? "No learner matches that search. Try a different name or email."
              : "Learners will appear here once they sign up."
          }
          buttonText="Clear search"
          href="/admin/users"
          icon={<Users className="size-10 text-primary" />}
        />
      ) : (
        <div className="rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Learner</TableHead>
                <TableHead className="hidden md:table-cell">Joined</TableHead>
                <TableHead className="text-right">Courses</TableHead>
                <TableHead className="hidden text-right sm:table-cell">
                  Lessons
                </TableHead>
                <TableHead className="hidden text-right lg:table-cell">
                  Spend
                </TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>

            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium">{user.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {user.email}
                      </span>
                      {user.role === "admin" && (
                        <Badge variant="secondary" className="mt-1 w-fit">
                          Instructor
                        </Badge>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="hidden text-muted-foreground md:table-cell">
                    {formatDate(user.createdAt)}
                  </TableCell>

                  <TableCell className="text-right tabular-nums">
                    {user.enrollments}
                  </TableCell>

                  <TableCell className="hidden text-right tabular-nums sm:table-cell">
                    {user.completedLessons}
                  </TableCell>

                  <TableCell className="hidden text-right tabular-nums lg:table-cell">
                    {user.spent > 0 ? formatCurrency(user.spent) : "—"}
                  </TableCell>

                  <TableCell>
                    <div className="flex justify-end">
                      <UserRowActions
                        userId={user.id}
                        name={user.name}
                        role={user.role}
                        banned={user.banned}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                aria-disabled={page <= 1}
                className={
                  page <= 1 ? "pointer-events-none opacity-50" : undefined
                }
                href={buildHref(page - 1)}
              />
            </PaginationItem>

            <PaginationItem>
              <PaginationLink isActive href={buildHref(page)}>
                {page}
              </PaginationLink>
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                aria-disabled={page >= totalPages}
                className={
                  page >= totalPages
                    ? "pointer-events-none opacity-50"
                    : undefined
                }
                href={buildHref(page + 1)}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
