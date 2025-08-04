import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Heart, 
  Users, 
  Shield,
  AlertTriangle,
  Send,
  ArrowLeft,
  Tag,
  Clock,
  Eye,
  EyeOff
} from "lucide-react";

interface PrayerFormData {
  title: string;
  description: string;
  category: string;
  careGroup: string;
  isUrgent: boolean;
  isPrivate: boolean;
  isAnonymous: boolean;
}

const categories = [
  "สุขภาพและการรักษา",
  "ครอบครัว",
  "ความสัมพันธ์",
  "งานและอาชีพ",
  "การชี้นำ",
  "ความกตัญญู",
  "การเงิน",
  "การเติบโตฝ่ายวิญญาณ",
  "ชุมชน",
  "อื่นๆ"
];

const careGroups = [
  "กลุ่มคนหนุ่มสาว",
  "กลุ่มครอบครัว",
  "กลุ่มผู้ทำงาน",
  "กลุ่มผู้สูงอายุ",
  "กลุ่มนักเรียน",
  "กลุ่มสมาชิกใหม่",
  "กลุ่มผู้ชาย",
  "กลุ่มผู้หญิง"
];

const NewPrayer = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<PrayerFormData>({
    title: "",
    description: "",
    category: "",
    careGroup: "",
    isUrgent: false,
    isPrivate: false,
    isAnonymous: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      toast({
        title: "ข้อมูลไม่ครบถ้วน",
        description: "กรุณากรอกหัวข้อและรายละเอียดคำอธิษฐาน",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "ส่งคำอธิษฐานสำเร็จ",
        description: "คำอธิษฐานของคุณได้ถูกส่งให้กับชุมชนแล้ว",
      });
      setIsSubmitting(false);
      navigate("/");
    }, 1500);
  };

  const updateFormData = (field: keyof PrayerFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-serif font-bold">แบ่งปันคำอธิษฐาน</h1>
            <p className="text-muted-foreground">ให้ชุมชนของเราร่วมอธิษฐานกับคุณ</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="bg-card/60 backdrop-blur-sm border-border/50 shadow-peaceful">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                รายละเอียดคำอธิษฐาน
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-base font-medium">
                    หัวข้อคำอธิษฐาน *
                  </Label>
                  <Input
                    id="title"
                    placeholder="หัวข้อสั้นๆ ที่มีความหมายสำหรับคำอธิษฐานของคุณ"
                    value={formData.title}
                    onChange={(e) => updateFormData("title", e.target.value)}
                    className="bg-background/50 border-border/50 text-base"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-base font-medium">
                    รายละเอียดคำอธิษฐาน *
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="แบ่งปันรายละเอียดเพิ่มเติมเกี่ยวกับคำอธิษฐานของคุณ เปิดใจเท่าที่คุณสบายใจ..."
                    value={formData.description}
                    onChange={(e) => updateFormData("description", e.target.value)}
                    className="bg-background/50 border-border/50 min-h-32 text-base"
                  />
                  <p className="text-sm text-muted-foreground">
                    {formData.description.length}/500 characters
                  </p>
                </div>

                {/* Category and Care Group */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-base font-medium flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      หมวดหมู่
                    </Label>
                    <Select onValueChange={(value) => updateFormData("category", value)}>
                      <SelectTrigger className="bg-background/50 border-border/50">
                        <SelectValue placeholder="เลือกหมวดหมู่" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-medium flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      กลุ่มดูแล
                    </Label>
                    <Select onValueChange={(value) => updateFormData("careGroup", value)}>
                      <SelectTrigger className="bg-background/50 border-border/50">
                        <SelectValue placeholder="เลือกกลุ่มดูแลของคุณ" />
                      </SelectTrigger>
                      <SelectContent>
                        {careGroups.map((group) => (
                          <SelectItem key={group} value={group}>
                            {group}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Prayer Options */}
                <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border/50">
                  <h3 className="font-medium flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    การตั้งค่าคำอธิษฐาน
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Urgent */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                        <div>
                          <Label htmlFor="urgent" className="font-medium">
                            ระบุเป็นเร่งด่วน
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            คำอธิษฐานเร่งด่วนจะได้รับความสำคัญในฟีดชุมชน
                          </p>
                        </div>
                      </div>
                      <Switch
                        id="urgent"
                        checked={formData.isUrgent}
                        onCheckedChange={(checked) => updateFormData("isUrgent", checked)}
                      />
                    </div>

                    {/* Private */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <EyeOff className="w-4 h-4 text-blue-500" />
                        <div>
                          <Label htmlFor="private" className="font-medium">
                            เฉพาะกลุ่มดูแล
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            มองเห็นได้เฉพาะสมาชิกในกลุ่มดูแลของคุณ
                          </p>
                        </div>
                      </div>
                      <Switch
                        id="private"
                        checked={formData.isPrivate}
                        onCheckedChange={(checked) => updateFormData("isPrivate", checked)}
                      />
                    </div>

                    {/* Anonymous */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-green-500" />
                        <div>
                          <Label htmlFor="anonymous" className="font-medium">
                            ส่งแบบไม่ระบุชื่อ
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            ชื่อของคุณจะไม่แสดงในคำขอนี้
                          </p>
                        </div>
                      </div>
                      <Switch
                        id="anonymous"
                        checked={formData.isAnonymous}
                        onCheckedChange={(checked) => updateFormData("isAnonymous", checked)}
                      />
                    </div>
                  </div>
                </div>

                {/* Selected Options Preview */}
                {(formData.category || formData.careGroup || formData.isUrgent || formData.isPrivate || formData.isAnonymous) && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">ตัวอย่าง:</Label>
                    <div className="flex flex-wrap gap-2">
                      {formData.category && (
                        <Badge variant="outline">{formData.category}</Badge>
                      )}
                      {formData.careGroup && (
                        <Badge variant="secondary">{formData.careGroup}</Badge>
                      )}
                      {formData.isUrgent && (
                        <Badge variant="destructive">เร่งด่วน</Badge>
                      )}
                      {formData.isPrivate && (
                        <Badge className="bg-blue-500 hover:bg-blue-600">ส่วนตัว</Badge>
                      )}
                      {formData.isAnonymous && (
                        <Badge className="bg-green-500 hover:bg-green-600">ไม่ระบุชื่อ</Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Submit */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate(-1)}
                  >
                    ยกเลิก
                  </Button>
                  <Button
                    type="submit"
                    variant="divine"
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Clock className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        แบ่งปันคำอธิษฐาน
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NewPrayer;