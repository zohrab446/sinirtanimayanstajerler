import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import AppHeader from "@/components/AppHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Send, Upload, Check, X, FileText, Award } from "lucide-react";
import jsPDF from "jspdf";
import { countryFlag } from "@/lib/flag";

const STATUSES = ["todo", "in_progress", "submitted", "done"] as const;
const STATUS_LABEL: Record<string, string> = { todo: "Yapılacak", in_progress: "Devam ediyor", submitted: "Onay bekliyor", done: "Tamamlandı" };

export default function EngagementDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [eng, setEng] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [newTask, setNewTask] = useState({ title: "", description: "", due_date: "", assigned_to: "none" });
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [msgInput, setMsgInput] = useState("");
  const msgEnd = useRef<HTMLDivElement>(null);

  useEffect(() => { if (!loading && !user) navigate("/auth"); }, [user, loading, navigate]);

  const loadAll = async () => {
    if (!id) return;
    const { data: e } = await supabase.from("engagements").select(`
      *, projects(title, category, country, description),
      student:profiles!engagements_student_profiles_fkey(full_name, university),
      business:profiles!engagements_business_profiles_fkey(full_name, company_name)
    `).eq("id", id).maybeSingle();
    setEng(e);
    const { data: t } = await supabase.from("tasks").select("*, assigned:profiles!tasks_assigned_profiles_fkey(full_name)").eq("engagement_id", id).order("created_at", { ascending: true });
    setTasks(t ?? []);
    const { data: m } = await supabase.from("messages").select("*, sender:profiles!messages_sender_profiles_fkey(full_name)").eq("engagement_id", id).order("created_at", { ascending: true });
    setMessages(m ?? []);
  };

  useEffect(() => { loadAll(); }, [id]);

  useEffect(() => {
    if (!id) return;
    const ch = supabase.channel(`eng-${id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "messages", filter: `engagement_id=eq.${id}` }, () => loadAll())
      .on("postgres_changes", { event: "*", schema: "public", table: "tasks", filter: `engagement_id=eq.${id}` }, () => loadAll())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [id]);

  useEffect(() => { msgEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("tasks").insert({
      engagement_id: id!, title: newTask.title, description: newTask.description,
      due_date: newTask.due_date || null, created_by: user!.id,
      assigned_to: newTask.assigned_to !== "none" ? newTask.assigned_to : null,
    });
    if (error) toast({ title: "Hata", description: error.message, variant: "destructive" });
    else { setNewTask({ title: "", description: "", due_date: "", assigned_to: "none" }); setShowTaskForm(false); }
  };

  const updateTaskStatus = async (taskId: string, status: string) => {
    const { error } = await supabase.from("tasks").update({ status }).eq("id", taskId);
    if (error) toast({ title: "Hata", description: error.message, variant: "destructive" });
  };

  const updateTaskAssignee = async (taskId: string, assigned_to: string) => {
    const { error } = await supabase.from("tasks")
      .update({ assigned_to: assigned_to === "none" ? null : assigned_to })
      .eq("id", taskId);
    if (error) toast({ title: "Hata", description: error.message, variant: "destructive" });
    else toast({ title: "Görev atandı" });
  };

  const uploadSubmission = async (taskId: string, file: File) => {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${id}/${taskId}/${Date.now()}-${safeName}`;
    toast({ title: "Yükleniyor...", description: file.name });
    const { error: upErr } = await supabase.storage.from("task-submissions").upload(path, file, { upsert: true, contentType: file.type || "application/octet-stream" });
    if (upErr) { console.error("upload error", upErr); toast({ title: "Yükleme hatası", description: upErr.message, variant: "destructive" }); return; }
    const { error } = await supabase.from("tasks").update({
      submission_url: path, submission_filename: file.name,
      submitted_at: new Date().toISOString(), submitted_by: user!.id,
      status: "submitted",
    }).eq("id", taskId);
    if (error) toast({ title: "Hata", description: error.message, variant: "destructive" });
    else toast({ title: "Dosya gönderildi, onay bekleniyor" });
  };

  const downloadSubmission = async (path: string, filename: string) => {
    const { data, error } = await supabase.storage.from("task-submissions").createSignedUrl(path, 60);
    if (error || !data) { toast({ title: "Hata", description: error?.message, variant: "destructive" }); return; }
    window.open(data.signedUrl, "_blank");
  };

  const reviewTask = async (taskId: string, approve: boolean) => {
    const { error } = await supabase.from("tasks")
      .update({ status: approve ? "done" : "in_progress" })
      .eq("id", taskId);
    if (error) toast({ title: "Hata", description: error.message, variant: "destructive" });
    else toast({ title: approve ? "Görev onaylandı" : "Görev reddedildi, revizyon istendi" });
  };

  const assigneeOptions = eng ? [
    { id: eng.student_id, label: `👨‍🎓 ${eng.student?.full_name || "Öğrenci"}` },
    { id: eng.business_id, label: `🏢 ${eng.business?.company_name || eng.business?.full_name || "İşletme"}` },
    ...(eng.mentor_id ? [{ id: eng.mentor_id, label: `🎓 Mentor` }] : []),
  ] : [];

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgInput.trim()) return;
    const { error } = await supabase.from("messages").insert({ engagement_id: id!, sender_id: user!.id, body: msgInput });
    if (error) toast({ title: "Hata", description: error.message, variant: "destructive" });
    else setMsgInput("");
  };

  const completeEngagement = async () => {
    await supabase.from("engagements").update({ status: "completed", end_date: new Date().toISOString() }).eq("id", id!);
    toast({ title: "Çalışma tamamlandı" });
    loadAll();
  };

  const generateCertificate = () => {
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
    const w = doc.internal.pageSize.getWidth();
    const h = doc.internal.pageSize.getHeight();
    const cx = w / 2;

    // Background
    doc.setFillColor(252, 250, 244);
    doc.rect(0, 0, w, h, "F");

    // Outer navy border
    doc.setDrawColor(20, 40, 90);
    doc.setLineWidth(10);
    doc.rect(24, 24, w - 48, h - 48);

    // Gold inner border
    doc.setDrawColor(196, 161, 73);
    doc.setLineWidth(2);
    doc.rect(40, 40, w - 80, h - 80);
    doc.setLineWidth(0.6);
    doc.rect(46, 46, w - 92, h - 92);

    // Corner ornaments (gold diamonds)
    doc.setFillColor(196, 161, 73);
    [[46, 46], [w - 46, 46], [46, h - 46], [w - 46, h - 46]].forEach(([x, y]) => {
      doc.triangle(x - 8, y, x, y - 8, x + 8, y, "F");
      doc.triangle(x - 8, y, x, y + 8, x + 8, y, "F");
    });

    // Top emblem
    doc.setFillColor(20, 40, 90);
    doc.circle(cx, 95, 22, "F");
    doc.setFillColor(196, 161, 73);
    doc.circle(cx, 95, 14, "F");
    doc.setTextColor(20, 40, 90);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("★", cx, 101, { align: "center" });

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(38);
    doc.setTextColor(20, 40, 90);
    doc.text("BAŞARI SERTİFİKASI", cx, 160, { align: "center" });

    // Subtitle line
    doc.setDrawColor(196, 161, 73);
    doc.setLineWidth(1.2);
    doc.line(cx - 110, 175, cx - 20, 175);
    doc.line(cx + 20, 175, cx + 110, 175);
    doc.setFillColor(196, 161, 73);
    doc.circle(cx, 175, 2.5, "F");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(13);
    doc.setTextColor(90, 90, 90);
    doc.text("Bu sertifika, aşağıda adı geçen kişinin projeyi", cx, 200, { align: "center" });
    doc.text("başarıyla tamamladığını onaylar", cx, 218, { align: "center" });

    // Name
    doc.setFont("times", "bolditalic");
    doc.setFontSize(36);
    doc.setTextColor(20, 40, 90);
    const name = eng.student?.full_name || "Öğrenci";
    doc.text(name, cx, 270, { align: "center" });

    // Underline under name
    const nameWidth = doc.getTextWidth(name);
    doc.setDrawColor(196, 161, 73);
    doc.setLineWidth(0.8);
    doc.line(cx - nameWidth / 2 - 20, 282, cx + nameWidth / 2 + 20, 282);

    // Project
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(110, 110, 110);
    doc.text("PROJE", cx, 308, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    const projectTitle = eng.projects?.title || "";
    const projectLines = doc.splitTextToSize(projectTitle, w - 200);
    doc.text(projectLines, cx, 330, { align: "center" });

    // Stats
    const completed = tasks.filter((t) => t.status === "done").length;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `İşletme: ${eng.business?.company_name || eng.business?.full_name || "-"}    •    Tamamlanan Görev: ${completed} / ${tasks.length}`,
      cx,
      370,
      { align: "center" }
    );

    // Footer signatures
    const footerY = h - 90;
    doc.setDrawColor(60, 60, 60);
    doc.setLineWidth(0.5);
    doc.line(90, footerY, 250, footerY);
    doc.line(w - 250, footerY, w - 90, footerY);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(40, 40, 40);
    doc.text("Tarih", 170, footerY + 16, { align: "center" });
    doc.text("Platform", w - 170, footerY + 16, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(110, 110, 110);
    const dateStr = new Date(eng.end_date || Date.now()).toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" });
    doc.text(dateStr, 170, footerY + 30, { align: "center" });
    doc.text("Lovable Platform", w - 170, footerY + 30, { align: "center" });

    // Certificate ID
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Sertifika No: ${(eng.id || "").slice(0, 8).toUpperCase()}`, cx, h - 55, { align: "center" });

    doc.save(`sertifika-${(eng.student?.full_name || "ogrenci").replace(/\s+/g, "_")}.pdf`);
  };

  if (!eng) return <div className="min-h-screen bg-background"><AppHeader /><div className="container py-12 text-center text-muted-foreground">Yükleniyor...</div></div>;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container py-8 max-w-5xl">
        <Link to="/dashboard" className="inline-flex items-center text-sm text-muted-foreground mb-4 hover:text-foreground"><ArrowLeft className="w-4 h-4 mr-1" />Panele dön</Link>

        <Card className="p-6 mb-6">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl font-bold">{eng.projects?.title}</h1>
              <p className="text-sm text-muted-foreground mt-1">{eng.projects?.category} · {countryFlag(eng.projects?.country)} {eng.projects?.country}</p>
              <div className="flex gap-4 mt-3 text-sm">
                <span><strong>Öğrenci:</strong> {eng.student?.full_name}</span>
                <span><strong>İşletme:</strong> {eng.business?.company_name || eng.business?.full_name}</span>
              </div>
            </div>
            <div className="text-right">
              <Badge variant={eng.status === "active" ? "default" : "secondary"}>{eng.status}</Badge>
              {eng.status === "active" && (user?.id === eng.business_id || user?.id === eng.mentor_id) && (
                <Button size="sm" variant="outline" className="block mt-2" onClick={completeEngagement}>Tamamla</Button>
              )}
              {eng.status === "completed" && (
                <Button size="sm" className="block mt-2 bg-gradient-primary" onClick={generateCertificate}>
                  <Award className="w-4 h-4" />Sertifikayı İndir
                </Button>
              )}
            </div>
          </div>
        </Card>

        <Tabs defaultValue="tasks" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tasks">Görevler ({tasks.length})</TabsTrigger>
            <TabsTrigger value="chat">Mesajlar ({messages.length})</TabsTrigger>
            <TabsTrigger value="live">Canlı Yayın</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-4">
            <div className="flex justify-end">
              <Button size="sm" onClick={() => setShowTaskForm(!showTaskForm)}><Plus className="w-4 h-4" />Yeni Görev</Button>
            </div>
            {showTaskForm && (
              <Card className="p-4">
                <form onSubmit={createTask} className="space-y-3">
                  <Input required placeholder="Görev başlığı" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} />
                  <Textarea placeholder="Açıklama" value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} />
                  <Input type="date" value={newTask.due_date} onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })} />
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Kime atansın?</label>
                    <Select value={newTask.assigned_to} onValueChange={(v) => setNewTask({ ...newTask, assigned_to: v })}>
                      <SelectTrigger><SelectValue placeholder="Kişi seç" /></SelectTrigger>
                      <SelectContent className="bg-popover z-50">
                        <SelectItem value="none">Atanmadı</SelectItem>
                        {assigneeOptions.map((o) => (
                          <SelectItem key={o.id} value={o.id}>{o.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" size="sm">Ekle</Button>
                </form>
              </Card>
            )}
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {STATUSES.map((s) => (
                <div key={s}>
                  <h4 className="text-sm font-semibold mb-2">{STATUS_LABEL[s]}</h4>
                  <div className="space-y-2 min-h-[100px]">
                    {tasks.filter((t) => t.status === s).filter((t) => {
                      const isStudent = user?.id === eng.student_id;
                      const isBusiness = user?.id === eng.business_id;
                      const isMentor = user?.id === eng.mentor_id;
                      if (isBusiness || isMentor) return true;
                      if (isStudent) return t.assigned_to === user?.id || t.created_by === user?.id;
                      return false;
                    }).map((t) => {
                      const isStudent = user?.id === eng.student_id;
                      const isBusiness = user?.id === eng.business_id;
                      const isMentor = user?.id === eng.mentor_id;
                      const canSubmit = isStudent && (t.status === "todo" || t.status === "in_progress");
                      const canReview = (isBusiness || isMentor) && t.status === "submitted";
                      return (
                      <Card key={t.id} className="p-3">
                        <p className="font-medium text-sm">{t.title}</p>
                        {t.description && <p className="text-xs text-muted-foreground mt-1">{t.description}</p>}
                        {t.due_date && <p className="text-xs text-muted-foreground mt-1">📅 {t.due_date}</p>}
                        {t.assigned?.full_name && <p className="text-xs text-muted-foreground mt-1">👤 {t.assigned.full_name}</p>}
                        {t.submission_url && (
                          <button type="button" onClick={() => downloadSubmission(t.submission_url, t.submission_filename)} className="mt-2 flex items-center gap-1 text-xs text-primary hover:underline">
                            <FileText className="w-3 h-3" />{t.submission_filename || "Dosya"}
                          </button>
                        )}
                        <Select value={t.status} onValueChange={(v) => updateTaskStatus(t.id, v)}>
                          <SelectTrigger className="h-7 text-xs mt-2"><SelectValue /></SelectTrigger>
                          <SelectContent className="bg-popover z-50">
                            {STATUSES.map((st) => <SelectItem key={st} value={st}>{STATUS_LABEL[st]}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <Select value={t.assigned_to ?? "none"} onValueChange={(v) => updateTaskAssignee(t.id, v)}>
                          <SelectTrigger className="h-7 text-xs mt-2"><SelectValue placeholder="Ata" /></SelectTrigger>
                          <SelectContent className="bg-popover z-50">
                            <SelectItem value="none">Atanmadı</SelectItem>
                            {assigneeOptions.map((o) => (
                              <SelectItem key={o.id} value={o.id}>{o.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {canSubmit && (
                          <label className="mt-2 flex items-center justify-center gap-1 text-xs border border-dashed rounded px-2 py-1.5 cursor-pointer hover:bg-accent">
                            <Upload className="w-3 h-3" />{t.submission_url ? "Yeni dosya yükle" : "Dosya yükle & gönder"}
                            <input type="file" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadSubmission(t.id, f); e.target.value = ""; }} />
                          </label>
                        )}
                        {canReview && (
                          <div className="mt-2 flex gap-1">
                            <Button size="sm" variant="default" className="flex-1 h-7 text-xs" onClick={() => reviewTask(t.id, true)}><Check className="w-3 h-3" />Onayla</Button>
                            <Button size="sm" variant="outline" className="flex-1 h-7 text-xs" onClick={() => reviewTask(t.id, false)}><X className="w-3 h-3" />Reddet</Button>
                          </div>
                        )}
                      </Card>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="chat">
            <Card className="p-4 flex flex-col h-[500px]">
              <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                {messages.length === 0 && <p className="text-center text-sm text-muted-foreground py-8">Henüz mesaj yok</p>}
                {messages.map((m) => {
                  const mine = m.sender_id === user?.id;
                  return (
                    <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] rounded-lg px-3 py-2 ${mine ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
                        <p className="text-xs opacity-70 mb-0.5">{m.sender?.full_name || "Kullanıcı"}</p>
                        <p className="text-sm whitespace-pre-wrap">{m.body}</p>
                      </div>
                    </div>
                  );
                })}
                <div ref={msgEnd} />
              </div>
              <form onSubmit={sendMessage} className="flex gap-2">
                <Input placeholder="Mesaj yaz..." value={msgInput} onChange={(e) => setMsgInput(e.target.value)} />
                <Button type="submit" size="icon"><Send className="w-4 h-4" /></Button>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="live">
            <Card className="p-4">
              <div className="mb-3 flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <h3 className="font-semibold">Canlı yayın odası</h3>
                  <p className="text-xs text-muted-foreground">Öğrenci, mentor ve işletme ortak görüşme odasında buluşur. Aşağıdaki bağlantıyı tarayıcıda açın — kamera/mikrofon izni gerekir.</p>
                </div>
                <a
                  href={`https://meet.jit.si/lovable-${id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline"
                >
                  Yeni sekmede aç
                </a>
              </div>
              <div className="aspect-video w-full rounded-md overflow-hidden border bg-secondary">
                <iframe
                  title="Canlı yayın"
                  src={`https://meet.jit.si/lovable-${id}#userInfo.displayName=%22${encodeURIComponent(user?.email || "Konuk")}%22`}
                  allow="camera; microphone; fullscreen; display-capture; autoplay"
                  className="w-full h-full"
                />
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
