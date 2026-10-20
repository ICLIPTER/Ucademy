"use client";

import * as React from "react";
import {
  IconBook2,
  IconCertificate,
  IconDashboard,
  IconHelp,
  IconHome,
  IconSettings,
  IconStar,
  IconTopologyStar3,
} from "@tabler/icons-react";

import Logo from "@/public/logo.png";
import { NavMain, type NavMainItem } from "@/components/sidebar/nav-main";
import { NavSecondary, type NavSecondaryItem } from "@/components/sidebar/nav-secondary";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navMain: NavMainItem[] = [
  { title: "Overview", url: "/dashboard", icon: IconDashboard },
  { title: "Certificates", url: "/dashboard/certificates", icon: IconCertificate },
  { title: "Saved courses", url: "/dashboard/wishlist", icon: IconStar },
  { title: "Browse courses", url: "/courses", icon: IconBook2 },
  { title: "Settings", url: "/dashboard/settings", icon: IconSettings },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  const navSecondary: NavSecondaryItem[] = [
    { title: "Help centre", url: "/help", icon: IconHelp },
    { title: "Homepage", url: "/", icon: IconHome },
    ...(isAdmin
      ? [
          {
            title: "Instructor studio",
            url: "/admin",
            icon: IconTopologyStar3,
          },
        ]
      : []),
  ];

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/dashboard">
                <Image src={Logo} alt="" className="size-5" />
                <span className="text-base font-semibold">Ucademy</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navMain} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
