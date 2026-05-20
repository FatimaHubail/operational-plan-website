import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import {
  fetchMe,
  login as loginApi,
  logout as logoutApi,
  type AuthUser,
  type LoginResponse,
} from "@/lib/authApi"

export type { AuthUser }

type AuthContextValue = {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<LoginResponse & { user: AuthUser }>
  logout: () => Promise<void>
  setUser: (user: AuthUser | null) => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    try {
      const { user: me } = await fetchMe()
      setUser(me)
    } catch {
      setUser(null)
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginApi(email, password)
    const nextUser: AuthUser = {
      ...result.user,
      mustChangePassword:
        result.requiresPasswordChange || Boolean(result.user.mustChangePassword),
    }
    setUser(nextUser)
    return { ...result, user: nextUser }
  }, [])

  const logout = useCallback(async () => {
    try {
      await logoutApi()
    } catch {
      /* clear client state even if request fails */
    }
    setUser(null)
  }, [])

  useEffect(() => {
    refreshUser().finally(() => setLoading(false))
  }, [refreshUser])

  const value = useMemo(
    () => ({ user, loading, login, logout, setUser, refreshUser }),
    [user, loading, login, logout, refreshUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
