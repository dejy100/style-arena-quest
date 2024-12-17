import { useState } from "react";
import { Gamepad, Trophy, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { TournamentView } from "../tournament/TournamentView";

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

interface QuickActionsProps {
  setShowBattle: (show: boolean) => void;
}

export function QuickActions({ setShowBattle }: QuickActionsProps) {
  const [showTournament, setShowTournament] = useState(false);

  if (showTournament) {
    return <TournamentView onBack={() => setShowTournament(false)} />;
  }

  return (
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
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowTournament(true)}
            >
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
  );
}