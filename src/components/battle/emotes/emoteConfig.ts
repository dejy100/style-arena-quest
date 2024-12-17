import { Heart, ThumbsUp, Star, Sparkles, Trophy } from "lucide-react";

export const emotes = [
  { type: "heart", icon: Heart, color: "text-red-500" },
  { type: "like", icon: ThumbsUp, color: "text-blue-500" },
  { type: "star", icon: Star, color: "text-yellow-500" },
  { type: "sparkle", icon: Sparkles, color: "text-purple-500" },
  { type: "trophy", icon: Trophy, color: "text-green-500" },
] as const;