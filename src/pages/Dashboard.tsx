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
    title: "Healing for Sarah's Recovery",
    description: "Please pray for Sarah as she recovers from surgery. Asking for God's healing touch and swift recovery.",
    author: "Michael Chen",
    careGroup: "Young Adults",
    timestamp: "2 hours ago",
    category: "Health & Healing",
    urgent: true,
    prayerCount: 23,
    comments: 8
  },
  {
    id: 2,
    title: "Wisdom for Job Decision",
    description: "Seeking God's guidance as I consider a new job opportunity. Pray for clarity and wisdom in this decision.",
    author: "Jennifer Lopez",
    careGroup: "Professionals",
    timestamp: "4 hours ago",
    category: "Guidance",
    urgent: false,
    prayerCount: 15,
    comments: 5
  },
  {
    id: 3,
    title: "Family Reconciliation",
    description: "My family is going through a difficult time. Please pray for forgiveness, understanding, and restoration of our relationships.",
    author: "David Kim",
    careGroup: "Families",
    timestamp: "6 hours ago",
    category: "Family",
    urgent: false,
    prayerCount: 31,
    comments: 12
  }
];

const quickActions = [
  { icon: Heart, label: "Share Prayer", color: "text-pink-500" },
  { icon: Users, label: "Join Group", color: "text-blue-500" },
  { icon: Calendar, label: "Prayer Meeting", color: "text-green-500" },
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
                United in
                <span className="block bg-gradient-to-r from-primary-glow to-yellow-300 bg-clip-text text-transparent">
                  Prayer
                </span>
              </h1>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Join our community in lifting each other up through prayer, faith, and fellowship.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="xl" variant="hero" className="animate-glow">
                  <Heart className="w-5 h-5" />
                  Share Your Prayer
                </Button>
                <Button size="xl" variant="peaceful">
                  <Users className="w-5 h-5" />
                  Join a Care Group
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
              placeholder="Search prayers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-card/60 border-border/50"
            />
          </div>
          <Button variant="outline" size="default">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>

        {/* Prayer Feed */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-serif font-semibold">Recent Prayer Requests</h2>
            <Badge variant="secondary" className="px-3 py-1">
              {prayers.length} Active Prayers
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
                          Urgent
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
                    Pray
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