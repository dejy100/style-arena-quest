import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy } from "lucide-react";
import { toast } from "sonner";

interface EventLeaderboardProps {
  eventId: string;
}

export function EventLeaderboard({ eventId }: EventLeaderboardProps) {
  const { data: participants, isLoading } = useQuery({
    queryKey: ["event-participants", eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("event_participants")
        .select("*")
        .eq("event_id", eventId)
        .order("score", { ascending: false })
        .limit(10);

      if (error) {
        toast.error("Failed to load leaderboard");
        throw error;
      }

      return data;
    },
  });

  if (isLoading) {
    return <div>Loading leaderboard...</div>;
  }

  return (
    <div className="rounded-lg border p-4">
      <h3 className="mb-4 flex items-center gap-2 font-semibold">
        <Trophy className="h-5 w-5" />
        Event Leaderboard
      </h3>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Rank</TableHead>
            <TableHead>Player</TableHead>
            <TableHead className="text-right">Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {participants?.map((participant, index) => (
            <TableRow key={participant.id}>
              <TableCell className="font-medium">#{index + 1}</TableCell>
              <TableCell>{participant.user_id}</TableCell>
              <TableCell className="text-right">{participant.score}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}