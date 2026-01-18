'use client';

import NavBar from "@/app/components/ui/NavBar";
import { usePathname, useRouter } from "next/navigation";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // const pathname = window.location.pathname
  const isLoginPage = pathname === '/page/login';
  
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div>
      <NavBar>{children}</NavBar>
    </div>
  );
}