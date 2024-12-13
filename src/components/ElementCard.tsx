import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ElementCardProps {
  name: string;
  description: string;
  gradient: string;
  icon: LucideIcon;
  onSelect: () => void;
}

export function ElementCard({ name, description, gradient, icon: Icon, onSelect }: ElementCardProps) {
  return (
    <motion.button
      onClick={onSelect}
      className={cn("element-card", gradient, "group")}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        ease: "easeOut"
      }}
    >
      <div className="relative z-10 flex flex-col items-center gap-4 text-white">
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          <Icon size={48} className="transition-all duration-300 group-hover:scale-110" />
        </motion.div>
        <h3 className="text-2xl font-bold">{name}</h3>
        <p className="text-sm opacity-90">{description}</p>
      </div>
    </motion.button>
  );
}