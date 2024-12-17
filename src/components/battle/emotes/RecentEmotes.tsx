import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { emotes } from "./emoteConfig";

interface RecentEmotesProps {
  recentEmotes: Array<{
    id: string;
    emote_type: string;
  }>;
}

export function RecentEmotes({ recentEmotes }: RecentEmotesProps) {
  return (
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
  );
}