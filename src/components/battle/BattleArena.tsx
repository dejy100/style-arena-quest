import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Timer, Crown, ThumbsUp, ThumbsDown, ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { MatchMaking } from "./MatchMaking";

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

  // Timer countdown effect
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

  // Subscribe to real-time updates for votes
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

  // Calculate total votes and percentages
  const totalVotes = outfits.reduce((sum, outfit) => sum + outfit.votes, 0);
  const getVotePercentage = (votes: number) => {
    return totalVotes === 0 ? 0 : (votes / totalVotes) * 100;
  };

  // Find the winner
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
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowMatchmaking(true)}
          className="absolute left-4 top-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Leave Battle
        </Button>
        <h1 className="text-4xl font-bold mb-2">Style Battle</h1>
        <div className="flex items-center justify-center gap-2 text-xl">
          <Timer className="w-6 h-6" />
          <span>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
        </div>
      </motion.div>

      {battleEnded && winner && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-4 bg-yellow-100 rounded-lg"
        >
          <h2 className="text-2xl font-bold text-yellow-800 flex items-center justify-center gap-2">
            <Crown className="w-8 h-8 text-yellow-500" />
            {winner.playerName} Wins!
          </h2>
          <p className="text-yellow-700 mt-2">With {winner.votes} votes</p>
        </motion.div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {outfits.map((outfit) => (
          <motion.div
            key={outfit.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{outfit.playerName}</span>
                  {outfit.votes > 0 && outfit.votes === Math.max(...outfits.map(o => o.votes)) && (
                    <Crown className="w-6 h-6 text-yellow-500" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-[2/3] rounded-lg overflow-hidden">
                  <img 
                    src={outfit.imageUrl} 
                    alt={`${outfit.playerName}'s outfit`}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Votes</span>
                    <span>{outfit.votes}</span>
                  </div>
                  <Progress value={getVotePercentage(outfit.votes)} />
                </div>

                <Button 
                  onClick={() => handleVote(outfit.id)}
                  disabled={hasVoted || battleEnded}
                  className="w-full"
                  variant={hasVoted || battleEnded ? "secondary" : "default"}
                >
                  {hasVoted ? (
                    <ThumbsDown className="mr-2 h-4 w-4" />
                  ) : (
                    <ThumbsUp className="mr-2 h-4 w-4" />
                  )}
                  {battleEnded ? "Battle Ended" : "Vote"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}