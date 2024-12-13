import { LucideIcon } from "lucide-react";

interface ElementCardProps {
  name: string;
  description: string;
  gradient: string;
  icon: LucideIcon;
  onSelect: () => void;
}

export function ElementCard({ name, description, gradient, icon: Icon, onSelect }: ElementCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`element-card ${gradient} group`}
    >
      <div className="relative z-10 flex flex-col items-center gap-4 text-white">
        <Icon size={48} className="transition-transform duration-300 group-hover:scale-110" />
        <h3 className="text-2xl font-bold">{name}</h3>
        <p className="text-sm opacity-90">{description}</p>
      </div>
    </button>
  );
}