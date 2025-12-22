import { loginAction } from "./actions";
import { isAuthenticated } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  // Pokud je už přihlášený, přesměruj na admin
  if (await isAuthenticated()) {
    redirect("/admin");
  }

  return (
    <div className="bg-zfp-bg-light min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Logo a nadpis */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto bg-brand-orange rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-heading font-bold text-zfp-text mb-2">
              Přihlášení do Dashboard
            </h1>
            <p className="text-gray-600 text-sm">
              Zadejte administrátorské heslo pro přístup
            </p>
          </div>

          {/* Login formulář */}
          <form action={loginAction}>
            <div className="mb-6">
              <label htmlFor="password" className="label-field">
                Heslo
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                autoFocus
                placeholder="••••••••"
                className="input-field"
              />
            </div>

            <button type="submit" className="btn-primary w-full">
              Přihlásit se
            </button>
          </form>

          {/* Info text */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Heslo je uloženo v environment variables
            </p>
          </div>
        </div>

        {/* Zpět na homepage */}
        <div className="text-center mt-6">
          
            href="/"
            className="text-sm text-brand-orange hover:text-brand-orange-hover"
          >
            ← Zpět na hlavní stránku
          </a>
        </div>
      </div>
    </div>
  );
}