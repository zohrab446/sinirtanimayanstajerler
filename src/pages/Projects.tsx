import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AppHeader from "@/components/AppHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, Clock, MapPin } from "lucide-react";

interface Project {
  id: string; title: string; description: string; category: string | null;
  skills_needed: string[]; duration_weeks: number | null; country: string | null; status: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("projects").select("*").eq("status", "open").order("created_at", { ascending: false })
      .then(({ data }) => { setProjects(data ?? []); setLoading(false); });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Açık Projeler</h1>
          <p className="text-muted-foreground">Gelişmekte olan ülkelerden gerçek danışmanlık fırsatları.</p>
        </div>

        {loading ? <p className="text-muted-foreground">Yükleniyor...</p> :
         projects.length === 0 ? (
          <Card className="p-12 text-center">
            <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">Henüz proje yok</h3>
            <p className="text-muted-foreground text-sm">İşletme olarak kayıt olup ilk projeyi oluşturabilirsin.</p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((p) => (
              <Card key={p.id} className="overflow-hidden hover:shadow-elegant transition-smooth flex flex-col">
                {(p as any).cover_url && (
                  <img src={(p as any).cover_url} alt={p.title} className="w-full h-40 object-cover" />
                )}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="secondary">{p.category || "Genel"}</Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{p.duration_weeks}h</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">{p.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">{p.description}</p>
                  {p.country && <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1"><span>{countryFlag(p.country)}</span>{p.country}</p>}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {p.skills_needed?.slice(0, 4).map((s) => <Badge key={s} variant="outline" className="text-xs">{s}</Badge>)}
                  </div>
                  <Link to={`/projects/${p.id}`}><Button className="w-full" variant="outline">Detay & Başvur</Button></Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
