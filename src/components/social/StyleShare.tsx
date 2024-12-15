import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share, Heart, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Style {
  id: string;
  title: string;
  description: string;
  likes_count: number;
}

export function StyleShare() {
  const [styles, setStyles] = useState<Style[]>([]);

  useEffect(() => {
    // Fetch initial styles
    fetchStyles();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('style-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'styles'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setStyles(current => [...current, payload.new as Style]);
          } else if (payload.eventType === 'UPDATE') {
            setStyles(current =>
              current.map(style =>
                style.id === payload.new.id ? { ...style, ...payload.new } : style
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchStyles = async () => {
    try {
      const { data, error } = await supabase
        .from('styles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStyles(data || []);
    } catch (error) {
      toast.error("Failed to fetch styles");
    }
  };

  const handleLike = async (styleId: string) => {
    try {
      const { error } = await supabase
        .from('reactions')
        .insert([{ style_id: styleId, type: 'like' }]);
      
      if (error) throw error;
      
      // Update local state optimistically
      setStyles(styles.map(style => 
        style.id === styleId 
          ? { ...style, likes_count: (style.likes_count || 0) + 1 }
          : style
      ));
      
      toast.success("Style liked!");
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
                  {style.likes_count || 0}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleComment(style.id)}
                >
                  <MessageCircle className="h-4 w-4" />
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