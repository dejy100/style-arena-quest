import React from "react";
import { motion } from "framer-motion";
import { Crown } from "lucide-react";

interface BattleWinnerProps {
  winner: {
    playerName: string;
    votes: number;
  };
}

export function BattleWinner({ winner }: BattleWinnerProps) {
  return (
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
  );
}