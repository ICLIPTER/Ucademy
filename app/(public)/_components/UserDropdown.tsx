"use client";

import {
  BookOpen,
  ChevronDownIcon,
  GraduationCap,
  Home,
  LayoutDashboard,
  LogOutIcon,
  Settings,
  Sparkles,
  Star,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface iAppProps {
  name: string;
  email: string;
  image: string;
  isAdmin?: boolean;
  onSignOut: () => void;
}

export function UserDropdown({
  name,
  email,
  image,
  isAdmin = false,
  onSignOut,
}: iAppProps) {
  // Guard against an empty name — the previous implementation threw on
  // `name[0].toUpperCase()`.
  const initial = (name?.trim()?.[0] ?? email?.[0] ?? "?").toUpperCase();
  const displayName = name?.trim() || email?.split("@")[0] || "Learner";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-auto gap-2 p-0 hover:bg-transparent"
          aria-label="Account menu"
        >
          <Avatar className="size-8">
            <AvatarImage src={image} alt="" />
            <AvatarFallback>{initial}</AvatarFallback>
          </Avatar>
          <ChevronDownIcon size={16} className="opacity-60" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-60">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-medium text-foreground">
            {displayName}
          </span>
          <span className="truncate text-xs font-normal text-muted-foreground">
            {email}
          </span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/dashboard">
              <LayoutDashboard size={16} className="opacity-60" aria-hidden="true" />
              <span>My learning</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/courses">
              <BookOpen size={16} className="opacity-60" aria-hidden="true" />
              <span>Browse courses</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/wishlist">
              <Star size={16} className="opacity-60" aria-hidden="true" />
              <span>Saved courses</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/certificates">
              <GraduationCap
                size={16}
                className="opacity-60"
                aria-hidden="true"
              />
              <span>Certificates</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings">
              <Settings size={16} className="opacity-60" aria-hidden="true" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>

          {isAdmin && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/admin">
                  <Sparkles size={16} className="opacity-60" aria-hidden="true" />
                  <span>Instructor studio</span>
                </Link>
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link href="/">
              <Home size={16} className="opacity-60" aria-hidden="true" />
              <span>Homepage</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={onSignOut}>
          <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
