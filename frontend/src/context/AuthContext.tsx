import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { AuthUser, AuthResponse } from "../api/auth";
import * as authApi from "../api/auth";
import { ApiError } from "../api/client";
import { getMe } from "../api/me";

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

function readStoredUser(): AuthUser | null {
  try {
    const stored = window.localStorage.getItem(USER_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as AuthUser;
  } catch {
    return null;
  }
}

function readStoredToken(): string | null {
  return window.localStorage.getItem(TOKEN_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(readStoredUser);
  const [token, setToken] = useState<string | null>(readStoredToken);

  useEffect(() => {
    const storedToken = readStoredToken();
    const storedUser = readStoredUser();
    if (!storedToken || !storedUser) return;

    getMe()
      .then((me) => {
        const userData = { id: me.id, email: me.email, name: me.name, createdAt: me.createdAt };
        setUser(userData);
        window.localStorage.setItem(USER_KEY, JSON.stringify(userData));
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) {
          setUser(null);
          setToken(null);
          window.localStorage.removeItem(TOKEN_KEY);
          window.localStorage.removeItem(USER_KEY);
        }
      });
  }, []);

  const handleAuthSuccess = (response: AuthResponse) => {
    setUser(response.user);
    setToken(response.token);
    window.localStorage.setItem(TOKEN_KEY, response.token);
    window.localStorage.setItem(USER_KEY, JSON.stringify(response.user));
  };

  const login = async (email: string, password: string) => {
    const res = await authApi.login({ email, password });
    handleAuthSuccess(res);
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await authApi.register({ name, email, password });
    handleAuthSuccess(res);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
  };

  const refreshUser = async () => {
    const t = window.localStorage.getItem(TOKEN_KEY);
    if (!t) return;
    try {
      const me = await getMe();
      const userData = { id: me.id, email: me.email, name: me.name, createdAt: me.createdAt };
      setUser(userData);
      window.localStorage.setItem(USER_KEY, JSON.stringify(userData));
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        logout();
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

