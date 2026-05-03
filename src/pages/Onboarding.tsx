import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import AppHeader from "@/components/AppHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

const baseSchema = z.object({
  full_name: z.string().trim().min(2, "En az 2 karakter").max(100),
  country: z.string().trim().min(2).max(60),
  timezone: z.string().trim().min(2).max(60),
  bio: z.string().trim().max(500).optional(),
});

const studentSchema = baseSchema.extend({
  university: z.string().trim().min(2).max(120),
  skills: z.string().trim().max(300),
});

const businessSchema = baseSchema.extend({
  company_name: z.string().trim().min(2).max(120),
});

const mentorSchema = baseSchema.extend({
  skills: z.string().trim().max(300),
});

export default function Onboarding() {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    full_name: "", country: "", timezone: "", bio: "",
    university: "", company_name: "", skills: "", avatar_url: "",
  });
  const [avatarUploading, setAvatarUploading] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle().then(({ data }) => {
      if (data?.onboarded) { navigate("/dashboard"); return; }
      if (data) {
        setForm({
          full_name: data.full_name || "",
          country: data.country || "",
          timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || "",
          bio: data.bio || "",
          university: data.university || "",
          company_name: data.company_name || "",
          skills: (data.skills || []).join(", "),
          avatar_url: data.avatar_url || "",
        });
      }
    });
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !role) return;

    const schema = role === "student" ? studentSchema : role === "business" ? businessSchema : mentorSchema;
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast({ title: "Form geçersiz", description: parsed.error.errors[0].message, variant: "destructive" });
      return;
    }

    setSubmitting(true);
    const update: any = {
      full_name: form.full_name.trim(),
      country: form.country.trim(),
      timezone: form.timezone.trim(),
      bio: form.bio?.trim() || null,
      avatar_url: form.avatar_url || null,
      onboarded: true,
    };
    if (role === "student") {
      update.university = form.university.trim();
      update.skills = form.skills.split(",").map(s => s.trim()).filter(Boolean);
    } else if (role === "business") {
      update.company_name = form.company_name.trim();
    } else if (role === "mentor") {
      update.skills = form.skills.split(",").map(s => s.trim()).filter(Boolean);
    }

    const { error } = await supabase.from("profiles").update(update).eq("id", user.id);
    setSubmitting(false);
    if (error) toast({ title: "Kayıt hatası", description: error.message, variant: "destructive" });
    else { toast({ title: "Profilin tamamlandı 🎉" }); navigate("/dashboard"); }
  };

  if (loading || !user || !role) return <div className="min-h-screen bg-background"><AppHeader /></div>;

  const set = (k: string) => (e: any) => setForm({ ...form, [k]: e.target.value });

  const uploadAvatar = async (file: File) => {
    if (!user) return;
    setAvatarUploading(true);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${user.id}/avatar-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true, contentType: file.type });
    if (error) { toast({ title: "Yükleme hatası", description: error.message, variant: "destructive" }); setAvatarUploading(false); return; }
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    setForm((f) => ({ ...f, avatar_url: data.publicUrl }));
    setAvatarUploading(false);
    toast({ title: "Profil fotoğrafı yüklendi" });
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container py-10 max-w-2xl">
        <h1 className="text-3xl font-bold mb-2">Profilini tamamla</h1>
        <p className="text-muted-foreground mb-6 capitalize">Rol: {role}</p>

        <Card className="p-6 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label>Ad Soyad *</Label><Input required maxLength={100} value={form.full_name} onChange={set("full_name")} /></div>

            <div className="grid grid-cols-2 gap-4">
              <div><Label>Ülke *</Label><Input required placeholder="Türkiye" maxLength={60} value={form.country} onChange={set("country")} /></div>
              <div><Label>Saat dilimi *</Label><Input required placeholder="Europe/Istanbul" maxLength={60} value={form.timezone} onChange={set("timezone")} /></div>
            </div>

            {role === "student" && (
              <>
                <div><Label>Üniversite *</Label><Input required maxLength={120} value={form.university} onChange={set("university")} /></div>
                <div><Label>Yetkinlikler (virgülle) *</Label><Input required placeholder="React, SEO, Pazarlama" maxLength={300} value={form.skills} onChange={set("skills")} /></div>
              </>
            )}

            {role === "business" && (
              <div><Label>Şirket adı *</Label><Input required maxLength={120} value={form.company_name} onChange={set("company_name")} /></div>
            )}

            {role === "mentor" && (
              <div><Label>Uzmanlık alanları (virgülle) *</Label><Input required placeholder="Ürün, Büyüme, Mühendislik" maxLength={300} value={form.skills} onChange={set("skills")} /></div>
            )}

            <div>
              <Label>Hakkında</Label>
              <Textarea rows={4} maxLength={500} placeholder="Kısa biyografi..." value={form.bio} onChange={set("bio")} />
              <p className="text-xs text-muted-foreground mt-1">{form.bio.length}/500</p>
            </div>

            <Button type="submit" className="w-full bg-gradient-primary" disabled={submitting}>
              {submitting ? "Kaydediliyor..." : "Profili Kaydet"}
            </Button>
          </form>
        </Card>
      </main>
    </div>
  );
}
