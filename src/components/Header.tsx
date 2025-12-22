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
          <div className="text-sm text-zfp-text">
            Součást <strong>ZFP GROUP</strong>
          </div>
        </div>
      </div>
    </header>
  );
}
