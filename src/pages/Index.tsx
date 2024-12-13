import { useState } from "react";
import { Fire, Droplets, Mountain, Cog, Trees } from "lucide-react";
import { ElementCard } from "@/components/ElementCard";
import { ArenaDashboard } from "@/components/ArenaDashboard";
import { toast } from "sonner";

const elements = [
  {
    name: "Fire",
    description: "Bold, passionate, and dramatic styles that command attention",
    gradient: "fire-gradient",
    icon: Fire
  },
  {
    name: "Water",
    description: "Fluid, elegant, and adaptable fashion choices",
    gradient: "water-gradient",
    icon: Droplets
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
    icon: Cog
  },
  {
    name: "Wood",
    description: "Natural, organic, and harmonious style elements",
    gradient: "wood-gradient",
    icon: Trees
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center text-white">
          <h1 className="mb-4 text-5xl font-bold">Welcome to Style Arena</h1>
          <p className="text-xl opacity-90">Choose your elemental archetype to begin your journey</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {elements.map((element) => (
            <ElementCard
              key={element.name}
              name={element.name}
              description={element.description}
              gradient={element.gradient}
              icon={element.icon}
              onSelect={() => handleElementSelect(element.name)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;