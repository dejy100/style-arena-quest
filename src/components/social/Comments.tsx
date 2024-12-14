import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Comment {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
}

export function Comments({ styleId }: { styleId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([
          { style_id: styleId, content: newComment }
        ]);

      if (error) throw error;
      
      toast.success("Comment added!");
      setNewComment("");
      // Refresh comments
    } catch (error) {
      toast.error("Failed to add comment");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="border-b pb-2">
              <p className="text-sm text-muted-foreground">
                User {comment.userId}
              </p>
              <p>{comment.content}</p>
            </div>
          ))}
          <form onSubmit={handleAddComment} className="flex gap-2">
            <Input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1"
            />
            <Button type="submit">Post</Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}