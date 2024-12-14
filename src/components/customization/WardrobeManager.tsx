import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shirt, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const wardrobeItems = [
  { id: 1, name: "Flame Robe", type: "outfit", element: "fire" },
  { id: 2, name: "Water Bracers", type: "accessory", element: "water" },
  { id: 3, name: "Earth Boots", type: "footwear", element: "earth" },
  { id: 4, name: "Wind Cloak", type: "outfit", element: "air" }
];

export function WardrobeManager() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shirt className="h-5 w-5" />
          Wardrobe
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button className="w-full" variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Add New Item
          </Button>
          
          <div className="grid gap-3">
            {wardrobeItems.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.02 }}
                className="relative"
              >
                <Button
                  variant="outline"
                  className="w-full justify-between"
                  onClick={() => toast.success(`${item.name} equipped!`)}
                >
                  <span>{item.name}</span>
                  <span className="text-sm text-muted-foreground">{item.type}</span>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}