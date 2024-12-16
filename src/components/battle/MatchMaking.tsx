import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function MatchMaking({ onMatchFound }: { onMatchFound: (matchId: string) => void }) {
  const [isSearching, setIsSearching] = useState(false);
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    if (!isSearching) return;

    const channel = supabase.channel('matchmaking')
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const players = Object.values(state).flat();
        
        if (players.length >= 2) {
          const matchId = crypto.randomUUID();
          onMatchFound(matchId);
          setIsSearching(false);
          toast.success("Match found!");
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: crypto.randomUUID(), // Replace with actual user ID when auth is implemented
            searching: true,
            joined_at: new Date().toISOString(),
          });
        }
      });

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setIsSearching(false);
          toast.error("No match found. Please try again.");
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      supabase.removeChannel(channel);
    };
  }, [isSearching, onMatchFound]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center space-y-6 p-12"
    >
      <h2 className="text-2xl font-bold">Style Battle Matchmaking</h2>
      
      {isSearching ? (
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span>Finding opponent... ({countdown}s)</span>
          </div>
          <Button
            variant="outline"
            onClick={() => setIsSearching(false)}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <Button
          size="lg"
          onClick={() => setIsSearching(true)}
          className="px-8"
        >
          Find Match
        </Button>
      )}
    </motion.div>
  );
}