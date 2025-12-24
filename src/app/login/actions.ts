"use server";

import { redirect } from "next/navigation";
import { verifyAdminPassword, createSession } from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const password = formData.get("password") as string;

  if (!password) {
    redirect("/login?error=missing");
  }

  if (!verifyAdminPassword(password)) {
    redirect("/login?error=invalid");
  }

  await createSession();
  redirect("/admin");
}
