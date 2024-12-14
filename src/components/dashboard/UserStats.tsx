import { Trophy, Medal, ChartBar, Flame } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function UserStats() {
  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid gap-4 md:grid-cols-4"
    >
      <motion.div variants={item}>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <p className="text-sm font-medium">Rank</p>
              </div>
              <p className="text-2xl font-bold">#42</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div variants={item}>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Medal className="h-4 w-4 text-blue-500" />
                <p className="text-sm font-medium">Wins</p>
              </div>
              <p className="text-2xl font-bold">24</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div variants={item}>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ChartBar className="h-4 w-4 text-green-500" />
                <p className="text-sm font-medium">Win Rate</p>
              </div>
              <p className="text-2xl font-bold">68%</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div variants={item}>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Flame className="h-4 w-4 text-red-500" />
                <p className="text-sm font-medium">Streak</p>
              </div>
              <p className="text-2xl font-bold">5</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}