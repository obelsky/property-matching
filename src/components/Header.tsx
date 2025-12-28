import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="/zfp-reality-logo.png"
              alt="ZFP Reality Logo"
              width={200}
              height={60}
              className="h-12 w-auto"
              priority
            />
          </Link>
          
          <div className="flex items-center gap-6">
            <a 
              href="https://property-matching-omega.vercel.app/poptavka"
              className="text-sm font-semibold text-gray-700 hover:text-brand-orange transition-colors"
            >
              Hledám nemovitost
            </a>
            <a 
              href="https://property-matching-omega.vercel.app/nabidka"
              className="text-sm font-semibold text-gray-700 hover:text-brand-orange transition-colors"
            >
              Nabízím nemovitost
            </a>
            <Link 
              href="/hypotecni-kalkulacka"
              className="text-sm font-semibold text-gray-700 hover:text-brand-orange transition-colors"
            >
              Hypoteční kalkulačka
            </Link>
            <Link 
              href="/login"
              className="text-sm font-semibold text-brand-orange hover:text-brand-orange-hover transition-colors"
            >
              Dashboard
            </Link>
            <a
              href="https://zfp-vendor.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-brand-orange hover:text-brand-orange-hover transition-colors flex items-center gap-1"
            >
              Vendor portál
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
