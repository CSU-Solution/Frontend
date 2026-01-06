"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileText, Plus, Globe, HelpCircle, Settings, User } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Create", icon: Plus, href: "/" },
  { name: "Results", icon: Globe, href: "/results" },
  { name: "Dashboard", icon: FileText, href: "/dashboard" },
]

const bottomNavigation = [
  { name: "Help", icon: HelpCircle, href: "#" },
  { name: "Settings", icon: Settings, href: "#" },
  { name: "Profile", icon: User, href: "#" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="fixed left-0 top-0 h-screen w-16 bg-white border-r border-border flex flex-col items-center py-4 z-50">
      <div className="mb-8">
        <div className="w-10 h-10 bg-foreground rounded-lg flex items-center justify-center text-background font-bold text-sm">
          K
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
              title={item.name}
            >
              <item.icon className="w-5 h-5" />
            </Link>
          )
        })}
      </nav>

      <div className="flex flex-col gap-4">
        {bottomNavigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="w-10 h-10 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title={item.name}
          >
            <item.icon className="w-5 h-5" />
          </Link>
        ))}
      </div>
    </div>
  )
}
