
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

// Define our user types
export type UserRole = "USER" | "ADMIN";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  checkAuthStatus: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API URL - will use environment variable in production or default to localhost in development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Check authentication status
  const checkAuthStatus = async (): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/auth/status`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      
      if (data.isLoggedIn && data.user) {
        setUser(data.user);
        return true;
      } else {
        setUser(null);
        return false;
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      setUser(data.user);
      toast.success(`Welcome back, ${data.user.name}!`);
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error instanceof Error ? error.message : 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      setUser(data.user);
      toast.success("Registration successful! Welcome aboard.");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error instanceof Error ? error.message : 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      
      setUser(null);
      toast.success("Logged out successfully.");
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear the user on the client side even if the logout request fails
      setUser(null);
    }
  };

  const isAdmin = user?.role === "ADMIN";

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAdmin,
    checkAuthStatus
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
