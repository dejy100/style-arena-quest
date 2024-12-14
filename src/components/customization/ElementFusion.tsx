import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Atom, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const elements = [
  { id: "fire", name: "Fire", color: "bg-red-500" },
  { id: "water", name: "Water", color: "bg-blue-500" },
  { id: "earth", name: "Earth", color: "bg-green-500" },
  { id: "air", name: "Air", color: "bg-gray-400" }
];

export function ElementFusion() {
  const [selectedElements, setSelectedElements] = useState<string[]>([]);

  const handleElementSelect = (elementId: string) => {
    if (selectedElements.includes(elementId)) {
      setSelectedElements(prev => prev.filter(id => id !== elementId));
    } else if (selectedElements.length < 2) {
      setSelectedElements(prev => [...prev, elementId]);
    }
  };

  const handleFusion = () => {
    if (selectedElements.length === 2) {
      toast.success("Elements fused successfully!");
      setSelectedElements([]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Atom className="h-5 w-5" />
          Element Fusion
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {elements.map((element) => (
              <motion.div
                key={element.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant={selectedElements.includes(element.id) ? "default" : "outline"}
                  className="w-full"
                  onClick={() => handleElementSelect(element.id)}
                >
                  <div className={`mr-2 h-3 w-3 rounded-full ${element.color}`} />
                  {element.name}
                </Button>
              </motion.div>
            ))}
          </div>
          
          {selectedElements.length === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Button
                className="w-full"
                onClick={handleFusion}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Fuse Elements
              </Button>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}