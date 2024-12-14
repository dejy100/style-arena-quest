import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Brush, Palette, User } from "lucide-react";
import { motion } from "framer-motion";

const avatarStyles = [
  { id: 1, name: "Classic", preview: "/placeholder.svg" },
  { id: 2, name: "Elemental", preview: "/placeholder.svg" },
  { id: 3, name: "Mystic", preview: "/placeholder.svg" }
];

export function AvatarCustomizer() {
  const [selectedStyle, setSelectedStyle] = useState(1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Avatar Customization
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative"
          >
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatarStyles.find(s => s.id === selectedStyle)?.preview} />
              <AvatarFallback><User /></AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              className="absolute -bottom-2 -right-2"
              onClick={() => toast.success("Customization saved!")}
            >
              <Brush className="h-4 w-4" />
            </Button>
          </motion.div>
          
          <div className="grid grid-cols-3 gap-4">
            {avatarStyles.map((style) => (
              <Button
                key={style.id}
                variant={selectedStyle === style.id ? "default" : "outline"}
                onClick={() => setSelectedStyle(style.id)}
                className="flex flex-col gap-2 p-4"
              >
                <Avatar className="h-12 w-12">
                  <AvatarImage src={style.preview} />
                  <AvatarFallback><Palette /></AvatarFallback>
                </Avatar>
                <span className="text-sm">{style.name}</span>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}