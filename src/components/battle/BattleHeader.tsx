import React from "react";
import { motion } from "framer-motion";
import { Timer, ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";

interface BattleHeaderProps {
  timeLeft: number;
  onLeave: () => void;
}

export function BattleHeader({ timeLeft, onLeave }: BattleHeaderProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center"
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={onLeave}
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
  );
}