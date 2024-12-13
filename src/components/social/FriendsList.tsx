import { useState } from "react";
import { User, MessageCircle, UserPlus, Check } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { toast } from "sonner";

interface Friend {
  id: string;
  name: string;
  status: "online" | "offline";
  isFriend: boolean;
}

const mockFriends: Friend[] = [
  { id: "1", name: "Alex Style", status: "online", isFriend: true },
  { id: "2", name: "Jordan Fashion", status: "offline", isFriend: true },
  { id: "3", name: "Sam Trendy", status: "online", isFriend: false },
];

export function FriendsList() {
  const [friends, setFriends] = useState<Friend[]>(mockFriends);

  const handleAddFriend = (friendId: string) => {
    setFriends(friends.map(friend => 
      friend.id === friendId 
        ? { ...friend, isFriend: true }
        : friend
    ));
    toast.success("Friend request sent!");
  };

  const handleMessage = (friendName: string) => {
    toast.success(`Opening chat with ${friendName}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Friends & Community
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {friends.map((friend) => (
            <div
              key={friend.id}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-accent"
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  friend.status === "online" ? "bg-green-500" : "bg-gray-400"
                }`} />
                <span className="font-medium">{friend.name}</span>
              </div>
              <div className="flex gap-2">
                {friend.isFriend ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleMessage(friend.name)}
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleAddFriend(friend.id)}
                  >
                    <UserPlus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}