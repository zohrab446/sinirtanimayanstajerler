import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import AppHeader from "@/components/AppHeader";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase } from "lucide-react";
import { countryFlag } from "@/lib/flag";

type Eng = {
  id: string;
  status: string;
  projects?: { title: string; category: string | null; country: string | null } | null;
};

export default function Workspaces() {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  const [engs, setEngs] = useState<Eng[]>([]);

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate("/auth"); return; }
    const col = role === "business" ? "business_id" : role === "mentor" ? "mentor_id" : "student_id";
    supabase.from("engagements")
      .select("*, projects(title, category, country)")
      .eq(col, user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setEngs((data ?? []) as Eng[]));
  }, [user, role, loading, navigate]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AppHeader />
          <div className="flex items-center gap-3 px-6 py-3 border-b">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold">Çalışmalarım</h1>
          </div>
          <main className="flex-1 p-6">
            {engs.length === 0 ? (
              <Card className="p-10 text-center text-muted-foreground">
                <Briefcase className="w-10 h-10 mx-auto mb-3" />
                Henüz aktif çalışma yok.
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {engs.map((e) => (
                  <Card key={e.id} className="p-5 hover:border-primary transition-colors">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold">{e.projects?.title}</h3>
                      <Badge variant={e.status === "active" ? "default" : "secondary"}>{e.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-4">
                      {e.projects?.category} · {countryFlag(e.projects?.country)} {e.projects?.country}
                    </p>
                    <Link to={`/engagements/${e.id}`}>
                      <Button size="sm" variant="outline">Çalışmaya Git</Button>
                    </Link>
                  </Card>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
