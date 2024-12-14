import { Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

export function DailyChallenges() {
  return (
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
  );
}