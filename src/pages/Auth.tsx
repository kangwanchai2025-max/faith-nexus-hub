import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Mail, Lock, User as UserIcon, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { User, Session } from '@supabase/supabase-js';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Auth state management
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Redirect to dashboard if user is logged in
        if (session?.user) {
          navigate("/");
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    setIsLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: firstName,
            last_name: lastName,
          }
        }
      });

      if (error) {
        if (error.message.includes('already registered')) {
          toast({
            title: "ข้อผิดพลาด",
            description: "อีเมลนี้ได้ลงทะเบียนแล้ว กรุณาใช้อีเมลอื่นหรือเข้าสู่ระบบ",
            variant: "destructive",
          });
        } else {
          toast({
            title: "ข้อผิดพลาด",
            description: error.message,
            variant: "destructive",
          });
        }
        return;
      }

      toast({
        title: "สำเร็จ!",
        description: "ลงทะเบียนสำเร็จ กรุณาตรวจสอบอีเมลเพื่อยืนยันบัญชี",
      });
    } catch (error) {
      toast({
        title: "ข้อผิดพลาด",
        description: "เกิดข้อผิดพลาดในการลงทะเบียน",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "ข้อผิดพลาด",
          description: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "ยินดีต้อนรับ!",
        description: "เข้าสู่ระบบสำเร็จ",
      });
    } catch (error) {
      toast({
        title: "ข้อผิดพลาด",
        description: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const SignUpForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      signUp(email, password, firstName, lastName);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">ชื่อ</Label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="firstName"
                type="text"
                placeholder="ชื่อ"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">นามสกุล</Label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="lastName"
                type="text"
                placeholder="นามสกุล"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">อีเมล</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="อีเมลของคุณ"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">รหัสผ่าน</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder="รหัสผ่าน (อย่างน้อย 6 ตัวอักษร)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10"
              minLength={6}
              required
            />
          </div>
        </div>
        
        <Button type="submit" className="w-full" variant="divine" disabled={isLoading}>
          {isLoading ? "กำลังลงทะเบียน..." : "ลงทะเบียน"}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </form>
    );
  };

  const SignInForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      signIn(email, password);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="signInEmail">อีเมล</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="signInEmail"
              type="email"
              placeholder="อีเมลของคุณ"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="signInPassword">รหัสผ่าน</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="signInPassword"
              type="password"
              placeholder="รหัสผ่านของคุณ"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>
        
        <Button type="submit" className="w-full" variant="divine" disabled={isLoading}>
          {isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </form>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-divine rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-divine">
            <Heart className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-serif font-bold bg-gradient-divine bg-clip-text text-transparent">
            เน็กซัส
          </h1>
          <p className="text-muted-foreground mt-2">
            ชุมชนแห่งการอธิษฐานและการดูแลร่วมกัน
          </p>
        </div>

        <Card className="shadow-elegant border-border/50">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">ยินดีต้อนรับ</CardTitle>
            <CardDescription>
              เข้าร่วมชุมชนเพื่อแบ่งปันคำอธิษฐานและให้กำลังใจซึ่งกันและกัน
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">เข้าสู่ระบบ</TabsTrigger>
                <TabsTrigger value="signup">ลงทะเบียน</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <SignInForm />
              </TabsContent>
              
              <TabsContent value="signup">
                <SignUpForm />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          เพื่อเพิ่มความรวดเร็วในการทดสอบ คุณสามารถปิดการยืนยันอีเมลได้ใน{" "}
          <a 
            href="https://supabase.com/dashboard/project/yphbtrhnrlkovgqejdcn/auth/providers" 
            target="_blank" 
            rel="noopener noreferrer"
            className="underline text-primary hover:text-primary/80"
          >
            การตั้งค่า Authentication
          </a>
        </p>
      </div>
    </div>
  );
};

export default Auth;