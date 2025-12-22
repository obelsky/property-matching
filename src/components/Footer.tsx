import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-zfp-text text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">© 2025 ZFP Reality. Všechna práva vyhrazena.</p>
          </div>
          <div className="flex items-center">
            <Image
              src="/zfp-reality-logo.png"
              alt="ZFP GROUP Logo"
              width={150}
              height={45}
              className="h-10 w-auto brightness-0 invert"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
