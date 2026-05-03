import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import AppHeader from "@/components/AppHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Clock, MapPin } from "lucide-react";

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const [project, setProject] = useState<any>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [applied, setApplied] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    supabase.from("projects").select("*").eq("id", id).maybeSingle().then(({ data }) => setProject(data));
    if (user) {
      supabase.from("applications").select("id").eq("project_id", id).eq("student_id", user.id).maybeSingle()
        .then(({ data }) => setApplied(!!data));
    }
  }, [id, user]);

  const apply = async () => {
    if (!user) { navigate("/auth"); return; }
    setSubmitting(true);
    const { error } = await supabase.from("applications").insert({
      project_id: id!, student_id: user.id, cover_letter: coverLetter,
    });
    setSubmitting(false);
    if (error) toast({ title: "Başvuru başarısız", description: error.message, variant: "destructive" });
    else { setApplied(true); toast({ title: "Başvurun gönderildi!" }); }
  };

  if (!project) return <div className="min-h-screen bg-background"><AppHeader /><div className="container py-12">Yükleniyor...</div></div>;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container py-8 max-w-3xl">
        <Link to="/projects" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Tüm projeler
        </Link>
        <Card className="overflow-hidden shadow-card">
          {project.cover_url && (
            <img src={project.cover_url} alt={project.title} className="w-full h-56 object-cover" />
          )}
          <div className="p-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary">{project.category || "Genel"}</Badge>
            <Badge variant="outline" className="flex items-center gap-1"><Clock className="w-3 h-3" />{project.duration_weeks} hafta</Badge>
            {project.country && <Badge variant="outline" className="flex items-center gap-1"><MapPin className="w-3 h-3" />{project.country}</Badge>}
          </div>
          <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
          <p className="text-muted-foreground whitespace-pre-wrap mb-6">{project.description}</p>
          <div className="mb-6">
            <h3 className="font-semibold mb-2 text-sm">Aranan Yetkinlikler</h3>
            <div className="flex flex-wrap gap-2">
              {project.skills_needed?.map((s: string) => <Badge key={s}>{s}</Badge>)}
            </div>
          </div>

          <div className="border-t pt-6">
            {applied ? (
              <div className="p-4 bg-accent/10 rounded-lg text-sm">✓ Bu projeye başvurdun. Sonucu panelden takip edebilirsin.</div>
            ) : !user ? (
              <Link to="/auth"><Button className="w-full bg-gradient-primary">Başvurmak için giriş yap</Button></Link>
            ) : role !== "student" ? (
              <p className="text-sm text-muted-foreground">Sadece öğrenciler başvurabilir.</p>
            ) : (
              <div className="space-y-3">
                <h3 className="font-semibold">Başvur</h3>
                <Textarea placeholder="Neden uygun olduğunu kısaca anlat..." rows={5} value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} />
                <Button onClick={apply} disabled={submitting} className="bg-gradient-primary">{submitting ? "Gönderiliyor..." : "Başvuruyu Gönder"}</Button>
              </div>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
}
