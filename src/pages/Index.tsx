import { useState } from "react";
import { Flame, Droplet, Mountain, Settings, TreePine } from "lucide-react";
import { ElementCard } from "@/components/ElementCard";
import { ArenaDashboard } from "@/components/ArenaDashboard";
import { toast } from "sonner";
import { motion } from "framer-motion";

const elements = [
  {
    name: "Fire",
    description: "Bold, passionate, and dramatic styles that command attention",
    gradient: "fire-gradient",
    icon: Flame
  },
  {
    name: "Water",
    description: "Fluid, elegant, and adaptable fashion choices",
    gradient: "water-gradient",
    icon: Droplet
  },
  {
    name: "Earth",
    description: "Grounded, practical, yet sophisticated aesthetics",
    gradient: "earth-gradient",
    icon: Mountain
  },
  {
    name: "Metal",
    description: "Sleek, modern, and precisely crafted looks",
    gradient: "metal-gradient",
    icon: Settings
  },
  {
    name: "Wood",
    description: "Natural, organic, and harmonious style elements",
    gradient: "wood-gradient",
    icon: TreePine
  }
];

const Index = () => {
  const [selectedElement, setSelectedElement] = useState<string | null>(null);

  const handleElementSelect = (elementName: string) => {
    setSelectedElement(elementName);
    toast.success(`Welcome to the ${elementName} element!`);
  };

  if (selectedElement) {
    return <ArenaDashboard />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center text-white"
        >
          <h1 className="mb-4 text-5xl font-bold">Welcome to Style Arena</h1>
          <p className="text-xl opacity-90">Choose your elemental archetype to begin your journey</p>
        </motion.div>
        
        <motion.div 
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          variants={{
            show: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          initial="hidden"
          animate="show"
        >
          {elements.map((element, index) => (
            <motion.div
              key={element.name}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.3 }}
            >
              <ElementCard
                name={element.name}
                description={element.description}
                gradient={element.gradient}
                icon={element.icon}
                onSelect={() => handleElementSelect(element.name)}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Index;