import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Send,
  Facebook,
  ExternalLink,
  Clock,
  User
} from "lucide-react";

interface Prayer {
  id: string;
  title: string;
  description: string;
  category?: string;
  status: string;
  is_urgent: boolean;
  created_at: string;
  user_id: string;
  profiles?: {
    display_name: string;
    first_name: string;
    last_name: string;
    avatar_url: string;
  };
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    display_name: string;
    first_name: string;
    last_name: string;
    avatar_url: string;
  };
}

interface PrayerInteractionCardProps {
  prayer: Prayer;
}

const PrayerInteractionCard = ({ prayer }: PrayerInteractionCardProps) => {
  const [likes, setLikes] = useState<number>(0);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const { toast } = useToast();

  const fetchInteractions = async () => {
    try {
      // Fetch likes count
      const { count: likesCount } = await supabase
        .from('prayer_likes')
        .select('*', { count: 'exact', head: true })
        .eq('prayer_id', prayer.id);

      setLikes(likesCount || 0);

      // Check if current user liked
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userLike } = await supabase
          .from('prayer_likes')
          .select('id')
          .eq('prayer_id', prayer.id)
          .eq('user_id', user.id)
          .single();

        setIsLiked(!!userLike);
      }

      // Fetch comments with profile info separately
      const { data: commentsData, error: commentsError } = await supabase
        .from('prayer_comments')
        .select('id, content, created_at, user_id')
        .eq('prayer_id', prayer.id)
        .order('created_at', { ascending: true });

      if (commentsError) throw commentsError;

      // Get profiles for comment users
      if (commentsData && commentsData.length > 0) {
        const userIds = commentsData.map(c => c.user_id);
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, display_name, first_name, last_name, avatar_url')
          .in('id', userIds);

        if (profilesError) throw profilesError;

        const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || []);
        const commentsWithProfiles = commentsData.map(comment => ({
          ...comment,
          profiles: profilesMap.get(comment.user_id) || {
            display_name: 'Unknown',
            first_name: '',
            last_name: '',
            avatar_url: ''
          }
        }));
        setComments(commentsWithProfiles);
      } else {
        setComments([]);
      }
    } catch (error) {
      console.error('Error fetching interactions:', error);
    }
  };

  const toggleLike = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "กรุณาเข้าสู่ระบบ",
          description: "กรุณาเข้าสู่ระบบเพื่อกดไลค์",
          variant: "destructive",
        });
        return;
      }

      if (isLiked) {
        const { error } = await supabase
          .from('prayer_likes')
          .delete()
          .eq('prayer_id', prayer.id)
          .eq('user_id', user.id);

        if (error) throw error;
        setLikes(prev => prev - 1);
        setIsLiked(false);
      } else {
        const { error } = await supabase
          .from('prayer_likes')
          .insert({
            prayer_id: prayer.id,
            user_id: user.id
          });

        if (error) throw error;
        setLikes(prev => prev + 1);
        setIsLiked(true);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถกดไลค์ได้",
        variant: "destructive",
      });
    }
  };

  const addComment = async () => {
    if (!newComment.trim()) return;

    try {
      setIsCommenting(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "กรุณาเข้าสู่ระบบ",
          description: "กรุณาเข้าสู่ระบบเพื่อแสดงความคิดเห็น",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('prayer_comments')
        .insert({
          prayer_id: prayer.id,
          user_id: user.id,
          content: newComment.trim()
        });

      if (error) throw error;

      setNewComment('');
      await fetchInteractions();
      
      toast({
        title: "แสดงความคิดเห็นสำเร็จ",
        description: "ความคิดเห็นของคุณถูกเพิ่มแล้ว",
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเพิ่มความคิดเห็นได้",
        variant: "destructive",
      });
    } finally {
      setIsCommenting(false);
    }
  };

  const shareToFacebook = () => {
    const url = window.location.href;
    const text = `กรุณาร่วมอธิษฐานเพื่อ: ${prayer.title}`;
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
    window.open(fbUrl, '_blank', 'width=600,height=400');
  };

  const shareToLine = () => {
    const text = `กรุณาร่วมอธิษฐานเพื่อ: ${prayer.title}\n\n${prayer.description}`;
    const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`;
    window.open(lineUrl, '_blank', 'width=600,height=400');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDisplayName = (profile: any) => {
    return profile?.display_name || 
           `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 
           'ไม่ระบุชื่อ';
  };

  useEffect(() => {
    fetchInteractions();
  }, [prayer.id]);

  return (
    <Card className="bg-card/60 backdrop-blur-sm border-border/50">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={prayer.profiles?.avatar_url} />
              <AvatarFallback>
                <User className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{getDisplayName(prayer.profiles)}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{formatDate(prayer.created_at)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {prayer.is_urgent && (
              <Badge variant="destructive">ด่วน</Badge>
            )}
            {prayer.category && (
              <Badge variant="outline">{prayer.category}</Badge>
            )}
            <Badge variant={prayer.status === 'answered' ? 'default' : 'secondary'}>
              {prayer.status === 'answered' ? 'ได้รับการตอบ' : 'กำลังอธิษฐาน'}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">{prayer.title}</h4>
          <p className="text-muted-foreground">{prayer.description}</p>
        </div>

        {/* Interaction Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLike}
              className={`gap-2 ${isLiked ? 'text-red-500' : ''}`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{likes}</span>
            </Button>

            <Dialog open={showComments} onOpenChange={setShowComments}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>{comments.length}</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[70vh] overflow-hidden flex flex-col">
                <DialogHeader>
                  <DialogTitle>ความคิดเห็น</DialogTitle>
                </DialogHeader>
                
                <div className="flex-1 overflow-y-auto space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={comment.profiles?.avatar_url} />
                        <AvatarFallback>
                          {getDisplayName(comment.profiles).charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="bg-muted p-3 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm">
                              {getDisplayName(comment.profiles)}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(comment.created_at)}
                            </span>
                          </div>
                          <p className="text-sm">{comment.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {comments.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-30" />
                      <p>ยังไม่มีความคิดเห็น</p>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4 space-y-3">
                  <Textarea
                    placeholder="เขียนความคิดเห็น..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                  />
                  <Button 
                    onClick={addComment} 
                    disabled={!newComment.trim() || isCommenting}
                    className="w-full"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {isCommenting ? 'กำลังส่ง...' : 'ส่งความคิดเห็น'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={shareToFacebook}
              className="gap-2"
            >
              <Facebook className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={shareToLine}
              className="gap-2"
            >
              <Share2 className="w-4 h-4" />
              LINE
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrayerInteractionCard;