import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Trophy, Star } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { format } from "date-fns";
import { EventLeaderboard } from "./EventLeaderboard";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export function SeasonalEvents() {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

  const { data: events, isLoading } = useQuery({
    queryKey: ["seasonal-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("seasonal_events")
        .select("*")
        .order("start_date", { ascending: true });

      if (error) {
        toast.error("Failed to load seasonal events");
        throw error;
      }

      return data;
    },
  });

  const handleParticipate = async (eventId: string) => {
    const { error } = await supabase
      .from("event_participants")
      .insert([{ event_id: eventId }]);

    if (error) {
      if (error.code === "23505") {
        toast.error("You're already participating in this event!");
      } else {
        toast.error("Failed to join event");
      }
      return;
    }

    toast.success("Successfully joined the event!");
  };

  if (isLoading) {
    return <div>Loading events...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Seasonal Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {events?.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border p-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                  <div className="mt-2 flex items-center gap-4">
                    <span className="text-sm">
                      {format(new Date(event.start_date), "MMM d")} -{" "}
                      {format(new Date(event.end_date), "MMM d, yyyy")}
                    </span>
                    <Badge variant="outline" className="capitalize">
                      {event.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedEvent(event.id)}
                  >
                    <Trophy className="mr-2 h-4 w-4" />
                    Leaderboard
                  </Button>
                  {event.status === "active" && (
                    <Button
                      size="sm"
                      onClick={() => handleParticipate(event.id)}
                    >
                      Join Event
                    </Button>
                  )}
                </div>
              </div>
              
              {event.rewards && (
                <div className="mt-4">
                  <h4 className="mb-2 font-medium">Rewards</h4>
                  <div className="flex gap-2">
                    {Object.entries(event.rewards).map(([reward, details]: [string, any]) => (
                      <div
                        key={reward}
                        className="flex items-center rounded-md border px-3 py-1"
                      >
                        <Star className="mr-2 h-4 w-4 text-yellow-500" />
                        <span className="text-sm">{details.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedEvent === event.id && (
                <div className="mt-4">
                  <EventLeaderboard eventId={event.id} />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}