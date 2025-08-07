import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Edit, Plus, Trash2 } from "lucide-react";

interface BibleVerse {
  id: string;
  book: string;
  chapter: number;
  verse_start: number;
  verse_end?: number;
  content: string;
  content_thai?: string;
  explanation?: string;
  explanation_thai?: string;
  reading_day: number;
}

const AdminBibleManagement = () => {
  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVerse, setEditingVerse] = useState<BibleVerse | null>(null);
  const [formData, setFormData] = useState({
    book: '',
    chapter: 1,
    verse_start: 1,
    verse_end: null as number | null,
    content: '',
    content_thai: '',
    explanation: '',
    explanation_thai: '',
    reading_day: 1
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchVerses();
  }, []);

  const fetchVerses = async () => {
    try {
      const { data, error } = await supabase
        .from('bible_verses')
        .select('*')
        .order('reading_day', { ascending: true });

      if (error) throw error;
      setVerses(data || []);
    } catch (error: any) {
      console.error('Error fetching verses:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลพระคัมภีร์ได้",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editingVerse) {
        const { error } = await supabase
          .from('bible_verses')
          .update(formData)
          .eq('id', editingVerse.id);

        if (error) throw error;
        
        toast({
          title: "อัปเดตสำเร็จ",
          description: "แก้ไขพระคัมภีร์แล้ว",
        });
      } else {
        const { error } = await supabase
          .from('bible_verses')
          .insert([formData]);

        if (error) throw error;
        
        toast({
          title: "เพิ่มสำเร็จ",
          description: "เพิ่มพระคัมภีร์ใหม่แล้ว",
        });
      }

      setIsDialogOpen(false);
      setEditingVerse(null);
      resetForm();
      fetchVerses();
    } catch (error: any) {
      console.error('Error saving verse:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกข้อมูลได้",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (verse: BibleVerse) => {
    setEditingVerse(verse);
    setFormData({
      book: verse.book,
      chapter: verse.chapter,
      verse_start: verse.verse_start,
      verse_end: verse.verse_end,
      content: verse.content,
      content_thai: verse.content_thai || '',
      explanation: verse.explanation || '',
      explanation_thai: verse.explanation_thai || '',
      reading_day: verse.reading_day
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('คุณแน่ใจหรือว่าต้องการลบพระคัมภีร์นี้?')) return;

    try {
      const { error } = await supabase
        .from('bible_verses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "ลบสำเร็จ",
        description: "ลบพระคัมภีร์แล้ว",
      });
      
      fetchVerses();
    } catch (error: any) {
      console.error('Error deleting verse:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถลบข้อมูลได้",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      book: '',
      chapter: 1,
      verse_start: 1,
      verse_end: null,
      content: '',
      content_thai: '',
      explanation: '',
      explanation_thai: '',
      reading_day: 1
    });
  };

  const openAddDialog = () => {
    setEditingVerse(null);
    resetForm();
    setIsDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>จัดการพระคัมภีร์ประจำวัน</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog}>
                <Plus className="w-4 h-4 mr-2" />
                เพิ่มพระคัมภีร์
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingVerse ? 'แก้ไขพระคัมภีร์' : 'เพิ่มพระคัมภีร์ใหม่'}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="book">หนังสือ</Label>
                    <Input
                      id="book"
                      value={formData.book}
                      onChange={(e) => setFormData(prev => ({ ...prev, book: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="reading_day">วันที่อ่าน (1-365)</Label>
                    <Input
                      id="reading_day"
                      type="number"
                      min="1"
                      max="365"
                      value={formData.reading_day}
                      onChange={(e) => setFormData(prev => ({ ...prev, reading_day: parseInt(e.target.value) }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="chapter">บท</Label>
                    <Input
                      id="chapter"
                      type="number"
                      min="1"
                      value={formData.chapter}
                      onChange={(e) => setFormData(prev => ({ ...prev, chapter: parseInt(e.target.value) }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="verse_start">ข้อเริ่มต้น</Label>
                    <Input
                      id="verse_start"
                      type="number"
                      min="1"
                      value={formData.verse_start}
                      onChange={(e) => setFormData(prev => ({ ...prev, verse_start: parseInt(e.target.value) }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="verse_end">ข้อสุดท้าย (ถ้ามี)</Label>
                    <Input
                      id="verse_end"
                      type="number"
                      min="1"
                      value={formData.verse_end || ''}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        verse_end: e.target.value ? parseInt(e.target.value) : null 
                      }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="content">เนื้อหาพระคัมภีร์ (ภาษาอังกฤษ)</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="content_thai">เนื้อหาพระคัมภีร์ (ภาษาไทย)</Label>
                  <Textarea
                    id="content_thai"
                    value={formData.content_thai}
                    onChange={(e) => setFormData(prev => ({ ...prev, content_thai: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="explanation">คำอธิบาย (ภาษาอังกฤษ)</Label>
                  <Textarea
                    id="explanation"
                    value={formData.explanation}
                    onChange={(e) => setFormData(prev => ({ ...prev, explanation: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="explanation_thai">คำอธิบาย (ภาษาไทย)</Label>
                  <Textarea
                    id="explanation_thai"
                    value={formData.explanation_thai}
                    onChange={(e) => setFormData(prev => ({ ...prev, explanation_thai: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    ยกเลิก
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "กำลังบันทึก..." : "บันทึก"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">กำลังโหลด...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>วันที่</TableHead>
                <TableHead>หนังสือ</TableHead>
                <TableHead>บท:ข้อ</TableHead>
                <TableHead>เนื้อหา</TableHead>
                <TableHead>การจัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {verses.map((verse) => (
                <TableRow key={verse.id}>
                  <TableCell>{verse.reading_day}</TableCell>
                  <TableCell>{verse.book}</TableCell>
                  <TableCell>
                    {verse.chapter}:{verse.verse_start}
                    {verse.verse_end && `-${verse.verse_end}`}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {verse.content_thai || verse.content}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(verse)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(verse.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
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

export default AdminBibleManagement;