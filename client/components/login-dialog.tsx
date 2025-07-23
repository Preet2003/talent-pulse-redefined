"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserCheck, Users, ArrowRight, Mail, Lock, User, Building, Loader2 } from "lucide-react"
import { registerUser, loginUser } from "@/lib/auth"
import { useAuth } from "@/hooks/use-auth"

interface LoginDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  const [selectedRole, setSelectedRole] = useState<"admin" | "candidate" | null>(null)
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")
  const { login } = useAuth()
  const router = useRouter()

  // Reset dialog state when it closes
  useEffect(() => {
    if (!open) {
      setSelectedRole(null)
      setAuthMode("login")
    }
  }, [open])

  const handleRoleSelect = (role: "admin" | "candidate") => {
    setSelectedRole(role)
  }

  const handleBack = () => {
    setSelectedRole(null)
    setAuthMode("login")
  }

  const handleAuthModeChange = (mode: "login" | "signup") => {
    setAuthMode(mode)
  }

  const handleAuthSuccess = (user: any) => {
    login(user)
    onOpenChange(false)

    // Navigate to appropriate dashboard
    if (user.role === "admin") {
      router.push("/admin/dashboard")
    } else {
      router.push("/candidate/dashboard")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`${!selectedRole ? "sm:max-w-2xl max-h-[85vh]" : "sm:max-w-md max-h-[80vh]"} overflow-y-auto`}
      >
        {!selectedRole ? (
          <RoleSelection onRoleSelect={handleRoleSelect} />
        ) : (
          <AuthForm
            role={selectedRole}
            mode={authMode}
            onBack={handleBack}
            onModeChange={handleAuthModeChange}
            onAuthSuccess={handleAuthSuccess}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

function RoleSelection({ onRoleSelect }: { onRoleSelect: (role: "admin" | "candidate") => void }) {
  return (
    <>
      <DialogHeader className="text-center pb-4">
        <DialogTitle className="text-xl font-bold">Welcome to TalentPulse</DialogTitle>
        <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">Choose your role to get started</p>
      </DialogHeader>

      <div className="grid md:grid-cols-2 gap-4 py-2">
        <Card
          className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-blue-500 group h-full"
          onClick={() => onRoleSelect("admin")}
        >
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
              <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-xl mb-2">Admin / Organization</CardTitle>
            <CardDescription className="text-sm leading-relaxed">
              Create and manage assessments, monitor candidates, and view detailed analytics
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
              <span className="text-sm font-medium">Continue as Admin</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-green-500 group h-full"
          onClick={() => onRoleSelect("candidate")}
        >
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
              <UserCheck className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-xl mb-2">Candidate</CardTitle>
            <CardDescription className="text-sm leading-relaxed">
              Take skill assessments and view your results in a secure, proctored environment
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-center text-green-600 dark:text-green-400 group-hover:translate-x-1 transition-transform">
              <span className="text-sm font-medium">Continue as Candidate</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

function AuthForm({
  role,
  mode,
  onBack,
  onModeChange,
  onAuthSuccess,
}: {
  role: "admin" | "candidate"
  mode: "login" | "signup"
  onBack: () => void
  onModeChange: (mode: "login" | "signup") => void
  onAuthSuccess: (user: any) => void
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    organization: "",
  })

  const isAdmin = role === "admin"
  const isLogin = mode === "login"

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("") // Clear error when user types
  }

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError("Email and password are required")
      return false
    }

    if (!isLogin) {
      if (!formData.name) {
        setError("Name is required")
        return false
      }
      if (isAdmin && !formData.organization) {
        setError("Organization is required for admin accounts")
        return false
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match")
        return false
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters long")
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    setError("")

    try {
      if (isLogin) {
        const result = loginUser(formData.email, formData.password)
        if (result.success && result.user) {
          // Check if user role matches selected role
          if (result.user.role !== role) {
            setError(`This account is registered as ${result.user.role}, not ${role}`)
            setIsLoading(false)
            return
          }
          onAuthSuccess(result.user)
        } else {
          setError(result.message)
        }
      } else {
        const result = registerUser({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          role: role,
          organization: isAdmin ? formData.organization : undefined,
        })
        if (result.success && result.user) {
          onAuthSuccess(result.user)
        } else {
          setError(result.message)
        }
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <DialogHeader>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-1">
            <ArrowRight className="h-4 w-4 rotate-180" />
          </Button>
          <div className="flex items-center space-x-2">
            {isAdmin ? (
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            ) : (
              <UserCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
            )}
            <DialogTitle className="text-xl">
              {isLogin ? "Login" : "Sign Up"} as {isAdmin ? "Admin" : "Candidate"}
            </DialogTitle>
          </div>
        </div>
      </DialogHeader>

      <Tabs value={mode} onValueChange={(value) => onModeChange(value as "login" | "signup")} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>

        <form onSubmit={handleSubmit}>
          <TabsContent value="login" className="space-y-3 mt-4">
            <div className="space-y-3">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  `Login as ${isAdmin ? "Admin" : "Candidate"}`
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="signup" className="space-y-3 mt-4">
            <div className="space-y-3">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    className="pl-10"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {isAdmin && (
                <div className="space-y-2">
                  <Label htmlFor="organization">Organization</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="organization"
                      placeholder="Enter your organization name"
                      className="pl-10"
                      value={formData.organization}
                      onChange={(e) => handleInputChange("organization", e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password"
                    className="pl-10"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm your password"
                    className="pl-10"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  `Create ${isAdmin ? "Admin" : "Candidate"} Account`
                )}
              </Button>

              <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                By signing up, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </TabsContent>
        </form>
      </Tabs>
    </>
  )
}
