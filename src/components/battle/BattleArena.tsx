import React, { useState } from "react";
import { MatchMaking } from "./MatchMaking";
import { BattleStateProvider } from "./BattleStateProvider";
import { BattleLayout } from "./BattleLayout";

export function BattleArena() {
  const [showMatchmaking, setShowMatchmaking] = useState(true);
  const [battleId, setBattleId] = useState<string>("");

  const handleMatchFound = (matchId: string) => {
    console.log("Match found:", matchId);
    setBattleId(matchId);
    setShowMatchmaking(false);
  };

  if (showMatchmaking) {
    return <MatchMaking onMatchFound={handleMatchFound} />;
  }

  return (
    <BattleStateProvider>
      <BattleLayout onLeave={() => setShowMatchmaking(true)} />
    </BattleStateProvider>
  );
}