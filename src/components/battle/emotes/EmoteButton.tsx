import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface EmoteButtonProps {
  type: string;
  icon: LucideIcon;
  color: string;
  onSend: (type: string) => void;
}

export function EmoteButton({ type, icon: Icon, color, onSend }: EmoteButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`p-2 rounded-full hover:bg-white/20 ${color}`}
      onClick={() => onSend(type)}
    >
      <Icon className="w-6 h-6" />
    </motion.button>
  );
}