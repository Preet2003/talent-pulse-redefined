"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, Settings, LogOut } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useState } from "react"
import { ProfileModal } from "@/components/profile-modal"

export function AdminHeader({ onSettingsClick }: { onSettingsClick?: () => void }) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [profileDefaultTab, setProfileDefaultTab] = useState("personal")

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleProfileClick = () => {
    setProfileDefaultTab("personal")
    setShowProfileModal(true)
  }

  const handleSettingsClick = () => {
    setProfileDefaultTab("preferences")
    setShowProfileModal(true)
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10 bg-blue-600">
                <AvatarFallback className="bg-blue-600 text-white font-semibold">
                  {user ? getInitials(user.name) : "AD"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64" align="end" forceMount>
            <div className="px-3 py-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">Signed in as</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.email || "john.doe@example.com"}
              </p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={handleProfileClick}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={handleSettingsClick}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ProfileModal open={showProfileModal} onOpenChange={setShowProfileModal} defaultTab={profileDefaultTab} />
    </header>
  )
}
