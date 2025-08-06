-- Create user roles system
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'member');

CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'member',
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create a security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view all role assignments"
ON public.user_roles
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Bible reading system
CREATE TABLE public.bible_verses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  book TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse_start INTEGER NOT NULL,
  verse_end INTEGER,
  content TEXT NOT NULL,
  content_thai TEXT,
  explanation TEXT,
  explanation_thai TEXT,
  reading_day INTEGER NOT NULL, -- Day 1-365 of reading plan
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on bible_verses (public reading)
ALTER TABLE public.bible_verses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view bible verses"
ON public.bible_verses
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage bible verses"
ON public.bible_verses
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- User bible reading progress
CREATE TABLE public.user_bible_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reading_day INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT,
  UNIQUE(user_id, reading_day)
);

-- Enable RLS on user_bible_progress
ALTER TABLE public.user_bible_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own bible progress"
ON public.user_bible_progress
FOR ALL
USING (auth.uid() = user_id);

-- Prayer likes system
CREATE TABLE public.prayer_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prayer_id UUID NOT NULL REFERENCES public.prayers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(prayer_id, user_id)
);

-- Enable RLS on prayer_likes
ALTER TABLE public.prayer_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own likes"
ON public.prayer_likes
FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Users can view all likes"
ON public.prayer_likes
FOR SELECT
USING (true);

-- Prayer comments system
CREATE TABLE public.prayer_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prayer_id UUID NOT NULL REFERENCES public.prayers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on prayer_comments
ALTER TABLE public.prayer_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create comments"
ON public.prayer_comments
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
ON public.prayer_comments
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
ON public.prayer_comments
FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Users can view comments on visible prayers"
ON public.prayer_comments
FOR SELECT
USING (
  EXISTS (
    SELECT 1 
    FROM prayers p 
    WHERE p.id = prayer_comments.prayer_id 
    AND (
      NOT p.is_private 
      OR p.user_id = auth.uid() 
      OR (
        p.is_private 
        AND p.care_group_id IS NOT NULL 
        AND EXISTS (
          SELECT 1 
          FROM group_members 
          WHERE group_members.group_id = p.care_group_id 
          AND group_members.user_id = auth.uid()
        )
      )
    )
  )
);

-- Add updated_at trigger for prayer_comments
CREATE TRIGGER update_prayer_comments_updated_at
BEFORE UPDATE ON public.prayer_comments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- User achievements system
CREATE TABLE public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL,
  achievement_data JSONB,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on user_achievements
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own achievements"
ON public.user_achievements
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "System can create achievements"
ON public.user_achievements
FOR INSERT
WITH CHECK (true);

-- Add storage bucket for profile pictures
INSERT INTO storage.buckets (id, name, public) 
VALUES ('profile-pictures', 'profile-pictures', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for profile pictures
CREATE POLICY "Users can upload their own profile pictures"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'profile-pictures' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own profile pictures"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'profile-pictures' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own profile pictures"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'profile-pictures' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Profile pictures are publicly viewable"
ON storage.objects
FOR SELECT
USING (bucket_id = 'profile-pictures');

-- Insert sample Bible verses for 365-day reading plan (first 10 days as example)
INSERT INTO public.bible_verses (book, chapter, verse_start, verse_end, content, content_thai, explanation, explanation_thai, reading_day) VALUES
('Genesis', 1, 1, 3, 'In the beginning God created the heavens and the earth. Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters. And God said, "Let there be light," and there was light.', 'ในปฐมกาลพระเจ้าทรงสร้างฟ้าและแผ่นดิน แผ่นดินนั้นไร้รูปและว่างเปล่า ความมืดปกคลุมผิวน้ำ และพระวิญญาณของพระเจ้าทรงสั่นไหวเหนือผิวน้ำ พระเจ้าตรัสว่า "จงมีความสว่าง" แล้วก็มีความสว่าง', 'God begins creation with light, showing His power over darkness and chaos.', 'พระเจ้าเริ่มต้นการสร้างด้วยแสงสว่าง แสดงให้เห็นฤทธิ์อำนาจของพระองค์เหนือความมืดและความวุ่นวาย', 1),
('Genesis', 1, 26, 28, 'Then God said, "Let us make mankind in our image, in our likeness, so that they may rule over the fish in the sea and the birds in the sky, over the livestock and all the wild animals, and over all the creatures that move along the ground." So God created mankind in his own image, in the image of God he created them; male and female he created them.', 'พระเจ้าตรัสว่า "ให้เราสร้างมนุษย์ตามแบบของเรา ตามความคล้ายคลึงของเรา เพื่อให้พวกเขาปกครองปลาในทะเล และนกในอากาศ และสัตว์ใช้งาน และสัตว์ป่าทั้งปวง และสัตว์ที่เลื้อยคลานบนแผ่นดิน" พระเจ้าจึงทรงสร้างมนุษย์ตามแบบของพระองค์ ตามแบบของพระเจ้าพระองค์ทรงสร้างเขา ทรงสร้างเขาเป็นชายและหญิง', 'Humanity is created in Gods image, with dignity and purpose to steward creation.', 'มนุษยชาติถูกสร้างตามแบบพระเจ้า มีศักดิ์ศรีและจุดประสงค์เพื่อดูแลสิ่งสร้าง', 2),
('Genesis', 2, 7, 7, 'Then the Lord God formed a man from the dust of the ground and breathed into his nostrils the breath of life, and the man became a living being.', 'พระยาห์เวห์พระเจ้าทรงปั้นมนุษย์จากผงคลีดิน และทรงเป่าลมหายใจแห่งชีวิตเข้าไปในจมูกของเขา มนุษย์จึงกลายเป็นสิ่งมีชีวิต', 'God personally creates humanity, showing His intimate care and the sacred nature of human life.', 'พระเจ้าทรงสร้างมนุษยชาติด้วยพระองค์เอง แสดงให้เห็นการดูแลอย่างใกล้ชิดและธรรมชาติอันศักดิ์สิทธิ์ของชีวิตมนุษย์', 3);

-- Add sample user roles (make first user admin if exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM auth.users LIMIT 1) THEN
    INSERT INTO public.user_roles (user_id, role, assigned_at)
    SELECT id, 'admin', now()
    FROM auth.users 
    ORDER BY created_at ASC 
    LIMIT 1
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END $$;