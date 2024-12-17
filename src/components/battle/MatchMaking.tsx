import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, Users, Trophy, Timer } from "lucide-react";
import { Button } from "../ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BattleCategories, BattleCategory } from "./BattleCategories";
import { Card } from "../ui/card";
import { Progress } from "../ui/progress";

interface QueueStats {
  playersInQueue: number;
  averageWaitTime: number;
  activeMatches: number;
}

export function MatchMaking({ onMatchFound }: { onMatchFound: (matchId: string) => void }) {
  const [isSearching, setIsSearching] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [selectedCategory, setSelectedCategory] = useState<BattleCategory | null>(null);
  const [queueStats, setQueueStats] = useState<QueueStats>({
    playersInQueue: 0,
    averageWaitTime: 0,
    activeMatches: 0
  });

  useEffect(() => {
    // Simulate queue statistics updates
    const interval = setInterval(() => {
      setQueueStats(prev => ({
        playersInQueue: Math.floor(Math.random() * 10) + 1,
        averageWaitTime: Math.floor(Math.random() * 30) + 15,
        activeMatches: Math.floor(Math.random() * 5) + 1
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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
            user_id: crypto.randomUUID(),
            searching: true,
            category: selectedCategory?.id,
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
  }, [isSearching, onMatchFound, selectedCategory]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center space-y-6 p-12"
    >
      <h2 className="text-2xl font-bold">Style Battle Matchmaking</h2>
      
      <div className="grid grid-cols-3 gap-4 w-full max-w-2xl mb-8">
        <Card className="p-4 text-center">
          <Users className="w-6 h-6 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Players in Queue</p>
          <p className="text-xl font-bold">{queueStats.playersInQueue}</p>
        </Card>
        <Card className="p-4 text-center">
          <Timer className="w-6 h-6 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Avg. Wait Time</p>
          <p className="text-xl font-bold">{queueStats.averageWaitTime}s</p>
        </Card>
        <Card className="p-4 text-center">
          <Trophy className="w-6 h-6 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Active Matches</p>
          <p className="text-xl font-bold">{queueStats.activeMatches}</p>
        </Card>
      </div>
      
      {!selectedCategory ? (
        <div className="w-full max-w-2xl">
          <h3 className="text-lg font-medium mb-4">Select Battle Category</h3>
          <BattleCategories 
            onSelect={(category) => setSelectedCategory(category)}
          />
        </div>
      ) : isSearching ? (
        <div className="text-center space-y-4">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span>Finding opponent for {selectedCategory.name}...</span>
            <Progress value={(30 - countdown) / 30 * 100} className="w-64" />
            <span className="text-sm text-muted-foreground">Time remaining: {countdown}s</span>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setIsSearching(false);
              setSelectedCategory(null);
            }}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <div className="space-y-4 text-center">
          <p className="text-muted-foreground">
            Ready to battle in {selectedCategory.name}?
          </p>
          <div className="space-x-4">
            <Button
              size="lg"
              onClick={() => setIsSearching(true)}
              className="px-8"
            >
              Find Match
            </Button>
            <Button
              variant="outline"
              onClick={() => setSelectedCategory(null)}
            >
              Change Category
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}