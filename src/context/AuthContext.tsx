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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<User>({ jwt: "", first_name: "", last_name: "", role: "" });
  const [isLoad, setIsLoad] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setIsLoad(false);
  }, []);

  const isAuthPage = pathname === '/page/login' || pathname === "/page/sign-up";

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <AuthContext.Provider value={{ user, isLoad }}>
      <NavBar>{children}</NavBar>
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