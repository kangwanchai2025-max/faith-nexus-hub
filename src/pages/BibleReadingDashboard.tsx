import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import BibleVerseCard from "@/components/BibleVerseCard";
import { 
  Book, 
  Trophy, 
  Calendar,
  Target,
  TrendingUp,
  Share2,
  Crown,
  Star,
  Award,
  CheckCircle,
  Facebook,
  MessageCircle
} from "lucide-react";

interface ReadingProgress {
  id: string;
  reading_day: number;
  completed_at: string;
}

interface Achievement {
  id: string;
  achievement_type: string;
  achievement_data: any;
  earned_at: string;
}

const BibleReadingDashboard = () => {
  const [progress, setProgress] = useState<ReadingProgress[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [yearlyCompletion, setYearlyCompletion] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const currentDayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const progressPercentage = (progress.length / 365) * 100;
  const daysRemaining = 365 - progress.length;

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      setUser(user);

      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setProfile(profileData);

      // Fetch reading progress
      const { data: progressData, error: progressError } = await supabase
        .from('user_bible_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('reading_day', { ascending: true });

      if (progressError) throw progressError;
      setProgress(progressData || []);

      // Check for yearly completion
      setYearlyCompletion((progressData?.length || 0) >= 365);

      // Fetch achievements
      const { data: achievementsData, error: achievementsError } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false });

      if (achievementsError) throw achievementsError;
      setAchievements(achievementsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลได้",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const shareYearlyCompletion = (platform: 'facebook' | 'line') => {
    const text = `🏆 ฉันอ่านพระคัมภีร์ครบ 1 ปีแล้ว! (${progress.length}/365 วัน) ร่วมเดินทางไปกับพระคัมภีร์กันเถอะ! #BibleReading #พระคัมภีร์`;
    const url = window.location.href;

    if (platform === 'facebook') {
      const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
      window.open(fbUrl, '_blank', 'width=600,height=400');
    } else {
      const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
      window.open(lineUrl, '_blank', 'width=600,height=400');
    }
  };

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case 'yearly_bible_reading':
        return Crown;
      case 'weekly_streak':
        return Target;
      case 'monthly_completion':
        return Star;
      default:
        return Award;
    }
  };

  const getStreakInfo = () => {
    if (progress.length === 0) return { current: 0, longest: 0 };
    
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    // Sort progress by day
    const sortedProgress = [...progress].sort((a, b) => a.reading_day - b.reading_day);
    
    for (let i = 0; i < sortedProgress.length; i++) {
      if (i === 0 || sortedProgress[i].reading_day === sortedProgress[i-1].reading_day + 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    
    longestStreak = Math.max(longestStreak, tempStreak);
    
    // Check if current streak includes today
    const latestDay = sortedProgress[sortedProgress.length - 1]?.reading_day || 0;
    if (latestDay >= currentDayOfYear - 1) {
      currentStreak = tempStreak;
    }
    
    return { current: currentStreak, longest: longestStreak };
  };

  const streakInfo = getStreakInfo();

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">กำลังโหลด...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold mb-2">แดชบอร์ดการอ่านพระคัมภีร์</h1>
          <p className="text-muted-foreground">ติดตามความคืบหน้าการอ่านพระคัมภีร์ 1 ปี</p>
        </div>

        {/* Yearly Completion Achievement */}
        {yearlyCompletion && (
          <Card className="mb-8 bg-gradient-divine border-0 text-primary-foreground overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12" />
            
            <CardContent className="p-8 text-center relative">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-300" />
              <h2 className="text-2xl font-serif font-bold mb-2">🎉 ยินดีด้วย!</h2>
              <p className="text-lg mb-4">คุณอ่านพระคัมภีร์ครบ 1 ปีแล้ว!</p>
              <div className="flex justify-center gap-4">
                <Button
                  variant="secondary"
                  onClick={() => shareYearlyCompletion('facebook')}
                  className="bg-white/20 text-primary-foreground hover:bg-white/30"
                >
                  <Facebook className="w-4 h-4 mr-2" />
                  แชร์ใน Facebook
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => shareYearlyCompletion('line')}
                  className="bg-white/20 text-primary-foreground hover:bg-white/30"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  แชร์ใน LINE
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Progress Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card/60 backdrop-blur-sm border-border/50">
            <CardContent className="p-6 text-center">
              <Book className="w-8 h-8 text-blue-500 mx-auto mb-3" />
              <div className="text-2xl font-bold">{progress.length}</div>
              <div className="text-sm text-muted-foreground">วันที่อ่านแล้ว</div>
            </CardContent>
          </Card>

          <Card className="bg-card/60 backdrop-blur-sm border-border/50">
            <CardContent className="p-6 text-center">
              <Target className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <div className="text-2xl font-bold">{streakInfo.current}</div>
              <div className="text-sm text-muted-foreground">วันติดต่อกัน</div>
            </CardContent>
          </Card>

          <Card className="bg-card/60 backdrop-blur-sm border-border/50">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-purple-500 mx-auto mb-3" />
              <div className="text-2xl font-bold">{streakInfo.longest}</div>
              <div className="text-sm text-muted-foreground">สถิติสูงสุด</div>
            </CardContent>
          </Card>

          <Card className="bg-card/60 backdrop-blur-sm border-border/50">
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 text-orange-500 mx-auto mb-3" />
              <div className="text-2xl font-bold">{daysRemaining}</div>
              <div className="text-sm text-muted-foreground">วันที่เหลือ</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Progress Chart */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-card/60 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  ความคืบหน้าการอ่าน
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>ความคืบหน้าปีนี้</span>
                    <span>{progress.length}/365 วัน</span>
                  </div>
                  <Progress value={progressPercentage} className="h-3" />
                  <div className="text-center mt-2 text-sm text-muted-foreground">
                    {progressPercentage.toFixed(1)}% เสร็จสิ้น
                  </div>
                </div>

                {/* Monthly Progress Grid */}
                <div className="grid grid-cols-12 gap-1 mt-6">
                  {Array.from({ length: 365 }, (_, i) => i + 1).map(day => {
                    const isCompleted = progress.some(p => p.reading_day === day);
                    const isToday = day === currentDayOfYear;
                    
                    return (
                      <div
                        key={day}
                        className={`w-3 h-3 rounded-sm ${
                          isCompleted 
                            ? 'bg-green-500' 
                            : isToday 
                            ? 'bg-primary ring-2 ring-primary/50' 
                            : 'bg-muted'
                        }`}
                        title={`วันที่ ${day}${isCompleted ? ' - อ่านแล้ว' : ''}`}
                      />
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="bg-card/60 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  ความสำเร็จ
                </CardTitle>
              </CardHeader>
              <CardContent>
                {achievements.length > 0 ? (
                  <div className="space-y-4">
                    {achievements.map((achievement) => {
                      const IconComponent = getAchievementIcon(achievement.achievement_type);
                      return (
                        <div key={achievement.id} className="flex items-center gap-4 p-4 border border-border/50 rounded-lg">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <IconComponent className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">
                              {achievement.achievement_type === 'yearly_bible_reading' && 'อ่านครบ 1 ปี'}
                              {achievement.achievement_type === 'weekly_streak' && 'อ่านต่อเนื่อง 7 วัน'}
                              {achievement.achievement_type === 'monthly_completion' && 'อ่านครบ 1 เดือน'}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              ได้รับเมื่อ {new Date(achievement.earned_at).toLocaleDateString('th-TH')}
                            </p>
                          </div>
                          <Badge variant="secondary">
                            <Star className="w-3 h-3 mr-1" />
                            ปลดล็อคแล้ว
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Trophy className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>ยังไม่มีความสำเร็จ</p>
                    <p className="text-sm">เริ่มอ่านพระคัมภีร์เพื่อปลดล็อคความสำเร็จแรกของคุณ!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Today's Reading */}
          <div className="space-y-6">
            <BibleVerseCard showControls={true} />

            {/* Quick Stats */}
            <Card className="bg-card/60 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">สถิติส่วนตัว</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">วันที่เริ่มอ่าน</span>
                  <span className="font-medium">
                    {progress.length > 0 
                      ? new Date(progress[0].completed_at).toLocaleDateString('th-TH')
                      : 'ยังไม่เริ่ม'
                    }
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">อ่านล่าสุด</span>
                  <span className="font-medium">
                    {progress.length > 0 
                      ? new Date(progress[progress.length - 1].completed_at).toLocaleDateString('th-TH')
                      : 'ยังไม่อ่าน'
                    }
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">เฉลี่ยต่อสัปดาห์</span>
                  <span className="font-medium">
                    {progress.length > 0 
                      ? Math.round((progress.length / currentDayOfYear) * 7 * 10) / 10
                      : 0
                    } วัน
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Profile Quick View */}
            {profile && (
              <Card className="bg-card/60 backdrop-blur-sm border-border/50">
                <CardContent className="p-6 text-center">
                  <Avatar className="w-16 h-16 mx-auto mb-4">
                    <AvatarImage src={profile.avatar_url} />
                    <AvatarFallback>
                      {profile.display_name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-medium mb-2">
                    {profile.display_name || `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || user?.email}
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/profile")}
                    className="w-full"
                  >
                    ดูโปรไฟล์
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BibleReadingDashboard;