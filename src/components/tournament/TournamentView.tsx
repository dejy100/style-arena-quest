import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Calendar, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface Tournament {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  max_participants: number;
  current_participants: number;
  status: string;
  prize_pool: any;
}

interface TournamentViewProps {
  onBack: () => void;
}

export function TournamentView({ onBack }: TournamentViewProps) {
  const [selectedTournament, setSelectedTournament] = useState<string | null>(null);

  const { data: tournaments, isLoading } = useQuery({
    queryKey: ["tournaments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tournaments")
        .select("*")
        .order("start_date", { ascending: true });

      if (error) {
        toast.error("Failed to load tournaments");
        throw error;
      }

      return data as Tournament[];
    },
  });

  const handleJoinTournament = async (tournamentId: string) => {
    const { error } = await supabase
      .from("tournament_participants")
      .insert([
        {
          tournament_id: tournamentId,
          user_id: (await supabase.auth.getUser()).data.user?.id,
        },
      ]);

    if (error) {
      if (error.code === "23505") {
        toast.error("You've already joined this tournament!");
      } else {
        toast.error("Failed to join tournament");
      }
      return;
    }

    toast.success("Successfully joined tournament!");
    setSelectedTournament(tournamentId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 p-6"
    >
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h2 className="text-2xl font-bold">Style Tournaments</h2>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading tournaments...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {tournaments?.map((tournament) => (
            <Card key={tournament.id} className="relative overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  {tournament.title}
                </CardTitle>
                <CardDescription>{tournament.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>
                      {tournament.current_participants}/{tournament.max_participants} participants
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(tournament.start_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <Button
                  className="w-full"
                  disabled={tournament.current_participants >= tournament.max_participants}
                  onClick={() => handleJoinTournament(tournament.id)}
                >
                  {tournament.current_participants >= tournament.max_participants
                    ? "Tournament Full"
                    : "Join Tournament"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
}