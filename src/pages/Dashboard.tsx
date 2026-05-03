import { useCallback, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import AppHeader from "@/components/AppHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Plus, Briefcase } from "lucide-react";

type Application = {
  id: string;
  status: string;
  student_id: string;
  cover_letter: string | null;
  profiles?: { full_name: string | null; university?: string | null } | null;
  projects?: { title: string; category: string | null; country: string | null } | null;
};

type Project = {
  id: string;
  title: string;
  description: string;
  category: string | null;
  country: string | null;
  duration_weeks: number | null;
  status: string;
  applications?: Application[] | null;
};

type Engagement = {
  id: string;
  application_id: string;
  status: string;
  projects?: { title: string; category: string | null; country: string | null } | null;
};

export default function Dashboard() {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", category: "", skills: "", duration_weeks: 4, country: "" });

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate("/auth"); return; }
    supabase.from("profiles").select("onboarded").eq("id", user.id).maybeSingle()
      .then(({ data }) => { if (data && !data.onboarded) navigate("/onboarding"); });
  }, [user, loading, navigate]);

  const refresh = useCallback(async () => {
    if (!user || !role) return;
    if (role === "business") {
      const { data } = await supabase.from("projects").select("*, applications(id, status, student_id, cover_letter, profiles:student_id(full_name, university))").eq("business_id", user.id).order("created_at", { ascending: false });
      setProjects((data ?? []) as Project[]);
    } else if (role === "student") {
      const { data } = await supabase.from("applications").select("*, projects(title, category, country)").eq("student_id", user.id).order("created_at", { ascending: false });
      setApplications((data ?? []) as Application[]);
    }
    const col = role === "business" ? "business_id" : role === "mentor" ? "mentor_id" : "student_id";
    const { data: engs } = await supabase.from("engagements").select("*, projects(title, category, country)").eq(col, user.id).order("created_at", { ascending: false });
    setEngagements((engs ?? []) as Engagement[]);
  }, [user, role]);

  useEffect(() => { refresh(); }, [refresh]);

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("projects").insert({
      business_id: user!.id,
      title: form.title, description: form.description, category: form.category,
      skills_needed: form.skills.split(",").map(s => s.trim()).filter(Boolean),
      duration_weeks: Number(form.duration_weeks), country: form.country,
    });
    if (error) toast({ title: "Hata", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Proje oluşturuldu" });
      setForm({ title: "", description: "", category: "", skills: "", duration_weeks: 4, country: "" });
      setShowForm(false); refresh();
    }
  };

  const updateAppStatus = async (appId: string, status: string) => {
    const { error } = await supabase.from("applications").update({ status }).eq("id", appId);
    if (error) toast({ title: "Hata", description: error.message, variant: "destructive" });
    else { toast({ title: `Başvuru ${status}` }); refresh(); }
  };

  if (loading || !user) return <div className="min-h-screen bg-background"><AppHeader /></div>;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container py-8">
        <h1 className="text-3xl font-bold mb-2">Paneliniz</h1>
        <p className="text-muted-foreground mb-8 capitalize">Rol: {role || "tanımsız"}</p>

        {engagements.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Aktif Çalışmalarım ({engagements.length})</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {engagements.map((e) => (
                <Link key={e.id} to={`/engagements/${e.id}`}>
                  <Card className="p-4 hover:border-primary transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{e.projects?.title}</h3>
                        <p className="text-xs text-muted-foreground">{e.projects?.category} · {e.projects?.country}</p>
                      </div>
                      <Badge variant={e.status === "active" ? "default" : "secondary"}>{e.status}</Badge>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {role === "business" && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Projelerim ({projects.length})</h2>
              <Button onClick={() => setShowForm(!showForm)} className="bg-gradient-primary"><Plus className="w-4 h-4" />Yeni Proje</Button>
            </div>

            {showForm && (
              <Card className="p-6 mb-6">
                <form onSubmit={createProject} className="space-y-4">
                  <div><Label>Başlık</Label><Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
                  <div><Label>Açıklama</Label><Textarea required rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Kategori</Label><Input placeholder="Pazarlama, Yazılım..." value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
                    <div><Label>Ülke</Label><Input placeholder="Kenya" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Yetkinlikler (virgülle)</Label><Input placeholder="React, SEO" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} /></div>
                    <div><Label>Süre (hafta)</Label><Input type="number" min={1} value={form.duration_weeks} onChange={(e) => setForm({ ...form, duration_weeks: Number(e.target.value) })} /></div>
                  </div>
                  <Button type="submit">Oluştur</Button>
                </form>
              </Card>
            )}

            <div className="space-y-4">
              {projects.length === 0 && <Card className="p-8 text-center text-muted-foreground"><Briefcase className="w-10 h-10 mx-auto mb-2" />Henüz proje yok</Card>}
              {projects.map((p) => (
                <Card key={p.id} className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-lg">{p.title}</h3>
                      <p className="text-sm text-muted-foreground">{p.category} · {p.country} · {p.duration_weeks}h</p>
                    </div>
                    <Badge variant={p.status === "open" ? "default" : "secondary"}>{p.status}</Badge>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <p className="text-sm font-semibold mb-2">Başvurular ({p.applications?.length || 0})</p>
                    {p.applications?.length === 0 && <p className="text-xs text-muted-foreground">Henüz başvuru yok</p>}
                    <div className="space-y-2">
                      {p.applications?.map((a: any) => {
                        const relatedEngagement = engagements.find((e) => e.application_id === a.id);
                        return (
                          <div key={a.id} className="flex justify-between items-center gap-2 p-3 bg-secondary/40 rounded-md">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium">{a.profiles?.full_name || "Öğrenci"}</p>
                              <p className="text-xs text-muted-foreground truncate">{a.cover_letter || "-"}</p>
                            </div>
                            <Badge variant="outline">{a.status}</Badge>
                            {a.status === "pending" && (
                              <div className="flex gap-1">
                                <Button size="sm" variant="outline" onClick={() => updateAppStatus(a.id, "accepted")}>✓</Button>
                                <Button size="sm" variant="outline" onClick={() => updateAppStatus(a.id, "rejected")}>✕</Button>
                              </div>
                            )}
                            {a.status === "accepted" && relatedEngagement && (
                              <Link to={`/engagements/${relatedEngagement.id}`}>
                                <Button size="sm" variant="outline">Görev Ata</Button>
                              </Link>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {role === "student" && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Başvurularım ({applications.length})</h2>
              <Link to="/projects"><Button className="bg-gradient-primary">Proje Bul</Button></Link>
            </div>
            <div className="space-y-3">
              {applications.length === 0 && <Card className="p-8 text-center text-muted-foreground">Henüz başvuru yok. <Link to="/projects" className="text-primary underline">Projelere göz at</Link></Card>}
              {applications.map((a) => (
                <Card key={a.id} className="p-5 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{a.projects?.title}</h3>
                    <p className="text-xs text-muted-foreground">{a.projects?.category} · {a.projects?.country}</p>
                  </div>
                  <Badge variant={a.status === "accepted" ? "default" : a.status === "rejected" ? "destructive" : "secondary"}>{a.status}</Badge>
                </Card>
              ))}
            </div>
          </>
        )}

        {role === "mentor" && (
          <Card className="p-8 text-center">
            <h3 className="font-semibold mb-2">Mentor paneli yakında</h3>
            <p className="text-sm text-muted-foreground">Atandığın takımları burada göreceksin.</p>
          </Card>
        )}
      </main>
    </div>
  );
}
