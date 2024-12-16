import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, ThumbsUp, Star, Sparkles, Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const emotes = [
  { type: "heart", icon: Heart, color: "text-red-500" },
  { type: "like", icon: ThumbsUp, color: "text-blue-500" },
  { type: "star", icon: Star, color: "text-yellow-500" },
  { type: "sparkle", icon: Sparkles, color: "text-purple-500" },
  { type: "trophy", icon: Trophy, color: "text-green-500" },
];

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
        {emotes.map(({ type, icon: Icon, color }) => (
          <motion.button
            key={type}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`p-2 rounded-full hover:bg-white/20 ${color}`}
            onClick={() => sendEmote(type)}
          >
            <Icon className="w-6 h-6" />
          </motion.button>
        ))}
      </div>
      
      <div className="flex gap-2 justify-end">
        {recentEmotes.map((emote) => {
          const EmoteIcon = emotes.find(e => e.type === emote.emote_type)?.icon || Heart;
          const color = emotes.find(e => e.type === emote.emote_type)?.color || "text-red-500";
          
          return (
            <motion.div
              key={emote.id}
              initial={{ scale: 0, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0, y: 20 }}
              className={`${color}`}
            >
              <EmoteIcon className="w-6 h-6" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}