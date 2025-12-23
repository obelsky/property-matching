"use server";

import { redirect } from "next/navigation";
import { verifyAdminPassword, createSession } from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const password = formData.get("password") as string;

  if (!password) {
    // Pro jednoduchost přesměrujeme zpět s error parametrem
    redirect("/login?error=missing");
  }

  // Ověř heslo
  if (!verifyAdminPassword(password)) {
    redirect("/login?error=invalid");
  }

  // Vytvoř session
  await createSession();

  // Přesměruj na admin
  redirect("/admin");
}