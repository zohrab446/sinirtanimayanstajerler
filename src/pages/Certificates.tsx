import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import AppHeader from "@/components/AppHeader";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Card } from "@/components/ui/card";
import { Award } from "lucide-react";
import { countryFlag } from "@/lib/flag";

type Eng = {
  id: string;
  status: string;
  end_date: string | null;
  projects?: { title: string; category: string | null; country: string | null } | null;
};

export default function Certificates() {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  const [completed, setCompleted] = useState<Eng[]>([]);

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate("/auth"); return; }
    const col = role === "business" ? "business_id" : role === "mentor" ? "mentor_id" : "student_id";
    supabase.from("engagements")
      .select("id, status, end_date, projects(title, category, country)")
      .eq(col, user.id)
      .eq("status", "completed")
      .order("end_date", { ascending: false })
      .then(({ data }) => setCompleted((data ?? []) as Eng[]));
  }, [user, role, loading, navigate]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AppHeader />
          <div className="flex items-center gap-3 px-6 py-3 border-b">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold">Sertifikalar</h1>
          </div>
          <main className="flex-1 p-6">
            {completed.length === 0 ? (
              <Card className="p-10 text-center text-muted-foreground">
                <Award className="w-10 h-10 mx-auto mb-3" />
                Henüz tamamlanmış bir çalışma yok. Tamamladığın projelerden sertifika kazanırsın.
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {completed.map((e) => (
                  <Card key={e.id} className="p-6 border-2 border-amber-300/50 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 relative overflow-hidden">
                    <div className="absolute top-3 right-3 w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 mb-2">Sertifika</p>
                    <h3 className="font-bold text-lg pr-14 mb-2">{e.projects?.title}</h3>
                    <p className="text-xs text-muted-foreground mb-4">
                      {e.projects?.category} · {countryFlag(e.projects?.country)} {e.projects?.country}
                    </p>
                    {e.end_date && (
                      <p className="text-xs text-muted-foreground">
                        Tamamlandı: {new Date(e.end_date).toLocaleDateString("tr-TR")}
                      </p>
                    )}
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
