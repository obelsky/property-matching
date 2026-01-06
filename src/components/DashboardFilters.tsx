"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function DashboardFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const unassigned = searchParams.get("unassigned") === "true";

  const handleToggle = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (unassigned) {
      params.delete("unassigned");
    } else {
      params.set("unassigned", "true");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="card p-4 mb-6">
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={unassigned}
          onChange={handleToggle}
          className="w-5 h-5"
        />
        <span className="text-sm font-medium text-zfp-text-muted">
          Zobrazit jen bez makléře
        </span>
      </label>
    </div>
  );
}
