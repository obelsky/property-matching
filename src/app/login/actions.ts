"use server";

import { redirect } from "next/navigation";
import { verifyAdminPassword, createSession } from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const password = formData.get("password") as string;

  if (!password) {
    return { error: "Zadejte heslo" };
  }

  // Ověř heslo
  if (!verifyAdminPassword(password)) {
    return { error: "Nesprávné heslo" };
  }

  // Vytvoř session
  await createSession();

  // Přesměruj na admin
  redirect("/admin");
}