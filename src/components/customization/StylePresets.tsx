import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Flame, Droplet, Mountain, Wind } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const presets = [
  { id: 1, name: "Fire Warrior", icon: Flame, gradient: "from-orange-500 to-red-600" },
  { id: 2, name: "Water Sage", icon: Droplet, gradient: "from-blue-400 to-cyan-600" },
  { id: 3, name: "Earth Guardian", icon: Mountain, gradient: "from-green-500 to-emerald-700" },
  { id: 4, name: "Air Nomad", icon: Wind, gradient: "from-gray-300 to-slate-500" }
];

export function StylePresets() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Style Presets
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {presets.map((preset) => {
            const Icon = preset.icon;
            return (
              <motion.div
                key={preset.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  className="relative h-24 w-full overflow-hidden"
                  onClick={() => toast.success(`${preset.name} style applied!`)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${preset.gradient} opacity-10`} />
                  <div className="relative flex flex-col items-center gap-2">
                    <Icon className="h-8 w-8" />
                    <span>{preset.name}</span>
                  </div>
                </Button>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}