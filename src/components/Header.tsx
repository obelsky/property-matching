"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-zfp-dark border-b border-zfp-border sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/zfp-reality-logo.png"
              alt="ZFP Reality Logo"
              width={180}
              height={54}
              className="h-10 w-auto"
              priority
            />
          </Link>
          
          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-8">
            <a 
              href="https://property-matching-omega.vercel.app/poptavka"
              className="text-sm font-medium text-zfp-text-muted hover:text-brand-gold transition-colors duration-300"
            >
              Hledám nemovitost
            </a>
            <a 
              href="https://property-matching-omega.vercel.app/nabidka"
              className="text-sm font-medium text-zfp-text-muted hover:text-brand-gold transition-colors duration-300"
            >
              Nabízím nemovitost
            </a>
            <Link 
              href="/hypotecni-kalkulacka"
              className="text-sm font-medium text-zfp-text-muted hover:text-brand-gold transition-colors duration-300"
            >
              Kalkulačka
            </Link>
            <Link 
              href="/login"
              className="btn-primary !py-2 !px-6 !text-xs"
            >
              Dashboard
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-zfp-text-muted hover:text-zfp-text transition-colors"
            aria-label="Menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pt-4 border-t border-zfp-border">
            <div className="flex flex-col gap-4">
              <a 
                href="https://property-matching-omega.vercel.app/poptavka"
                className="text-zfp-text-muted hover:text-brand-gold transition-colors py-2"
              >
                Hledám nemovitost
              </a>
              <a 
                href="https://property-matching-omega.vercel.app/nabidka"
                className="text-zfp-text-muted hover:text-brand-gold transition-colors py-2"
              >
                Nabízím nemovitost
              </a>
              <Link 
                href="/hypotecni-kalkulacka"
                className="text-zfp-text-muted hover:text-brand-gold transition-colors py-2"
              >
                Hypoteční kalkulačka
              </Link>
              <Link 
                href="/login"
                className="btn-primary text-center mt-2"
              >
                Dashboard
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
