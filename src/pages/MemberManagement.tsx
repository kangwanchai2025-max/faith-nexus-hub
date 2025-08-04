import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  UserPlus, 
  Shield, 
  Crown, 
  Settings,
  Search,
  Mail,
  Phone,
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
  Send
} from "lucide-react";

// Sample member data
const members = [
  {
    id: 1,
    name: "Michael Chen",
    email: "michael.chen@email.com",
    phone: "+1 (555) 123-4567",
    role: "Co-Leader",
    status: "active",
    joinDate: "Jan 2023",
    avatar: "/api/placeholder/40/40",
    attendance: 95,
    prayersShared: 23
  },
  {
    id: 2,
    name: "Jennifer Lopez",
    email: "jennifer.lopez@email.com",
    phone: "+1 (555) 987-6543",
    role: "Member",
    status: "active",
    joinDate: "Mar 2023",
    avatar: "/api/placeholder/40/40",
    attendance: 87,
    prayersShared: 15
  },
  {
    id: 3,
    name: "David Kim",
    email: "david.kim@email.com",
    phone: "+1 (555) 456-7890",
    role: "Member",
    status: "active",
    joinDate: "Feb 2023",
    avatar: "/api/placeholder/40/40",
    attendance: 92,
    prayersShared: 31
  },
  {
    id: 4,
    name: "Emily Rodriguez",
    email: "emily.rodriguez@email.com",
    phone: "+1 (555) 321-0987",
    role: "Member",
    status: "pending",
    joinDate: "Dec 2024",
    avatar: "/api/placeholder/40/40",
    attendance: 0,
    prayersShared: 0
  }
];

const roleOptions = [
  { value: "leader", label: "Leader", icon: Crown },
  { value: "co-leader", label: "Co-Leader", icon: Shield },
  { value: "member", label: "Member", icon: Users }
];

const MemberManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || member.role.toLowerCase().includes(selectedRole);
    return matchesSearch && matchesRole;
  });

  const handleInviteMember = () => {
    if (!inviteEmail.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter an email address to send the invitation.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Invitation Sent",
      description: `Care group invitation sent to ${inviteEmail}`,
    });
    setInviteEmail("");
    setIsInviteOpen(false);
  };

  const handleRoleChange = (memberId: number, newRole: string) => {
    toast({
      title: "Role Updated",
      description: `Member role has been updated to ${newRole}`,
    });
  };

  const handleRemoveMember = (memberId: number, memberName: string) => {
    toast({
      title: "Member Removed",
      description: `${memberName} has been removed from the care group`,
      variant: "destructive"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold">Member Management</h1>
            <p className="text-muted-foreground">Manage your care group members and their roles</p>
          </div>
          
          <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
            <DialogTrigger asChild>
              <Button variant="divine" size="default">
                <UserPlus className="w-4 h-4" />
                Invite Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite New Member</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="invite-email">Email Address</Label>
                  <Input
                    id="invite-email"
                    type="email"
                    placeholder="Enter member's email address"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setIsInviteOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button variant="divine" onClick={handleInviteMember} className="flex-1">
                    <Send className="w-4 h-4" />
                    Send Invitation
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card/60 backdrop-blur-sm border-border/50">
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{members.length}</div>
              <div className="text-sm text-muted-foreground">Total Members</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/60 backdrop-blur-sm border-border/50">
            <CardContent className="p-4 text-center">
              <Shield className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{members.filter(m => m.status === 'active').length}</div>
              <div className="text-sm text-muted-foreground">Active Members</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/60 backdrop-blur-sm border-border/50">
            <CardContent className="p-4 text-center">
              <Crown className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{members.filter(m => m.role.includes('Leader')).length}</div>
              <div className="text-sm text-muted-foreground">Leaders</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/60 backdrop-blur-sm border-border/50">
            <CardContent className="p-4 text-center">
              <Calendar className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {Math.round(members.reduce((acc, m) => acc + m.attendance, 0) / members.length)}%
              </div>
              <div className="text-sm text-muted-foreground">Avg Attendance</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6 bg-card/60 backdrop-blur-sm border-border/50">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="leader">Leaders</SelectItem>
                  <SelectItem value="member">Members</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Members List */}
        <Card className="bg-card/60 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Care Group Members ({filteredMembers.length})
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-0">
            <div className="space-y-0">
              {filteredMembers.map((member, index) => (
                <div key={member.id}>
                  <div className="p-6 hover:bg-accent/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{member.name}</h3>
                            <Badge 
                              variant={member.status === 'active' ? 'default' : 'secondary'}
                              className={member.status === 'pending' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
                            >
                              {member.status}
                            </Badge>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              <span>{member.email}</span>
                            </div>
                            <span className="hidden sm:block">•</span>
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              <span>{member.phone}</span>
                            </div>
                            <span className="hidden sm:block">•</span>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>Joined {member.joinDate}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-sm text-muted-foreground">
                              Attendance: {member.attendance}%
                            </span>
                            <span className="text-sm text-muted-foreground">
                              Prayers: {member.prayersShared}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Select
                          value={member.role.toLowerCase().replace(' ', '-')}
                          onValueChange={(value) => handleRoleChange(member.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {roleOptions.map(role => (
                              <SelectItem key={role.value} value={role.value}>
                                <div className="flex items-center gap-2">
                                  <role.icon className="w-3 h-3" />
                                  {role.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveMember(member.id, member.name)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {index < filteredMembers.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MemberManagement;