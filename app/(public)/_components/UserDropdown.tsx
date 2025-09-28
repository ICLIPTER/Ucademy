import {
  BookOpen,
  ChevronDownIcon,
  Home,
  LayoutDashboard,
  LogOutIcon,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useSignOut } from "@/hooks/use-signout"

interface iAppProps {
    name: string;
    email: string;
    image: string;
   
}

export function UserDropdown({ name, email, image }: iAppProps) {
  const handleSignout = useSignOut();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <Avatar>
            <AvatarImage src={image} alt="Profile image" />
            <AvatarFallback>{name[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <ChevronDownIcon
            size={16}
            className="opacity-60"
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-w-64">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="text-foreground truncate text-sm font-medium">
            {name}
          </span>
          <span className="text-muted-foreground truncate text-xs font-normal">
            {email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/">
            <Home size={16} className="opacity-60" aria-hidden="true" />
            <span>Home</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/courses">
            <BookOpen size={16} className="opacity-60" aria-hidden="true" />
            <span>Courses</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/Dashboard">
            <LayoutDashboard size={16} className="opacity-60" aria-hidden="true" />
            <span>Dashboard</span>
            </Link>  
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
  
        <DropdownMenuItem onClick={handleSignout}>
          <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
