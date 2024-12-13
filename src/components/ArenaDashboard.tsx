import { Trophy, Gamepad, Calendar } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

export function ArenaDashboard() {
  return (
    <div className="space-y-8 p-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Style Arena</h1>
        <p className="mt-2 text-muted-foreground">Ready to showcase your style?</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <div className="flex flex-col items-center gap-4">
            <Gamepad size={32} />
            <h2 className="text-xl font-semibold">Quick Play</h2>
            <Button className="w-full">Start Battle</Button>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex flex-col items-center gap-4">
            <Trophy size={32} />
            <h2 className="text-xl font-semibold">Tournaments</h2>
            <Button variant="outline" className="w-full">View Active</Button>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex flex-col items-center gap-4">
            <Calendar size={32} />
            <h2 className="text-xl font-semibold">Events</h2>
            <Button variant="outline" className="w-full">Browse Events</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}