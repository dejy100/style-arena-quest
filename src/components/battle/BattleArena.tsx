import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { MatchMaking } from "./MatchMaking";
import { BattleHeader } from "./BattleHeader";
import { BattleWinner } from "./BattleWinner";
import { BattleOutfitCard } from "./BattleOutfitCard";
import { BattleRewards } from "./BattleRewards";

interface Outfit {
  id: string;
  playerName: string;
  votes: number;
  imageUrl: string;
}

export function BattleArena() {
  const [showMatchmaking, setShowMatchmaking] = useState(true);
  const [timeLeft, setTimeLeft] = useState(120);
  const [outfits, setOutfits] = useState<Outfit[]>([
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

  const handleMatchFound = (matchId: string) => {
    console.log("Match found:", matchId);
    setShowMatchmaking(false);
  };

  const totalVotes = outfits.reduce((sum, outfit) => sum + outfit.votes, 0);
  
  const getWinner = () => {
    if (!battleEnded) return null;
    const maxVotes = Math.max(...outfits.map(o => o.votes));
    return outfits.find(o => o.votes === maxVotes);
  };

  const winner = getWinner();

  if (showMatchmaking) {
    return <MatchMaking onMatchFound={handleMatchFound} />;
  }

  return (
    <div className="p-6 space-y-6">
      <BattleHeader 
        timeLeft={timeLeft}
        onLeave={() => setShowMatchmaking(true)}
      />

      {battleEnded && winner && <BattleWinner winner={winner} />}

      <div className="grid md:grid-cols-2 gap-6">
        {outfits.map((outfit) => (
          <BattleOutfitCard
            key={outfit.id}
            outfit={outfit}
            totalVotes={totalVotes}
            hasVoted={hasVoted}
            battleEnded={battleEnded}
            isWinning={outfit.votes > 0 && outfit.votes === Math.max(...outfits.map(o => o.votes))}
            onVote={handleVote}
          />
        ))}
      </div>

      {battleEnded && winner && (
        <BattleRewards
          points={100}
          rank={1}
          isWinner={true}
        />
      )}
    </div>
  );
}