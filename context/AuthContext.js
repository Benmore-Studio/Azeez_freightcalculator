"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authApi, getUser, clearTokens } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = getUser();
        if (storedUser && authApi.isAuthenticated()) {
          setUser(storedUser);
          setIsAuthenticated(true);

          // Optionally verify token is still valid
          try {
            const freshUser = await authApi.getCurrentUser();
            setUser(freshUser);
          } catch {
            // Token invalid, clear auth
            clearTokens();
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error("Auth init error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    const result = await authApi.login({ email, password });
    setUser(result.user);
    setIsAuthenticated(true);
    return result;
  }, []);

  const register = useCallback(async (userData) => {
    const result = await authApi.register(userData);
    setUser(result.user);
    setIsAuthenticated(true);
    return result;
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const freshUser = await authApi.getCurrentUser();
      setUser(freshUser);
      return freshUser;
    } catch (error) {
      console.error("Failed to refresh user:", error);
      return null;
    }
  }, []);

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
