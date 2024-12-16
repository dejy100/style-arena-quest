import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Star, Crown } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface BattleRewardsProps {
  points: number;
  rank?: number;
  isWinner: boolean;
}

export function BattleRewards({ points, rank = 1, isWinner }: BattleRewardsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-600/10" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isWinner ? (
              <Crown className="h-5 w-5 text-yellow-500" />
            ) : (
              <Trophy className="h-5 w-5 text-gray-500" />
            )}
            Battle Rewards
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Points Earned</span>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="font-bold">{points}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Final Rank</span>
            <span className="font-bold">#{rank}</span>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-2 rounded-md font-medium"
            onClick={() => toast.success("Rewards claimed!")}
          >
            Claim Rewards
          </motion.button>
        </CardContent>
      </Card>
    </motion.div>
  );
}