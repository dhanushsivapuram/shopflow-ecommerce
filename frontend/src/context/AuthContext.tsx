import React, {
  createContext,
  useContext,
  useState,
  ReactNode
} from "react";
import API from '@/config/api';


interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // ===============================
  // 🔐 SIGNUP (REAL API)
  // ===============================
  const signup = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
     const res = await fetch(
  `${API}/api/auth/register`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, email, password })
  }
);


      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Signup failed");
      }

      // ❗ Signup success, but NOT logged in yet
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      return false;
    }
  };

  // ===============================
  // 🔑 LOGIN (REAL API + JWT)
  // ===============================
  const login = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const res = await fetch(
  `${API}/api/auth/login`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  }
);


      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // ✅ Save JWT token
      localStorage.setItem("token", data.token);

      // ✅ Save logged-in user
      setUser(data.user);

      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  // ===============================
  // 🚪 LOGOUT
  // ===============================
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ===============================
// 🧠 useAuth hook
// ===============================
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
