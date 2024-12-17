import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { EmoteButton } from "./emotes/EmoteButton";
import { RecentEmotes } from "./emotes/RecentEmotes";
import { emotes } from "./emotes/emoteConfig";

interface BattleEmotesProps {
  battleId: string;
}

export function BattleEmotes({ battleId }: BattleEmotesProps) {
  const [recentEmotes, setRecentEmotes] = useState<Array<{
    id: string;
    emote_type: string;
  }>>([]);

  useEffect(() => {
    const channel = supabase
      .channel('battle-emotes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'battle_emotes'
        },
        (payload) => {
          setRecentEmotes(current => [...current, payload.new as any].slice(-5));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const sendEmote = async (type: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to send emotes");
        return;
      }

      const { error } = await supabase
        .from('battle_emotes')
        .insert([
          { 
            battle_id: battleId, 
            emote_type: type,
            user_id: user.id
          }
        ]);

      if (error) throw error;
    } catch (error) {
      toast.error("Failed to send emote");
    }
  };

  return (
    <div className="fixed bottom-4 right-4 space-y-4">
      <div className="flex flex-col gap-2 bg-white/10 backdrop-blur-sm p-2 rounded-full">
        {emotes.map((emote) => (
          <EmoteButton
            key={emote.type}
            type={emote.type}
            icon={emote.icon}
            color={emote.color}
            onSend={sendEmote}
          />
        ))}
      </div>
      
      <RecentEmotes recentEmotes={recentEmotes} />
    </div>
  );
}