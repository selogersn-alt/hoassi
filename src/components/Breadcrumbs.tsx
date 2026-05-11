"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

export default function Breadcrumbs() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  const paths = pathname.split("/").filter((path) => path !== "");

  return (
    <nav className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-slate-400 mb-8 overflow-x-auto no-scrollbar py-2">
      <Link href="/" className="flex items-center hover:text-primary transition-colors flex-shrink-0">
        <Home className="w-3 h-3 mr-1" />
        ACCUEIL
      </Link>
      
      {paths.map((path, index) => {
        const href = `/${paths.slice(0, index + 1).join("/")}`;
        const isLast = index === paths.length - 1;
        const label = path.replace(/-/g, " ");

        return (
          <div key={path} className="flex items-center space-x-2 flex-shrink-0">
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <Link 
              href={href} 
              className={`hover:text-primary transition-colors ${isLast ? "text-slate-900 pointer-events-none" : ""}`}
            >
              {label}
            </Link>
          </div>
        );
      })}
    </nav>
  );
}
