"use client";

import { IconCirclePlusFilled, type Icon } from "@tabler/icons-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export type NavMainItem = {
  title: string;
  url: string;
  icon?: Icon;
  /** Shown as a small badge, e.g. a count. */
  badge?: string | number;
  /** When set, the item is only shown to administrators. */
  adminOnly?: boolean;
};

export function NavMain({
  items,
  isAdmin = false,
  createHref,
}: {
  items: NavMainItem[];
  isAdmin?: boolean;
  createHref?: string;
}) {
  const pathname = usePathname();

  /** A parent route stays highlighted while a child route is active. */
  const isActive = (url: string) =>
    url === "/" ? pathname === "/" : pathname === url || pathname.startsWith(`${url}/`);

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        {createHref && (
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center gap-2">
              <SidebarMenuButton
                asChild
                tooltip="Create a new course"
                className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
              >
                <Link href={createHref}>
                  <IconCirclePlusFilled />
                  <span>Create course</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}

        <SidebarMenu>
          {items
            .filter((item) => !item.adminOnly || isAdmin)
            .map((item) => {
              const active = isActive(item.url);

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton tooltip={item.title} asChild isActive={active}>
                    <Link
                      href={item.url}
                      className={cn(active && "bg-primary/10 text-primary")}
                    >
                      {item.icon && (
                        <item.icon
                          className={cn(active && "text-primary")}
                        />
                      )}
                      <span>{item.title}</span>
                      {item.badge !== undefined && (
                        <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
