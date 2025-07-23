export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "candidate"
  organization?: string
  createdAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

// Get users from localStorage
export const getUsers = (): User[] => {
  if (typeof window === "undefined") return []
  const users = localStorage.getItem("talentpulse_users")
  return users ? JSON.parse(users) : []
}

// Save users to localStorage
export const saveUsers = (users: User[]): void => {
  if (typeof window === "undefined") return
  localStorage.setItem("talentpulse_users", JSON.stringify(users))
}

// Get current user from localStorage
export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null
  const user = localStorage.getItem("talentpulse_current_user")
  return user ? JSON.parse(user) : null
}

// Save current user to localStorage
export const saveCurrentUser = (user: User): void => {
  if (typeof window === "undefined") return
  localStorage.setItem("talentpulse_current_user", JSON.stringify(user))
}

// Remove current user from localStorage
export const removeCurrentUser = (): void => {
  if (typeof window === "undefined") return
  localStorage.removeItem("talentpulse_current_user")
}

// Register new user
export const registerUser = (userData: {
  email: string
  password: string
  name: string
  role: "admin" | "candidate"
  organization?: string
}): { success: boolean; message: string; user?: User } => {
  const users = getUsers()

  // Check if user already exists
  const existingUser = users.find((user) => user.email === userData.email)
  if (existingUser) {
    return { success: false, message: "User with this email already exists" }
  }

  // Create new user
  const newUser: User = {
    id: Date.now().toString(),
    email: userData.email,
    name: userData.name,
    role: userData.role,
    organization: userData.organization,
    createdAt: new Date().toISOString(),
  }

  // Save password separately (in real app, this would be hashed)
  const passwords = getPasswords()
  passwords[userData.email] = userData.password
  savePasswords(passwords)

  // Save user
  users.push(newUser)
  saveUsers(users)

  return { success: true, message: "Account created successfully", user: newUser }
}

// Login user
export const loginUser = (email: string, password: string): { success: boolean; message: string; user?: User } => {
  const users = getUsers()
  const passwords = getPasswords()

  const user = users.find((u) => u.email === email)
  if (!user) {
    return { success: false, message: "User not found" }
  }

  if (passwords[email] !== password) {
    return { success: false, message: "Invalid password" }
  }

  return { success: true, message: "Login successful", user }
}

// Password storage (in real app, passwords would be hashed)
const getPasswords = (): Record<string, string> => {
  if (typeof window === "undefined") return {}
  const passwords = localStorage.getItem("talentpulse_passwords")
  return passwords ? JSON.parse(passwords) : {}
}

const savePasswords = (passwords: Record<string, string>): void => {
  if (typeof window === "undefined") return
  localStorage.setItem("talentpulse_passwords", JSON.stringify(passwords))
}

// Logout user
export const logoutUser = (): void => {
  removeCurrentUser()
}
