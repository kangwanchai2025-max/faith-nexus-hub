import { useState } from "react";
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
  User,
  MapPin
} from "lucide-react";
import heroImage from "@/assets/hero-prayer.jpg";

// Sample prayer data
const prayers = [
  {
    id: 1,
    title: "การรักษาสำหรับการฟื้นตัวของซาร่าห์",
    description: "โปรดอธิษฐานเพื่อซาร่าห์ขณะที่เธอฟื้นตัวจากการผ่าตัด ขอให้พระเจ้าทรงสัมผัสด้วยการรักษาและการฟื้นตัวอย่างรวดเร็ว",
    author: "ไมเคิล เฉิน",
    careGroup: "เยาวชน",
    timestamp: "2 ชั่วโมงที่แล้ว",
    category: "สุขภาพและการรักษา",
    urgent: true,
    prayerCount: 23,
    comments: 8
  },
  {
    id: 2,
    title: "ขอสติปัญญาในการตัดสินใจเรื่องงาน",
    description: "ขอการนำทางจากพระเจ้าขณะที่ฉันพิจารณาโอกาสงานใหม่ อธิษฐานขอความชัดเจนและสติปัญญาในการตัดสินใจนี้",
    author: "เจนนิเฟอร์ โลเปซ",
    careGroup: "ผู้ทำงาน",
    timestamp: "4 ชั่วโมงที่แล้ว",
    category: "การนำทาง",
    urgent: false,
    prayerCount: 15,
    comments: 5
  },
  {
    id: 3,
    title: "การคืนดีในครอบครัว",
    description: "ครอบครัวของฉันกำลังประสบปัญหาในช่วงยากลำบาก โปรดอธิษฐานเพื่อการให้อภัย ความเข้าใจ และการฟื้นฟูความสัมพันธ์ของเรา",
    author: "เดวิด คิม",
    careGroup: "ครอบครัว",
    timestamp: "6 ชั่วโมงที่แล้ว",
    category: "ครอบครัว",
    urgent: false,
    prayerCount: 31,
    comments: 12
  }
];

const quickActions = [
  { icon: Heart, label: "แบ่งปันคำอธิษฐาน", color: "text-pink-500" },
  { icon: Users, label: "เข้าร่วมกลุ่ม", color: "text-blue-500" },
  { icon: Calendar, label: "การประชุมอธิษฐาน", color: "text-green-500" },
];

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");

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
          {quickActions.map((action, index) => (
            <Card key={index} className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-divine transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <action.icon className={`w-8 h-8 mx-auto mb-3 ${action.color}`} />
                <h3 className="font-semibold">{action.label}</h3>
              </CardContent>
            </Card>
          ))}
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

          {prayers.map((prayer) => (
            <Card key={prayer.id} className="bg-card/60 backdrop-blur-sm border-border/50 hover:shadow-peaceful transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg font-serif">{prayer.title}</CardTitle>
                      {prayer.urgent && (
                        <Badge variant="destructive" className="text-xs">
                          ด่วน
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="w-3 h-3" />
                      <span>{prayer.author}</span>
                      <Separator orientation="vertical" className="h-3" />
                      <MapPin className="w-3 h-3" />
                      <span>{prayer.careGroup}</span>
                      <Separator orientation="vertical" className="h-3" />
                      <Clock className="w-3 h-3" />
                      <span>{prayer.timestamp}</span>
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
                      <span>{prayer.prayerCount}</span>
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MessageCircle className="w-4 h-4" />
                      <span>{prayer.comments}</span>
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;