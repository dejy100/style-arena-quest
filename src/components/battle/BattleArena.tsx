import React, { useState } from "react";
import { motion } from "framer-motion";
import { Timer, Crown, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { toast } from "sonner";

interface Outfit {
  id: string;
  playerName: string;
  votes: number;
}

export function BattleArena() {
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
  const [outfits, setOutfits] = useState<Outfit[]>([
    { id: "1", playerName: "Player 1", votes: 0 },
    { id: "2", playerName: "Player 2", votes: 0 },
  ]);
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = (outfitId: string) => {
    if (hasVoted) {
      toast.error("You've already voted!");
      return;
    }

    setOutfits(outfits.map(outfit => 
      outfit.id === outfitId 
        ? { ...outfit, votes: outfit.votes + 1 }
        : outfit
    ));
    setHasVoted(true);
    toast.success("Vote submitted!");
  };

  // Calculate total votes and percentages
  const totalVotes = outfits.reduce((sum, outfit) => sum + outfit.votes, 0);
  const getVotePercentage = (votes: number) => {
    return totalVotes === 0 ? 0 : (votes / totalVotes) * 100;
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold mb-2">Style Battle</h1>
        <div className="flex items-center justify-center gap-2 text-xl">
          <Timer className="w-6 h-6" />
          <span>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
        </div>
      </motion.div>

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
                {/* Placeholder for outfit image */}
                <div className="bg-gray-200 aspect-square rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">Outfit Preview</span>
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
                  disabled={hasVoted}
                  className="w-full"
                  variant={hasVoted ? "secondary" : "default"}
                >
                  {hasVoted ? (
                    <ThumbsDown className="mr-2 h-4 w-4" />
                  ) : (
                    <ThumbsUp className="mr-2 h-4 w-4" />
                  )}
                  Vote
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}