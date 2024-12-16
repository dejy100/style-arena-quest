import React from "react";
import { motion } from "framer-motion";
import { Crown, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface BattleOutfitCardProps {
  outfit: {
    id: string;
    playerName: string;
    votes: number;
    imageUrl: string;
  };
  totalVotes: number;
  hasVoted: boolean;
  battleEnded: boolean;
  isWinning: boolean;
  onVote: (outfitId: string) => void;
}

export function BattleOutfitCard({
  outfit,
  totalVotes,
  hasVoted,
  battleEnded,
  isWinning,
  onVote
}: BattleOutfitCardProps) {
  const getVotePercentage = (votes: number) => {
    return totalVotes === 0 ? 0 : (votes / totalVotes) * 100;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{outfit.playerName}</span>
            {isWinning && <Crown className="w-6 h-6 text-yellow-500" />}
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
            onClick={() => onVote(outfit.id)}
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
  );
}