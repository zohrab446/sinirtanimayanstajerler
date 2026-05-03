import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import AppHeader from "@/components/AppHeader";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Card } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

type Engagement = {
  id: string;
  projects?: { title: string | null } | null;
};

type MessageRow = {
  id: string;
  body: string;
  created_at: string;
  engagement_id: string;
  sender?: { full_name: string | null } | null;
};

export default function Messages() {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [messagesByEng, setMessagesByEng] = useState<Record<string, MessageRow | undefined>>({});

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate("/auth"); return; }
    const col = role === "business" ? "business_id" : role === "mentor" ? "mentor_id" : "student_id";
    (async () => {
      const { data: engs } = await supabase.from("engagements")
        .select("id, projects(title)")
        .eq(col, user.id)
        .order("created_at", { ascending: false });
      const list = (engs ?? []) as Engagement[];
      setEngagements(list);
      if (list.length === 0) return;
      const ids = list.map((e) => e.id);
      const { data: msgs } = await supabase.from("messages")
        .select("id, body, created_at, engagement_id, sender:profiles!messages_sender_profiles_fkey(full_name)")
        .in("engagement_id", ids)
        .order("created_at", { ascending: false });
      const map: Record<string, MessageRow | undefined> = {};
      (msgs ?? []).forEach((m: any) => { if (!map[m.engagement_id]) map[m.engagement_id] = m; });
      setMessagesByEng(map);
    })();
  }, [user, role, loading, navigate]);

  const sorted = useMemo(() => {
    return [...engagements].sort((a, b) => {
      const ta = messagesByEng[a.id]?.created_at || "";
      const tb = messagesByEng[b.id]?.created_at || "";
      return tb.localeCompare(ta);
    });
  }, [engagements, messagesByEng]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AppHeader />
          <div className="flex items-center gap-3 px-6 py-3 border-b">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold">Mesajlar</h1>
          </div>
          <main className="flex-1 p-6">
            {sorted.length === 0 ? (
              <Card className="p-10 text-center text-muted-foreground">
                <MessageSquare className="w-10 h-10 mx-auto mb-3" />
                Henüz mesajlaşacak çalışma yok.
              </Card>
            ) : (
              <div className="space-y-3 max-w-3xl">
                {sorted.map((e) => {
                  const last = messagesByEng[e.id];
                  return (
                    <Link key={e.id} to={`/engagements/${e.id}`}>
                      <Card className="p-4 hover:border-primary transition-colors flex items-center gap-4">
                        <div className="w-11 h-11 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                          <MessageSquare className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-semibold truncate">{e.projects?.title || "Çalışma"}</p>
                            {last && (
                              <span className="text-xs text-muted-foreground shrink-0">
                                {new Date(last.created_at).toLocaleDateString("tr-TR")}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {last ? `${last.sender?.full_name || "Kullanıcı"}: ${last.body}` : "Henüz mesaj yok"}
                          </p>
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
