"use client";

import * as React from "react";
import {
  IconChartBar,
  IconDashboard,
  IconHelp,
  IconHome,
  IconListDetails,
  IconSettings,
  IconUsers,
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

const navMain: NavMainItem[] = [
  { title: "Overview", url: "/admin", icon: IconDashboard },
  { title: "Courses", url: "/admin/courses", icon: IconListDetails },
  { title: "Analytics", url: "/admin/analytics", icon: IconChartBar },
  { title: "Learners", url: "/admin/users", icon: IconUsers },
  { title: "Settings", url: "/admin/settings", icon: IconSettings },
];

const navSecondary: NavSecondaryItem[] = [
  { title: "Help centre", url: "/help", icon: IconHelp },
  { title: "View platform", url: "/", icon: IconHome },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/admin">
                <Image src={Logo} alt="" className="size-5" />
                <span className="text-base font-semibold">Ucademy</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain
          items={navMain}
          isAdmin
          createHref="/admin/courses/create"
        />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
