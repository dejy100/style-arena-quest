import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Award, Crown } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface Achievement {
  id: string;
  title: string;
  description: string;
  progress: number;
  total: number;
  icon: any;
  unlocked: boolean;
}

const iconMap: { [key: string]: any } = {
  Trophy,
  Star,
  Award,
  Crown,
};

const fetchAchievements = async () => {
  const { data: session } = await supabase.auth.getSession();
  if (!session?.session?.user) {
    return [];
  }

  const { data: achievements, error: achievementsError } = await supabase
    .from('achievements')
    .select('*');

  if (achievementsError) {
    console.error('Failed to fetch achievements:', achievementsError);
    throw new Error('Failed to fetch achievements');
  }

  const { data: userAchievements, error: userError } = await supabase
    .from('user_achievements')
    .select('*')
    .eq('user_id', session.session.user.id);

  if (userError) {
    console.error('Failed to fetch user achievements:', userError);
    throw new Error('Failed to fetch user achievements');
  }

  return achievements.map((achievement) => {
    const userAchievement = userAchievements?.find(
      (ua) => ua.achievement_id === achievement.id
    );
    
    return {
      id: achievement.id,
      title: achievement.title,
      description: achievement.description,
      progress: userAchievement?.progress || 0,
      total: achievement.total,
      icon: iconMap[achievement.icon],
      unlocked: userAchievement?.unlocked || false,
    };
  });
};

export function AchievementTracker() {
  const { data: achievements, isLoading, error } = useQuery({
    queryKey: ['achievements'],
    queryFn: fetchAchievements,
    retry: 1,
    meta: {
      errorMessage: 'Failed to fetch achievements'
    }
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Loading Achievements...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-500">
            <Trophy className="h-5 w-5" />
            Failed to load achievements
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (!achievements?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            No achievements available
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

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