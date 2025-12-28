"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChartBarIcon, LinkIcon, UsersIcon } from "@/components/Icons";
import { LeadIcon } from "@/components/mortgage/MortgageIcons";

export default function AdminNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin", label: "Dashboard", Icon: ChartBarIcon },
    { href: "/admin/matching", label: "Párování", Icon: LinkIcon },
    { href: "/admin/agents", label: "Makléři", Icon: UsersIcon },
    { href: "/admin/leads", label: "Leads", Icon: LeadIcon },
  ];

  return (
    <nav className="bg-white rounded-lg shadow-md p-4 mb-8">
      <div className="flex gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const IconComponent = item.Icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-colors
                ${
                  isActive
                    ? "bg-brand-orange text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }
              `}
            >
              <IconComponent className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
