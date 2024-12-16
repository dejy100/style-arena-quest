import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BattleSpectatorsProps {
  battleId: string;
}

export function BattleSpectators({ battleId }: BattleSpectatorsProps) {
  const [spectatorCount, setSpectatorCount] = useState(0);

  useEffect(() => {
    const joinAsSpectator = async () => {
      try {
        const { error } = await supabase
          .from('battle_spectators')
          .insert([{ battle_id: battleId }]);

        if (error) throw error;
      } catch (error) {
        toast.error("Failed to join as spectator");
      }
    };

    joinAsSpectator();

    const channel = supabase
      .channel('battle-spectators')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'battle_spectators'
        },
        () => {
          updateSpectatorCount();
        }
      )
      .subscribe();

    const updateSpectatorCount = async () => {
      const { count } = await supabase
        .from('battle_spectators')
        .select('*', { count: 'exact', head: true })
        .eq('battle_id', battleId);
      
      setSpectatorCount(count || 0);
    };

    updateSpectatorCount();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [battleId]);

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Users className="w-4 h-4" />
      <span>{spectatorCount} watching</span>
    </div>
  );
}