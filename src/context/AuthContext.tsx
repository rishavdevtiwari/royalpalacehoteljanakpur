
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

// Define our user types
export type UserRole = "user" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  address?: string;
}

// Mock data for development
const MOCK_USERS = [
  {
    id: "1",
    email: "admin@hotel.com",
    password: "admin123",
    name: "Admin User",
    role: "admin" as UserRole,
    phone: "+1 (555) 123-4567",
    address: "123 Admin Street, New York, NY"
  },
  {
    id: "2",
    email: "user@example.com",
    password: "user123",
    name: "Regular User",
    role: "user" as UserRole,
    phone: "+1 (555) 987-6543",
    address: "456 User Avenue, Boston, MA"
  },
];

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  checkAuthStatus?: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("hotelUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem("hotelUser");
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const foundUser = MOCK_USERS.find(
        (u) => u.email === email && u.password === password
      );

      if (foundUser) {
        const { password, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem("hotelUser", JSON.stringify(userWithoutPassword));
        toast.success(`Welcome back, ${userWithoutPassword.name}!`);
      } else {
        toast.error("Invalid credentials. Please try again.");
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check if email already exists
      if (MOCK_USERS.some(u => u.email === email)) {
        toast.error("Email already in use.");
        throw new Error("Email already in use");
      }

      // In a real app, this would be handled by the backend
      const newUser = {
        id: (Math.floor(Math.random() * 10000) + 3).toString(),
        email,
        name,
        role: "user" as UserRole,
        phone: "",
        address: ""
      };

      setUser(newUser);
      localStorage.setItem("hotelUser", JSON.stringify(newUser));
      toast.success("Registration successful! Welcome aboard.");

      // In a real implementation, we would:
      // 1. Send a POST request to our backend
      // 2. Backend would validate data, hash the password, create the user
      // 3. Return a JWT or session token
      // 4. Store that token
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("hotelUser");
    toast.success("Logged out successfully.");
  };

  const isAdmin = user?.role === "admin";

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAdmin,
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
