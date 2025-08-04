import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
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
  name: "Sarah Johnson",
  email: "sarah.johnson@email.com",
  phone: "+1 (555) 123-4567",
  avatar: "/api/placeholder/120/120",
  role: "Care Group Leader",
  careGroup: "Young Adults Ministry",
  joinDate: "January 2023",
  location: "San Francisco, CA",
  bio: "Passionate about serving God and building meaningful relationships within our community. Love leading worship and organizing community outreach events.",
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
    title: "Thanksgiving for New Job",
    status: "answered",
    date: "2 days ago",
    category: "Gratitude"
  },
  {
    id: 2,
    title: "Healing for Mom's Surgery",
    status: "ongoing",
    date: "1 week ago",
    category: "Health"
  },
  {
    id: 3,
    title: "Wisdom in Decision Making",
    status: "ongoing",
    date: "2 weeks ago",
    category: "Guidance"
  }
];

const careGroupMembers = [
  { name: "Michael Chen", role: "Member", avatar: "/api/placeholder/40/40" },
  { name: "Jennifer Lopez", role: "Co-Leader", avatar: "/api/placeholder/40/40" },
  { name: "David Kim", role: "Member", avatar: "/api/placeholder/40/40" },
  { name: "Emily Rodriguez", role: "Member", avatar: "/api/placeholder/40/40" },
];

const Profile = () => {
  const [activeTab, setActiveTab] = useState("overview");

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
                  <AvatarImage src={userData.avatar} alt={userData.name} />
                  <AvatarFallback className="text-2xl bg-white/20 text-primary-foreground">
                    {userData.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary-glow rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-serif font-bold mb-2">{userData.name}</h1>
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
                      <span>{userData.location}</span>
                      <span className="mx-2">•</span>
                      <Calendar className="w-4 h-4" />
                      <span>Joined {userData.joinDate}</span>
                    </div>
                  </div>
                  
                  <Button variant="secondary" size="sm" className="bg-white/20 text-primary-foreground hover:bg-white/30 border-white/30">
                    <Edit3 className="w-4 h-4" />
                    Edit Profile
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
              <div className="text-sm text-muted-foreground">Prayers Shared</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/60 backdrop-blur-sm border-border/50">
            <CardContent className="p-4 text-center">
              <Star className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{userData.stats.prayersAnswered}</div>
              <div className="text-sm text-muted-foreground">Answered Prayers</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/60 backdrop-blur-sm border-border/50">
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{userData.stats.groupsJoined}</div>
              <div className="text-sm text-muted-foreground">Groups Joined</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/60 backdrop-blur-sm border-border/50">
            <CardContent className="p-4 text-center">
              <Calendar className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{userData.stats.eventsAttended}</div>
              <div className="text-sm text-muted-foreground">Events Attended</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="prayers">My Prayers</TabsTrigger>
            <TabsTrigger value="group">Care Group</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* About */}
              <Card className="bg-card/60 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    About Me
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
                    Prayer Journey
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Monthly Goal Progress</span>
                      <span>23/30</span>
                    </div>
                    <Progress value={76} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Answered Prayer Rate</span>
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
                <CardTitle>Recent Prayer Requests</CardTitle>
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
                        {prayer.status === 'answered' ? 'Answered' : 'Ongoing'}
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
                    {userData.careGroup} Members
                  </CardTitle>
                  <Button variant="divine" size="sm">
                    Manage Group
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