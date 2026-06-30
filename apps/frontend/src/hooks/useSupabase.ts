import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export function useSupabase() {
    const [supabase, setSupabase] = useState(createClient(
      "https://qwhpsesytnonmvljpqzf.supabase.co",
      "sb_publishable_bfebdWejqNWIRrgkAfEvKQ_014qBpu3",
    ));
    return supabase;
}
