import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";

type Stat = { label: string; value: number; total: number; color: string; sub: string };

function Ring({ percent, color }: { percent: number; color: string }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" className="shrink-0">
      <circle cx="32" cy="32" r={r} stroke="hsl(var(--muted))" strokeWidth="6" fill="none" />
      <circle
        cx="32" cy="32" r={r} stroke={color} strokeWidth="6" fill="none"
        strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
        transform="rotate(-90 32 32)"
      />
      <text x="32" y="36" textAnchor="middle" className="fill-foreground" fontSize="13" fontWeight="600">
        {percent}%
      </text>
    </svg>
  );
}

export default function StatsRow() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stat[]>([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: engs } = await supabase.from("engagements")
        .select("id")
        .or(`student_id.eq.${user.id},business_id.eq.${user.id},mentor_id.eq.${user.id}`);
      const ids = (engs ?? []).map((e: any) => e.id);
      if (ids.length === 0) {
        setStats([
          { label: "Aktif Görev", value: 0, total: 0, color: "hsl(142 76% 45%)", sub: "Devam eden iş yok" },
          { label: "Tamamlanan", value: 0, total: 0, color: "hsl(48 95% 55%)", sub: "Henüz tamamlanmadı" },
          { label: "Onay Bekleyen", value: 0, total: 0, color: "hsl(330 80% 60%)", sub: "Bekleyen yok" },
        ]);
        return;
      }
      const { data: tasks } = await supabase.from("tasks").select("status").in("engagement_id", ids);
      const t = tasks ?? [];
      const total = t.length || 1;
      const done = t.filter((x: any) => x.status === "done").length;
      const active = t.filter((x: any) => x.status === "in_progress" || x.status === "todo").length;
      const submitted = t.filter((x: any) => x.status === "submitted").length;
      setStats([
        { label: "Aktif Görev", value: active, total: t.length, color: "hsl(142 76% 45%)", sub: "Devam eden işler" },
        { label: "Tamamlanan", value: done, total: t.length, color: "hsl(48 95% 55%)", sub: `${Math.round((done / total) * 100)}% bitirildi` },
        { label: "Onay Bekleyen", value: submitted, total: t.length, color: "hsl(330 80% 60%)", sub: "İncelemede" },
      ]);
    })();
  }, [user]);

  return (
    <div className="grid gap-4 sm:grid-cols-3 mb-8">
      {stats.map((s) => {
        const pct = s.total ? Math.round((s.value / s.total) * 100) : 0;
        return (
          <Card key={s.label} className="p-5 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="font-semibold">{s.label}</p>
              <p className="text-2xl font-bold mt-1">{s.value}<span className="text-sm text-muted-foreground font-normal">/{s.total}</span></p>
              <p className="text-xs text-muted-foreground mt-1 truncate">{s.sub}</p>
            </div>
            <Ring percent={pct} color={s.color} />
          </Card>
        );
      })}
    </div>
  );
}
