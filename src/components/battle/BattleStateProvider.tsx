import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface BattleState {
  timeLeft: number;
  battleId: string;
  outfits: Array<{
    id: string;
    playerName: string;
    votes: number;
    imageUrl: string;
  }>;
  hasVoted: boolean;
  battleEnded: boolean;
}

interface BattleContextType extends BattleState {
  handleVote: (outfitId: string) => Promise<void>;
  getWinner: () => {
    id: string;
    playerName: string;
    votes: number;
    imageUrl: string;
  } | null;
  saveBattleHistory: () => Promise<void>;
  totalVotes: number;
}

const BattleContext = createContext<BattleContextType | null>(null);

export const useBattle = () => {
  const context = useContext(BattleContext);
  if (!context) {
    throw new Error('useBattle must be used within a BattleStateProvider');
  }
  return context;
};

export function BattleStateProvider({ children }: { children: React.ReactNode }) {
  const [timeLeft, setTimeLeft] = useState(120);
  const [battleId, setBattleId] = useState<string>("");
  const [outfits, setOutfits] = useState([
    { 
      id: "123e4567-e89b-12d3-a456-426614174000", 
      playerName: "Player 1", 
      votes: 0,
      imageUrl: "https://placehold.co/400x600/png"
    },
    { 
      id: "123e4567-e89b-12d3-a456-426614174001", 
      playerName: "Player 2", 
      votes: 0,
      imageUrl: "https://placehold.co/400x600/png"
    },
  ]);
  const [hasVoted, setHasVoted] = useState(false);
  const [battleEnded, setBattleEnded] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      setBattleEnded(true);
      saveBattleHistory();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    const channel = supabase
      .channel('battle-votes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'reactions'
        },
        (payload) => {
          const { style_id } = payload.new;
          setOutfits(currentOutfits =>
            currentOutfits.map(outfit =>
              outfit.id === style_id
                ? { ...outfit, votes: outfit.votes + 1 }
                : outfit
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleVote = async (outfitId: string) => {
    if (hasVoted) {
      toast.error("You've already voted!");
      return;
    }

    if (battleEnded) {
      toast.error("The battle has ended!");
      return;
    }

    try {
      const { error } = await supabase
        .from('reactions')
        .insert([
          { style_id: outfitId, type: 'vote' }
        ]);

      if (error) throw error;

      setHasVoted(true);
      toast.success("Vote submitted!");
    } catch (error) {
      toast.error("Failed to submit vote");
    }
  };

  const getWinner = () => {
    if (!battleEnded) return null;
    const maxVotes = Math.max(...outfits.map(o => o.votes));
    return outfits.find(o => o.votes === maxVotes) || null;
  };

  const saveBattleHistory = async () => {
    const winner = getWinner();
    if (!winner) return;

    const loser = outfits.find(o => o.id !== winner.id);
    if (!loser) return;

    try {
      const { error } = await supabase
        .from('battle_history')
        .insert([{
          winner_id: winner.id,
          loser_id: loser.id,
          winner_votes: winner.votes,
          loser_votes: loser.votes,
          battle_duration: 120 - timeLeft
        }]);

      if (error) throw error;
    } catch (error) {
      console.error("Failed to save battle history:", error);
    }
  };

  const totalVotes = outfits.reduce((sum, outfit) => sum + outfit.votes, 0);

  const value = {
    timeLeft,
    battleId,
    outfits,
    hasVoted,
    battleEnded,
    handleVote,
    getWinner,
    saveBattleHistory,
    totalVotes
  };

  return (
    <BattleContext.Provider value={value}>
      {children}
    </BattleContext.Provider>
  );
}