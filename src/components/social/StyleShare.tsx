import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share, Heart, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Style {
  id: string;
  userId: string;
  title: string;
  description: string;
  likes: number;
  comments: number;
}

export function StyleShare() {
  const [styles, setStyles] = useState<Style[]>([
    {
      id: "1",
      userId: "user1",
      title: "Summer Vibes",
      description: "Perfect for those hot summer days",
      likes: 42,
      comments: 12,
    },
    {
      id: "2",
      userId: "user2",
      title: "Urban Street",
      description: "Modern street style with an edge",
      likes: 38,
      comments: 8,
    },
  ]);

  const handleLike = async (styleId: string) => {
    try {
      const { data, error } = await supabase
        .from('reactions')
        .insert([{ style_id: styleId, type: 'like' }]);
      
      if (error) throw error;
      toast.success("Style liked!");
      
      setStyles(styles.map(style => 
        style.id === styleId 
          ? { ...style, likes: style.likes + 1 }
          : style
      ));
    } catch (error) {
      toast.error("Failed to like style");
    }
  };

  const handleComment = (styleId: string) => {
    toast.success("Opening comments...");
  };

  const handleShare = (styleId: string) => {
    toast.success("Style shared!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Style Feed</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {styles.map((style) => (
            <div
              key={style.id}
              className="border rounded-lg p-4 space-y-2"
            >
              <h3 className="font-bold">{style.title}</h3>
              <p className="text-sm text-muted-foreground">{style.description}</p>
              <div className="flex gap-4 mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLike(style.id)}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  {style.likes}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleComment(style.id)}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  {style.comments}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleShare(style.id)}
                >
                  <Share className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}