import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  Heart, 
  Users, 
  Calendar,
  Search,
  Filter,
  Star,
  MessageCircle,
  Share2,
  Clock,
  User as UserIcon,
  MapPin
} from "lucide-react";
import heroImage from "@/assets/hero-prayer.jpg";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from '@supabase/supabase-js';
import { useToast } from "@/hooks/use-toast";

interface Prayer {
  id: string;
  title: string;
  description: string;
  category: string;
  is_urgent: boolean;
  is_private: boolean;
  is_anonymous: boolean;
  created_at: string;
  profiles?: {
    display_name: string;
  };
  care_groups?: {
    name: string;
  };
  prayer_responses?: any[];
}

const quickActions = [
  { icon: Heart, label: "แบ่งปันคำอธิษฐาน", color: "text-pink-500" },
  { icon: Users, label: "เข้าร่วมกลุ่ม", color: "text-blue-500" },
  { icon: Calendar, label: "การประชุมอธิษฐาน", color: "text-green-500" },
];

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [isLoadingPrayers, setIsLoadingPrayers] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch prayers from database
  const fetchPrayers = async () => {
    if (!user) return;
    
    setIsLoadingPrayers(true);
    try {
      const { data, error } = await supabase
        .from('prayers')
        .select(`
          *,
          profiles:user_id (display_name),
          care_groups:care_group_id (name),
          prayer_responses (id)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setPrayers(data || []);
    } catch (error: any) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดคำอธิษฐานได้",
        variant: "destructive"
      });
    } finally {
      setIsLoadingPrayers(false);
    }
  };

  // Auth state management
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
        
        // Redirect to auth if no user
        if (!session?.user) {
          navigate("/auth");
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
      
      if (!session?.user) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Fetch prayers when user is available
  useEffect(() => {
    if (user) {
      fetchPrayers();
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-divine rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-divine animate-pulse">
            <Heart className="w-8 h-8 text-primary-foreground" />
          </div>
          <p className="text-muted-foreground">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <div className="relative h-80 overflow-hidden">
        <img 
          src={heroImage} 
          alt="Prayer Community" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl animate-fade-in-up">
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4 leading-tight">
                รวมใจใน
                <span className="block bg-gradient-to-r from-primary-glow to-yellow-300 bg-clip-text text-transparent">
                  การอธิษฐาน
                </span>
              </h1>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                เข้าร่วมชุมชนของเราในการยกชูซึ่งกันและกันผ่านการอธิษฐาน ความเชื่อ และการเป็นเพื่อนเคียง
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="xl" variant="peaceful">
                  <Users className="w-5 h-5" />
                  เข้าร่วมกลุ่มดูแล
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 -mt-16 relative z-10">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-divine transition-all duration-300 hover:scale-105 cursor-pointer"
                onClick={() => navigate("/new-prayer")}>
            <CardContent className="p-6 text-center">
              <Heart className="w-8 h-8 mx-auto mb-3 text-pink-500" />
              <h3 className="font-semibold">แบ่งปันคำอธิษฐาน</h3>
            </CardContent>
          </Card>
          <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-divine transition-all duration-300 hover:scale-105 cursor-pointer"
                onClick={() => navigate("/groups")}>
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 mx-auto mb-3 text-blue-500" />
              <h3 className="font-semibold">เข้าร่วมกลุ่ม</h3>
            </CardContent>
          </Card>
          <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-divine transition-all duration-300 hover:scale-105 cursor-pointer"
                onClick={() => navigate("/calendar")}>
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 mx-auto mb-3 text-green-500" />
              <h3 className="font-semibold">การประชุมอธิษฐาน</h3>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="ค้นหาคำอธิษฐาน..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-card/60 border-border/50"
            />
          </div>
          <Button variant="outline" size="default">
            <Filter className="w-4 h-4" />
            กรอง
          </Button>
        </div>

        {/* Prayer Feed */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-serif font-semibold">คำขอการอธิษฐานล่าสุด</h2>
            <Badge variant="secondary" className="px-3 py-1">
              {prayers.length} คำอธิษฐานที่ยังใช้งาน
            </Badge>
          </div>

          {isLoadingPrayers ? (
            <div className="text-center py-8">
              <div className="animate-pulse">กำลังโหลดคำอธิษฐาน...</div>
            </div>
          ) : prayers.length === 0 ? (
            <Card className="bg-card/60 backdrop-blur-sm border-border/50">
              <CardContent className="p-8 text-center">
                <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">ยังไม่มีคำอธิษฐาน</h3>
                <p className="text-muted-foreground mb-4">เป็นคนแรกที่แบ่งปันคำอธิษฐานกับชุมชน</p>
                <Button onClick={() => navigate("/new-prayer")} variant="divine">
                  แบ่งปันคำอธิษฐาน
                </Button>
              </CardContent>
            </Card>
          ) : (
            prayers.map((prayer) => (
              <Card key={prayer.id} className="bg-card/60 backdrop-blur-sm border-border/50 hover:shadow-peaceful transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg font-serif">{prayer.title}</CardTitle>
                        {prayer.is_urgent && (
                          <Badge variant="destructive" className="text-xs">
                            ด่วน
                          </Badge>
                        )}
                        {prayer.is_anonymous && (
                          <Badge variant="secondary" className="text-xs">
                            ไม่ระบุชื่อ
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <UserIcon className="w-3 h-3" />
                        <span>{prayer.is_anonymous ? "ไม่ระบุชื่อ" : prayer.profiles?.display_name || "ผู้ใช้"}</span>
                        {prayer.care_groups && (
                          <>
                            <Separator orientation="vertical" className="h-3" />
                            <MapPin className="w-3 h-3" />
                            <span>{prayer.care_groups.name}</span>
                          </>
                        )}
                        <Separator orientation="vertical" className="h-3" />
                        <Clock className="w-3 h-3" />
                        <span>{new Date(prayer.created_at).toLocaleDateString('th-TH', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {prayer.category}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {prayer.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                        <Heart className="w-4 h-4" />
                        <span>0</span>
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageCircle className="w-4 h-4" />
                        <span>{prayer.prayer_responses?.length || 0}</span>
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <Button size="sm" variant="divine">
                      <Star className="w-3 h-3" />
                      อธิษฐาน
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;