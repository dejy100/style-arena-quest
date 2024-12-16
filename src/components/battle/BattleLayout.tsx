import React from 'react';
import { useBattle } from './BattleStateProvider';
import { BattleHeader } from './BattleHeader';
import { BattleWinner } from './BattleWinner';
import { BattleOutfitCard } from './BattleOutfitCard';
import { BattleRewards } from './BattleRewards';
import { BattleEmotes } from './BattleEmotes';
import { BattleSpectators } from './BattleSpectators';

interface BattleLayoutProps {
  onLeave: () => void;
}

export function BattleLayout({ onLeave }: BattleLayoutProps) {
  const { 
    timeLeft, 
    battleId, 
    outfits, 
    totalVotes,
    hasVoted,
    battleEnded,
    handleVote,
    getWinner
  } = useBattle();

  const winner = getWinner();

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <BattleHeader 
          timeLeft={timeLeft}
          onLeave={onLeave}
        />
        <BattleSpectators battleId={battleId} />
      </div>

      {battleEnded && winner && <BattleWinner winner={winner} />}

      <div className="grid md:grid-cols-2 gap-6">
        {outfits.map((outfit) => (
          <BattleOutfitCard
            key={outfit.id}
            outfit={outfit}
            totalVotes={totalVotes}
            hasVoted={hasVoted}
            battleEnded={battleEnded}
            isWinning={outfit.votes > 0 && outfit.votes === Math.max(...outfits.map(o => o.votes))}
            onVote={handleVote}
          />
        ))}
      </div>

      {battleEnded && winner && (
        <BattleRewards
          points={100}
          rank={1}
          isWinner={true}
        />
      )}

      <BattleEmotes battleId={battleId} />
    </div>
  );
}