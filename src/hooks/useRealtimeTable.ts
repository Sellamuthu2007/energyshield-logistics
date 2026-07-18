import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

export function useRealtimeTable(table: string, queryKey: string[]) {
  const queryClient = useQueryClient();

  useEffect(() => {
    // If the client url is a placeholder, skip setting up real subscriptions to avoid console noise
    if (import.meta.env.VITE_SUPABASE_URL === 'https://placeholder-url.supabase.co' || !import.meta.env.VITE_SUPABASE_URL) {
      return;
    }

    const channel = supabase
      .channel(`realtime:${table}`)
      .on("postgres_changes", { event: "*", schema: "public", table }, () => {
        queryClient.invalidateQueries({ queryKey });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, queryClient, queryKey]);
}
export default useRealtimeTable;
