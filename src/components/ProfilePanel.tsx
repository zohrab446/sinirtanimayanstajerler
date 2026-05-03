import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Camera, Loader2 } from "lucide-react";

type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  university: string | null;
  company_name: string | null;
  country: string | null;
  bio: string | null;
};

function Avatar({ url, name, size = "lg" }: { url?: string | null; name?: string | null; size?: "lg" | "xl" }) {
  const dim = size === "xl" ? "w-20 h-20 text-2xl" : "w-16 h-16 text-xl";
  return (
    <div className={`${dim} rounded-full bg-white/20 border-2 border-white/40 overflow-hidden flex items-center justify-center font-bold shrink-0`}>
      {url ? <img src={url} alt={name || ""} className="w-full h-full object-cover" /> : (name?.charAt(0).toUpperCase() || "👤")}
    </div>
  );
}


export default function ProfilePanel() {
  const { user, role } = useAuth();
  const [me, setMe] = useState<Profile | null>(null);
  const [partner, setPartner] = useState<{ profile: Profile; label: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = async (file: File) => {
    if (!user) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Dosya çok büyük", description: "Maksimum 5MB", variant: "destructive" });
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true, contentType: file.type });
    if (upErr) { toast({ title: "Yükleme hatası", description: upErr.message, variant: "destructive" }); setUploading(false); return; }
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    const { error: updErr } = await supabase.from("profiles").update({ avatar_url: data.publicUrl }).eq("id", user.id);
    if (updErr) { toast({ title: "Hata", description: updErr.message, variant: "destructive" }); setUploading(false); return; }
    setMe((prev) => prev ? { ...prev, avatar_url: data.publicUrl } : prev);
    toast({ title: "Profil fotoğrafı güncellendi" });
    setUploading(false);
  };


  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: myProf } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      setMe(myProf as Profile);

      // Find latest engagement and pick the partner
      const { data: engs } = await supabase.from("engagements")
        .select("student_id, business_id, mentor_id, status, created_at")
        .or(`student_id.eq.${user.id},business_id.eq.${user.id},mentor_id.eq.${user.id}`)
        .order("created_at", { ascending: false })
        .limit(1);
      const e = engs?.[0];
      if (!e) { setPartner(null); return; }

      let partnerId: string | null = null;
      let label = "";
      if (role === "student") {
        partnerId = e.mentor_id || e.business_id;
        label = e.mentor_id ? "Mentor" : "İşletme";
      } else if (role === "business") {
        partnerId = e.mentor_id || e.student_id;
        label = e.mentor_id ? "Mentor" : "Öğrenci";
      } else {
        partnerId = e.student_id;
        label = "Öğrenci";
      }
      if (!partnerId) { setPartner(null); return; }
      const { data: pProf } = await supabase.from("profiles").select("*").eq("id", partnerId).maybeSingle();
      if (pProf) setPartner({ profile: pProf as Profile, label });
    })();
  }, [user, role]);

  return (
    <div className="grid gap-4 md:grid-cols-2 mb-8">
      {/* Sol — Kullanıcı kartı */}
      <Card className="p-7 border-0 shadow-card text-white bg-gradient-to-br from-violet-600 via-fuchsia-500 to-pink-500 overflow-hidden min-h-[180px] flex items-center">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Avatar url={me?.avatar_url} name={me?.full_name} size="xl" />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              aria-label="Profil fotoğrafı yükle"
              className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
            >
              {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleAvatarUpload(f); e.target.value = ""; }}
            />
          </div>
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wider text-white/80">{role === "student" ? "Öğrenci" : role === "business" ? "İşletme" : "Mentor"}</p>
            <h2 className="text-lg font-bold truncate">{me?.full_name || "Kullanıcı"}</h2>
            <p className="text-xs text-white/80 truncate">
              {me?.university || me?.company_name || me?.country || ""}
            </p>
          </div>
        </div>
      </Card>

      {/* Sağ — Mentor / İşletme kartı */}
      <Card className="md:col-span-3 p-7 border-0 shadow-card text-white bg-gradient-to-br from-cyan-500 via-teal-500 to-emerald-500 overflow-hidden min-h-[180px] flex items-center">
        {partner ? (
          <div className="flex items-center gap-5 w-full">
            <div className="w-24 h-24 rounded-full bg-white/20 border-2 border-white/40 overflow-hidden flex items-center justify-center font-bold shrink-0 text-3xl">
              {partner.profile.avatar_url ? <img src={partner.profile.avatar_url} alt={partner.profile.full_name || ""} className="w-full h-full object-cover" /> : (partner.profile.full_name?.charAt(0).toUpperCase() || "👤")}
            </div>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wider text-white/80">{partner.label}</p>
              <h2 className="text-2xl font-bold truncate">
                {partner.profile.company_name || partner.profile.full_name || "—"}
              </h2>
              <p className="text-sm text-white/80 truncate mt-1">{partner.profile.country || partner.profile.bio || ""}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-3xl">🤝</div>
            <div>
              <p className="text-xs uppercase tracking-wider text-white/80">Eşleşme Yok</p>
              <h2 className="text-lg font-bold">Henüz aktif çalışma yok</h2>
              <p className="text-xs text-white/80">Bir projeye başvur ya da proje aç</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
