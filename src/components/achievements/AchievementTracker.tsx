import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Award, Crown } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface Achievement {
  id: string;
  title: string;
  description: string;
  progress: number;
  total: number;
  icon: any;
  unlocked: boolean;
}

export function AchievementTracker() {
  const [achievements] = useState<Achievement[]>([
    {
      id: "1",
      title: "Style Novice",
      description: "Win your first style battle",
      progress: 0,
      total: 1,
      icon: Trophy,
      unlocked: false
    },
    {
      id: "2",
      title: "Element Master",
      description: "Successfully fuse 10 elements",
      progress: 3,
      total: 10,
      icon: Star,
      unlocked: false
    },
    {
      id: "3",
      title: "Trendsetter",
      description: "Get 50 likes on your styles",
      progress: 12,
      total: 50,
      icon: Award,
      unlocked: false
    },
    {
      id: "4",
      title: "Style Icon",
      description: "Create 20 unique outfits",
      progress: 5,
      total: 20,
      icon: Crown,
      unlocked: false
    }
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {achievements.map((achievement) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <Card className={`p-4 ${achievement.unlocked ? 'bg-primary/10' : ''}`}>
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${
                    achievement.unlocked ? 'bg-primary' : 'bg-muted'
                  }`}>
                    {achievement.icon && (
                      <achievement.icon className={`h-6 w-6 ${
                        achievement.unlocked ? 'text-primary-foreground' : 'text-muted-foreground'
                      }`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{achievement.title}</h3>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    <div className="mt-2">
                      <Progress 
                        value={(achievement.progress / achievement.total) * 100} 
                        className="h-2"
                      />
                      <p className="mt-1 text-xs text-muted-foreground">
                        Progress: {achievement.progress}/{achievement.total}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}