'use client';

import NavBar from "@/app/components/ui/NavBar";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

interface User {
  jwt: string;
  first_name: string;
  last_name: string;
  role: string;
}

interface AuthContextType {
  user: User;
  isLoad: boolean;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<User>({ jwt: "", first_name: "", last_name: "", role: "" });
  const [isLoad, setIsLoad] = useState(true);

  const checkAuth = () => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      setUser({ jwt: "", first_name: "", last_name: "", role: "" });
    }
    setIsLoad(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const isAuthPage = pathname === '/page/login' || pathname === "/page/sign-up";

  return (
    <AuthContext.Provider value={{ user, isLoad, checkAuth }}>
      {isAuthPage ? (
        <>{children}</>
      ) : (
        <NavBar>{children}</NavBar>
      )}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};