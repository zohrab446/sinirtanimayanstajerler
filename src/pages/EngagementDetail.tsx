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
import { ArrowLeft, Plus, Send } from "lucide-react";

const STATUSES = ["todo", "in_progress", "review", "done"] as const;
const STATUS_LABEL: Record<string, string> = { todo: "Yapılacak", in_progress: "Devam ediyor", review: "İncelemede", done: "Tamamlandı" };

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
    });
    if (error) toast({ title: "Hata", description: error.message, variant: "destructive" });
    else { setNewTask({ title: "", description: "", due_date: "" }); setShowTaskForm(false); }
  };

  const updateTaskStatus = async (taskId: string, status: string) => {
    await supabase.from("tasks").update({ status }).eq("id", taskId);
  };

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
              <p className="text-sm text-muted-foreground mt-1">{eng.projects?.category} · {eng.projects?.country}</p>
              <div className="flex gap-4 mt-3 text-sm">
                <span><strong>Öğrenci:</strong> {eng.student?.full_name}</span>
                <span><strong>İşletme:</strong> {eng.business?.company_name || eng.business?.full_name}</span>
              </div>
            </div>
            <div className="text-right">
              <Badge variant={eng.status === "active" ? "default" : "secondary"}>{eng.status}</Badge>
              {eng.status === "active" && user?.id === eng.business_id && (
                <Button size="sm" variant="outline" className="block mt-2" onClick={completeEngagement}>Tamamla</Button>
              )}
            </div>
          </div>
        </Card>

        <Tabs defaultValue="tasks" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tasks">Görevler ({tasks.length})</TabsTrigger>
            <TabsTrigger value="chat">Mesajlar ({messages.length})</TabsTrigger>
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
                  <Button type="submit" size="sm">Ekle</Button>
                </form>
              </Card>
            )}
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {STATUSES.map((s) => (
                <div key={s}>
                  <h4 className="text-sm font-semibold mb-2">{STATUS_LABEL[s]}</h4>
                  <div className="space-y-2 min-h-[100px]">
                    {tasks.filter((t) => t.status === s).map((t) => (
                      <Card key={t.id} className="p-3">
                        <p className="font-medium text-sm">{t.title}</p>
                        {t.description && <p className="text-xs text-muted-foreground mt-1">{t.description}</p>}
                        {t.due_date && <p className="text-xs text-muted-foreground mt-1">📅 {t.due_date}</p>}
                        <Select value={t.status} onValueChange={(v) => updateTaskStatus(t.id, v)}>
                          <SelectTrigger className="h-7 text-xs mt-2"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {STATUSES.map((st) => <SelectItem key={st} value={st}>{STATUS_LABEL[st]}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </Card>
                    ))}
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
        </Tabs>
      </main>
    </div>
  );
}
