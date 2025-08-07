import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Member {
  id: string;
  display_name?: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  created_at: string;
  role?: string;
  care_group?: {
    id: string;
    name: string;
  };
}

interface CareGroup {
  id: string;
  name: string;
}

const AdminMemberManagement = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [careGroups, setCareGroups] = useState<CareGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMembers();
    fetchCareGroups();
  }, []);

  const fetchMembers = async () => {
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          *,
          user_roles!inner(role),
          group_members(
            care_groups(id, name)
          )
        `);

      if (profilesError) throw profilesError;

      const membersData = profiles?.map(profile => ({
        ...profile,
        role: (profile as any).user_roles?.[0]?.role || 'member',
        care_group: (profile as any).group_members?.[0]?.care_groups || null
      })) || [];

      setMembers(membersData);
    } catch (error: any) {
      console.error('Error fetching members:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลสมาชิกได้",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCareGroups = async () => {
    try {
      const { data, error } = await supabase
        .from('care_groups')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setCareGroups(data || []);
    } catch (error: any) {
      console.error('Error fetching care groups:', error);
    }
  };

  const updateMemberRole = async (userId: string, newRole: string) => {
    try {
      // Remove existing roles
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      // Add new role
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: newRole as 'admin' | 'moderator' | 'member'
        });

      if (error) throw error;

      toast({
        title: "อัปเดตสำเร็จ",
        description: "เปลี่ยนระดับสมาชิกแล้ว",
      });

      fetchMembers();
    } catch (error: any) {
      console.error('Error updating role:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเปลี่ยนระดับสมาชิกได้",
        variant: "destructive",
      });
    }
  };

  const updateMemberGroup = async (userId: string, groupId: string) => {
    try {
      // Remove from current group
      await supabase
        .from('group_members')
        .delete()
        .eq('user_id', userId);

      // Add to new group if selected
      if (groupId && groupId !== 'none') {
        const { error } = await supabase
          .from('group_members')
          .insert({
            user_id: userId,
            group_id: groupId,
            role: 'member'
          });

        if (error) throw error;
      }

      toast({
        title: "อัปเดตสำเร็จ",
        description: "เปลี่ยนกลุ่มสมาชิกแล้ว",
      });

      fetchMembers();
    } catch (error: any) {
      console.error('Error updating group:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเปลี่ยนกลุ่มสมาชิกได้",
        variant: "destructive",
      });
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'moderator':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'ผู้ดูแลระบบ';
      case 'moderator':
        return 'ผู้ดูแล';
      default:
        return 'สมาชิก';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>จัดการสมาชิก</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">กำลังโหลด...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>สมาชิก</TableHead>
                <TableHead>ระดับ</TableHead>
                <TableHead>กลุ่มดูแล</TableHead>
                <TableHead>วันที่เข้าร่วม</TableHead>
                <TableHead>การจัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={member.avatar_url} />
                        <AvatarFallback>
                          {member.display_name?.[0] || member.first_name?.[0] || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {member.display_name || 
                           `${member.first_name || ''} ${member.last_name || ''}`.trim() || 
                           'ไม่ระบุชื่อ'}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(member.role || 'member')}>
                      {getRoleLabel(member.role || 'member')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {member.care_group?.name || 'ไม่ได้อยู่ในกลุ่ม'}
                  </TableCell>
                  <TableCell>
                    {new Date(member.created_at).toLocaleDateString('th-TH')}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Select
                        value={member.role || 'member'}
                        onValueChange={(value) => updateMemberRole(member.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="member">สมาชิก</SelectItem>
                          <SelectItem value="moderator">ผู้ดูแล</SelectItem>
                          <SelectItem value="admin">ผู้ดูแลระบบ</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select
                        value={member.care_group?.id || 'none'}
                        onValueChange={(value) => updateMemberGroup(member.id, value)}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="เลือกกลุ่ม" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">ไม่อยู่ในกลุ่ม</SelectItem>
                          {careGroups.map((group) => (
                            <SelectItem key={group.id} value={group.id}>
                              {group.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminMemberManagement;