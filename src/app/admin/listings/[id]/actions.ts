"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { ListingStatus } from "@/lib/types";

export async function updateListingMeta(
  listingId: string,
  status: ListingStatus,
  agentId: string | null
) {
  try {
    const { error } = await supabase
      .from("listings")
      .update({
        status,
        agent_id: agentId === "" ? null : agentId,
      })
      .eq("id", listingId);

    if (error) {
      console.error("Error updating listing:", error);
      return { success: false, error: "Nepodařilo se aktualizovat nabídku" };
    }

    revalidatePath(`/admin/listings/${listingId}`);
    revalidatePath("/admin");
    
    return { success: true };
  } catch (error) {
    console.error("Error in updateListingMeta:", error);
    return { success: false, error: "Interní chyba serveru" };
  }
}
