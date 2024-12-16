import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Fire, Droplet, Mountain, Wind } from "lucide-react";
import { motion } from "framer-motion";

export interface BattleCategory {
  id: string;
  name: string;
  description: string;
  icon: any;
  gradient: string;
  reward: number;
}

const categories: BattleCategory[] = [
  {
    id: "fire",
    name: "Fire Style",
    description: "Bold and dramatic outfits that command attention",
    icon: Fire,
    gradient: "from-orange-500 to-red-600",
    reward: 100
  },
  {
    id: "water",
    name: "Water Style",
    description: "Fluid and elegant fashion choices",
    icon: Droplet,
    gradient: "from-blue-400 to-cyan-600",
    reward: 100
  },
  {
    id: "earth",
    name: "Earth Style",
    description: "Grounded yet sophisticated aesthetics",
    icon: Mountain,
    gradient: "from-green-500 to-emerald-700",
    reward: 100
  },
  {
    id: "air",
    name: "Air Style",
    description: "Light and ethereal designs",
    icon: Wind,
    gradient: "from-gray-300 to-slate-500",
    reward: 100
  }
];

interface BattleCategoriesProps {
  onSelect: (category: BattleCategory) => void;
  selectedCategory?: string;
}

export function BattleCategories({ onSelect, selectedCategory }: BattleCategoriesProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {categories.map((category) => {
        const Icon = category.icon;
        const isSelected = selectedCategory === category.id;
        
        return (
          <motion.div
            key={category.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className={`cursor-pointer relative overflow-hidden ${
                isSelected ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => onSelect(category)}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-10`} />
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon className="h-5 w-5" />
                  {category.name}
                  <Badge variant="secondary" className="ml-auto">
                    {category.reward} points
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}