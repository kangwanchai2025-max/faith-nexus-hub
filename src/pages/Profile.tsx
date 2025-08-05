import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import type { User } from '@supabase/supabase-js';
import { useToast } from "@/hooks/use-toast";
import { 
  Heart, 
  Users, 
  Calendar,
  Star,
  Shield,
  Settings,
  Edit3,
  TrendingUp,
  Clock,
  Award,
  MapPin,
  Mail,
  Phone
} from "lucide-react";

// Sample user data
const userData = {
  name: "ซาร่าห์ จอห์นสัน",
  email: "sarah.johnson@email.com",
  phone: "+1 (555) 123-4567",
  avatar: "/api/placeholder/120/120",
  role: "หัวหน้ากลุ่มดูแล",
  careGroup: "กลุ่มเยาวชน",
  joinDate: "มกราคม 2566",
  location: "ซานฟรานซิสโก, แคลิฟอร์เนีย",
  bio: "หลงใหลในการรับใช้พระเจ้าและสร้างความสัมพันธ์ที่มีความหมายภายในชุมชนของเรา รักการนำการนมัสการและการจัดกิจกรรมเพื่อชุมชน",
  stats: {
    prayersShared: 47,
    prayersAnswered: 23,
    groupsJoined: 3,
    eventsAttended: 15
  }
};

const recentPrayers = [
  {
    id: 1,
    title: "ขอบคุณพระคุณสำหรับงานใหม่",
    status: "answered",
    date: "2 วันที่แล้ว",
    category: "ความกตัญญู"
  },
  {
    id: 2,
    title: "การรักษาสำหรับการผ่าตัดของแม่",
    status: "ongoing",
    date: "1 สัปดาห์ที่แล้ว",
    category: "สุขภาพ"
  },
  {
    id: 3,
    title: "สติปัญญาในการตัดสินใจ",
    status: "ongoing",
    date: "2 สัปดาห์ที่แล้ว",
    category: "การนำทาง"
  }
];

const careGroupMembers = [
  { name: "ไมเคิล เฉิน", role: "สมาชิก", avatar: "/api/placeholder/40/40" },
  { name: "เจนนิเฟอร์ โลเปซ", role: "ผู้ช่วยหัวหน้า", avatar: "/api/placeholder/40/40" },
  { name: "เดวิด คิม", role: "สมาชิก", avatar: "/api/placeholder/40/40" },
  { name: "เอมิลี่ โรดริเกซ", role: "สมาชิก", avatar: "/api/placeholder/40/40" },
];

const Profile = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch user profile data
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error: any) {
      console.error('Error fetching profile:', error);
    }
  };

  // Auth state management
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id);
        } else {
          navigate("/auth");
        }
        setIsLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        navigate("/auth");
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">กำลังโหลด...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-6 py-8">
        {/* Profile Header */}
        <Card className="mb-8 bg-gradient-divine border-0 text-primary-foreground overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12" />
          
          <CardContent className="p-8 relative">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-white/20 shadow-glow">
                  <AvatarImage src={profile?.avatar_url} alt={profile?.display_name || user?.email} />
                  <AvatarFallback className="text-2xl bg-white/20 text-primary-foreground">
                    {profile?.display_name ? profile.display_name.split(' ').map((n: string) => n[0]).join('') : user?.email?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary-glow rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-serif font-bold mb-2">
                      {profile?.display_name || `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || user?.email}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <Badge variant="secondary" className="bg-white/20 text-primary-foreground hover:bg-white/30">
                        <Shield className="w-3 h-3 mr-1" />
                        {userData.role}
                      </Badge>
                      <Badge variant="outline" className="border-white/30 text-primary-foreground">
                        <Users className="w-3 h-3 mr-1" />
                        {userData.careGroup}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-primary-foreground/80">
                      <MapPin className="w-4 h-4" />
                      <span>{user?.email}</span>
                      <span className="mx-2">•</span>
                      <Calendar className="w-4 h-4" />
                      <span>เข้าร่วม {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: 'long'
                      }) : 'ไม่ทราบ'}</span>
                    </div>
                  </div>
                  
                  <Button variant="secondary" size="sm" className="bg-white/20 text-primary-foreground hover:bg-white/30 border-white/30">
                    <Edit3 className="w-4 h-4" />
                    แก้ไขโปรไฟล์
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card/60 backdrop-blur-sm border-border/50">
            <CardContent className="p-4 text-center">
              <Heart className="w-6 h-6 text-pink-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{userData.stats.prayersShared}</div>
              <div className="text-sm text-muted-foreground">คำอธิษฐานที่แบ่งปัน</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/60 backdrop-blur-sm border-border/50">
            <CardContent className="p-4 text-center">
              <Star className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{userData.stats.prayersAnswered}</div>
              <div className="text-sm text-muted-foreground">คำอธิษฐานที่ได้รับการตอบ</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/60 backdrop-blur-sm border-border/50">
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{userData.stats.groupsJoined}</div>
              <div className="text-sm text-muted-foreground">กลุ่มที่เข้าร่วม</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/60 backdrop-blur-sm border-border/50">
            <CardContent className="p-4 text-center">
              <Calendar className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{userData.stats.eventsAttended}</div>
              <div className="text-sm text-muted-foreground">กิจกรรมที่เข้าร่วม</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="overview">ภาพรวม</TabsTrigger>
            <TabsTrigger value="prayers">คำอธิษฐานของฉัน</TabsTrigger>
            <TabsTrigger value="group">กลุ่มดูแล</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* About */}
              <Card className="bg-card/60 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    เกี่ยวกับฉัน
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{userData.bio}</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{userData.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{userData.phone}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Prayer Progress */}
              <Card className="bg-card/60 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    การเดินทางในการอธิษฐาน
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>ความคืบหน้าเป้าหมายรายเดือน</span>
                      <span>23/30</span>
                    </div>
                    <Progress value={76} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>อัตราการตอบคำอธิษฐาน</span>
                      <span>49%</span>
                    </div>
                    <Progress value={49} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="prayers" className="space-y-6">
            <Card className="bg-card/60 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>คำขอการอธิษฐานล่าสุด</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentPrayers.map((prayer) => (
                    <div key={prayer.id} className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">{prayer.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{prayer.date}</span>
                          <Badge variant="outline" className="text-xs">
                            {prayer.category}
                          </Badge>
                        </div>
                      </div>
                      <Badge 
                        variant={prayer.status === 'answered' ? 'default' : 'secondary'}
                        className={prayer.status === 'answered' ? 'bg-green-500 hover:bg-green-600' : ''}
                      >
                        {prayer.status === 'answered' ? 'ได้รับการตอบ' : 'กำลังดำเนินการ'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="group" className="space-y-6">
            <Card className="bg-card/60 backdrop-blur-sm border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    สมาชิก{userData.careGroup}
                  </CardTitle>
                  <Button variant="divine" size="sm">
                    จัดการกลุ่ม
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  {careGroupMembers.map((member, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border border-border/50 rounded-lg">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-medium">{member.name}</h4>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;