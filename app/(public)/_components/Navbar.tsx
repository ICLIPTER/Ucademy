"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BookOpen,
  ChevronDown,
  Compass,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Sparkles,
  Star,
  User,
  X,
} from "lucide-react";

import Logo from "@/public/logo.png";
import { ThemeToggle } from "@/components/ui/themeToggle";
import { authClient } from "@/lib/auth-client";
import { buttonVariants, Button } from "@/components/ui/button";
import { UserDropdown } from "./UserDropdown";
import { CommandPalette, type PaletteCourse } from "./CommandPalette";
import { cn } from "@/lib/utils";
import { useSignOut } from "@/hooks/use-signout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { COURSE_CATEGORIES } from "@/lib/categories";

const navigationItems = [
  { name: "Home", href: "/" },
  { name: "Courses", href: "/courses" },
  { name: "Categories", href: "/categories" },
  { name: "Pricing", href: "/pricing" },
  { name: "About", href: "/about" },
];

export function Navbar({ courses = [] }: { courses?: PaletteCourse[] }) {
  const { data: session, isPending } = authClient.useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleSignout = useSignOut();

  const isAdmin = session?.user?.role === "admin";

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container mx-auto flex h-16 items-center gap-4 px-4 md:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image src={Logo} alt="Ucademy" className="size-8" priority />
          <span className="text-lg font-bold tracking-tight">Ucademy</span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden flex-1 items-center gap-1 lg:flex">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.name}
            </Link>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Explore
                <ChevronDown className="size-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
                Browse by category
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {COURSE_CATEGORIES.map((category) => (
                <DropdownMenuItem key={category.slug} asChild>
                  <Link href={`/courses?category=${category.slug}`}>
                    <Compass className="size-4" />
                    {category.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <CommandPalette courses={courses} />

          <ThemeToggle />

          {isPending ? (
            <div className="size-8 animate-pulse rounded-full bg-muted" />
          ) : session ? (
            <>
              {/* Learner shortcuts */}
              <div className="hidden items-center gap-1 md:flex">
                <Link
                  href="/dashboard"
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive("/dashboard")
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  My learning
                </Link>

                {isAdmin && (
                  <Link
                    href="/admin"
                    className={cn(
                      "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive("/admin")
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    Studio
                  </Link>
                )}
              </div>

              <UserDropdown
                email={session.user.email}
                image={
                  session.user.image ??
                  `https://avatar.vercel.sh/${session.user.email}`
                }
                name={
                  session.user.name && session.user.name.length > 0
                    ? session.user.name
                    : session.user.email.split("@")[0]
                }
                isAdmin={isAdmin}
                onSignOut={handleSignout}
              />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                Log in
              </Link>
              <Link
                href="/login"
                className={buttonVariants({ size: "sm" })}
              >
                Get started
              </Link>
            </>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile navigation */}
      {mobileOpen && (
        <div className="border-t bg-background lg:hidden">
          <nav className="container mx-auto flex flex-col gap-1 px-4 py-4">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {item.name}
              </Link>
            ))}

            <div className="my-2 h-px bg-border" />

            {session ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <LayoutDashboard className="size-4" />
                  My learning
                </Link>
                <Link
                  href="/dashboard/wishlist"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <Star className="size-4" />
                  Saved courses
                </Link>
                <Link
                  href="/dashboard/certificates"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <GraduationCap className="size-4" />
                  Certificates
                </Link>
                <Link
                  href="/dashboard/settings"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <Settings className="size-4" />
                  Settings
                </Link>

                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <Sparkles className="size-4" />
                    Instructor studio
                  </Link>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    handleSignout();
                  }}
                  className="flex items-center gap-2 rounded-md px-3 py-2.5 text-left text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <LogOut className="size-4" />
                  Log out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className={buttonVariants({ variant: "outline" })}
                >
                  <User className="size-4" />
                  Log in
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className={buttonVariants()}
                >
                  <BookOpen className="size-4" />
                  Get started
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
