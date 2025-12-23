"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AgentForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
    };

    try {
      const response = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Nepodařilo se přidat makléře");
      }

      // Reset formuláře a refresh
      const form = e.currentTarget;
      setTimeout(() => {
        if (form) {
          form.reset();
        }
        router.refresh();
      }, 100);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };  // ← TADY MUSÍ BÝT UZAVÍRACÍ ZÁVORKA A STŘEDNÍK!

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="label-field">
          Jméno *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="input-field"
          placeholder="Jan Novák"
        />
      </div>

      <div>
        <label htmlFor="email" className="label-field">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="input-field"
          placeholder="jan.novak@zfp.cz"
        />
      </div>

      <div>
        <label htmlFor="phone" className="label-field">
          Telefon
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          className="input-field"
          placeholder="+420 777 123 456"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Přidávám..." : "Přidat makléře"}
      </button>
    </form>
  );
}