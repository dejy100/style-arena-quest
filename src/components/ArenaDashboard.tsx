import { useState } from "react";
import { motion } from "framer-motion";
import { BattleArena } from "./battle/BattleArena";
import { UserStats } from "./dashboard/UserStats";
import { DailyChallenges } from "./dashboard/DailyChallenges";
import { QuickActions } from "./dashboard/QuickActions";
import { FriendsList } from "./social/FriendsList";
import { ChatBox } from "./social/ChatBox";
import { StyleShare } from "./social/StyleShare";
import { AvatarCustomizer } from "./customization/AvatarCustomizer";
import { StylePresets } from "./customization/StylePresets";
import { ElementFusion } from "./customization/ElementFusion";
import { WardrobeManager } from "./customization/WardrobeManager";
import { AchievementTracker } from "./achievements/AchievementTracker";
import { SeasonalEvents } from "./events/SeasonalEvents";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
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
      
      <div className="grid gap-6 md:grid-cols-2">
        <UserStats />
        <AchievementTracker />
      </div>
      
      <SeasonalEvents />
      
      <DailyChallenges />
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <AvatarCustomizer />
          <StylePresets />
        </div>
        <div className="space-y-6">
          <ElementFusion />
          <WardrobeManager />
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <StyleShare />
        <div className="space-y-6">
          <FriendsList />
          <ChatBox />
        </div>
      </div>
      
      <QuickActions setShowBattle={setShowBattle} />
    </div>
  );
}