"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: "📊" },
    { href: "/admin/matching", label: "Párování", icon: "🔗" },
  ];

  return (
    <nav className="bg-white rounded-lg shadow-md p-4 mb-8">
      <div className="flex gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                px-4 py-2 rounded-lg font-semibold text-sm transition-colors
                ${
                  isActive
                    ? "bg-brand-orange text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }
              `}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
