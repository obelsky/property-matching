"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { RequestStatus } from "@/lib/types";

export async function updateRequestMeta(
  requestId: string,
  status: RequestStatus,
  agentId: string | null
) {
  try {
    const { error } = await supabase
      .from("requests")
      .update({
        status,
        agent_id: agentId === "" ? null : agentId,
      })
      .eq("id", requestId);

    if (error) {
      console.error("Error updating request:", error);
      return { success: false, error: "Nepodařilo se aktualizovat poptávku" };
    }

    revalidatePath(`/admin/requests/${requestId}`);
    revalidatePath("/admin");
    
    return { success: true };
  } catch (error) {
    console.error("Error in updateRequestMeta:", error);
    return { success: false, error: "Interní chyba serveru" };
  }
}
