import Link from "next/link";

interface AlertBoxProps {
  count: number;
  label: string;
  description: string;
  href: string;
  color: "red" | "orange";
}

export default function AlertBox({
  count,
  label,
  description,
  href,
  color,
}: AlertBoxProps) {
  const bgColor = color === "red" ? "bg-red-50" : "bg-orange-50";
  const borderColor = color === "red" ? "border-red-200" : "border-orange-200";
  const textColor = color === "red" ? "text-red-900" : "text-orange-900";
  const badgeColor = color === "red" ? "bg-red-500" : "bg-orange-500";

  return (
    <div className={`${bgColor} border ${borderColor} rounded-lg p-4`}>
      <div className="flex items-start gap-3">
        <div className={`${badgeColor} text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg flex-shrink-0`}>
          {count > 99 ? "99+" : count}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold ${textColor} mb-1`}>{label}</h3>
          <p className="text-sm text-zfp-text-muted mb-2">{description}</p>
          <Link
            href={href}
            className="text-sm font-semibold text-brand-orange hover:text-brand-orange-hover"
          >
            Zobrazit →
          </Link>
        </div>
      </div>
    </div>
  );
}
