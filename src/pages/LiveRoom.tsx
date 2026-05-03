import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import AppHeader from "@/components/AppHeader";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, Users, LogOut } from "lucide-react";
import { countryFlag } from "@/lib/flag";
import { toast } from "@/hooks/use-toast";

type Eng = {
  id: string;
  status: string;
  projects?: { title: string; category: string | null; country: string | null } | null;
};

export default function LiveRoom() {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [engs, setEngs] = useState<Eng[]>([]);
  const [joined, setJoined] = useState<string | null>(null);
  const [participants, setParticipants] = useState<string[]>([]);

  const activeId = params.get("engagement");

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate("/auth"); return; }
    const col = role === "business" ? "business_id" : role === "mentor" ? "mentor_id" : "student_id";
    supabase.from("engagements")
      .select("id, status, projects(title, category, country)")
      .eq(col, user.id)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .then(({ data }) => setEngs((data ?? []) as Eng[]));
  }, [user, role, loading, navigate]);

  const activeEng = useMemo(() => engs.find((e) => e.id === activeId), [engs, activeId]);

  useEffect(() => {
    if (!activeId || !user) { setJoined(null); setParticipants([]); return; }
    const channel = supabase.channel(`live-room-${activeId}`, {
      config: { presence: { key: user.id } },
    });
    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        setParticipants(Object.keys(state));
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ joined_at: new Date().toISOString() });
          setJoined(activeId);
        }
      });
    return () => { supabase.removeChannel(channel); setJoined(null); };
  }, [activeId, user]);

  const join = (id: string) => setParams({ engagement: id });
  const leave = () => { setParams({}); toast({ title: "Odadan çıkıldı" }); };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AppHeader />
          <div className="flex items-center gap-3 px-6 py-3 border-b">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold">Canlı Yayın Odası</h1>
          </div>
          <main className="flex-1 p-6">
            {activeId && activeEng ? (
              <div className="max-w-5xl mx-auto space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Aktif oda</p>
                    <h2 className="text-2xl font-bold">{activeEng.projects?.title}</h2>
                  </div>
                  <Button variant="outline" onClick={leave}><LogOut className="w-4 h-4 mr-2" />Odadan Çık</Button>
                </div>
                <Card className="aspect-video bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center text-white relative overflow-hidden">
                  <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/90 text-xs font-semibold">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" /> CANLI
                  </div>
                  <div className="text-center">
                    <Video className="w-16 h-16 mx-auto mb-3 opacity-70" />
                    <p className="font-semibold">{joined ? "Yayın bağlantısı kuruldu" : "Bağlanıyor..."}</p>
                    <p className="text-sm opacity-70 mt-1">{activeEng.projects?.category} · {countryFlag(activeEng.projects?.country)} {activeEng.projects?.country}</p>
                  </div>
                </Card>
                <Card className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <p className="font-semibold">Odadaki Katılımcılar ({participants.length})</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {participants.map((p) => (
                      <Badge key={p} variant="secondary" className="font-mono text-xs">
                        {p === user?.id ? "Sen" : p.slice(0, 8)}
                      </Badge>
                    ))}
                    {participants.length === 0 && <p className="text-sm text-muted-foreground">Henüz katılımcı yok</p>}
                  </div>
                </Card>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto">
                <p className="text-muted-foreground mb-6">
                  Katılmak istediğiniz aktif çalışmayı seçin. Aynı odadaki diğer üyelerle gerçek zamanlı buluşun.
                </p>
                {engs.length === 0 ? (
                  <Card className="p-10 text-center text-muted-foreground">
                    <Video className="w-10 h-10 mx-auto mb-3" />
                    Şu an aktif bir çalışma yok. Önce bir başvurun kabul edilmeli.
                  </Card>
                ) : (
                  <div className="grid gap-3">
                    {engs.map((e) => (
                      <Card key={e.id} className="p-4 flex items-center justify-between gap-3 hover:border-primary transition-colors">
                        <div className="min-w-0">
                          <h3 className="font-semibold truncate">{e.projects?.title}</h3>
                          <p className="text-xs text-muted-foreground truncate">
                            {e.projects?.category} · {countryFlag(e.projects?.country)} {e.projects?.country}
                          </p>
                        </div>
                        <Button onClick={() => join(e.id)} className="shrink-0">
                          <Video className="w-4 h-4 mr-2" /> Odaya Katıl
                        </Button>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
