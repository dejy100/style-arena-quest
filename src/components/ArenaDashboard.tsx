import { Trophy, Gamepad, Calendar, Target, Flame, Medal, ChartBar } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { motion } from "framer-motion";
import { BattleArena } from "./battle/BattleArena";
import { useState } from "react";
import { FriendsList } from "./social/FriendsList";
import { ChatBox } from "./social/ChatBox";
import { toast } from "sonner";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function ArenaDashboard() {
  const [showBattle, setShowBattle] = useState(false);

  if (showBattle) {
    return <BattleArena />;
  }

  return (
    <div className="space-y-8 p-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold">Style Arena</h1>
        <p className="mt-2 text-muted-foreground">Ready to showcase your style?</p>
      </motion.div>
      
      {/* User Stats Section */}
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

      {/* Daily Challenges Section */}
      <motion.div variants={container} initial="hidden" animate="show">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Daily Challenges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Win 3 Style Battles</p>
                  <p className="text-sm text-muted-foreground">Progress: 1/3</p>
                </div>
                <Progress value={33} className="w-[100px]" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Create 5 Unique Outfits</p>
                  <p className="text-sm text-muted-foreground">Progress: 3/5</p>
                </div>
                <Progress value={60} className="w-[100px]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Social Features Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <FriendsList />
        <ChatBox />
      </div>
      
      {/* Quick Actions */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        <motion.div variants={item}>
          <Card className="p-6">
            <div className="flex flex-col items-center gap-4">
              <Gamepad size={32} className="text-primary" />
              <h2 className="text-xl font-semibold">Quick Battle</h2>
              <Button 
                className="w-full"
                onClick={() => {
                  setShowBattle(true);
                  toast.success("Entering battle arena!");
                }}
              >
                Start Battle
                <Badge variant="secondary" className="ml-2">2min</Badge>
              </Button>
            </div>
          </Card>
        </motion.div>
        
        <motion.div variants={item}>
          <Card className="p-6">
            <div className="flex flex-col items-center gap-4">
              <Trophy size={32} className="text-yellow-500" />
              <h2 className="text-xl font-semibold">Tournament</h2>
              <Button variant="outline" className="w-full">
                Join Now
                <Badge variant="secondary" className="ml-2">8 slots</Badge>
              </Button>
            </div>
          </Card>
        </motion.div>
        
        <motion.div variants={item}>
          <Card className="p-6">
            <div className="flex flex-col items-center gap-4">
              <Calendar size={32} className="text-blue-500" />
              <h2 className="text-xl font-semibold">Events</h2>
              <Button variant="outline" className="w-full">
                View Schedule
                <Badge variant="secondary" className="ml-2">3 new</Badge>
              </Button>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
