import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";

type Stat = { label: string; value: number; total: number; color: string; sub: string };

function Ring({ percent, color }: { percent: number; color: string }) {
  const r = 22;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" className="shrink-0">
      <circle cx="28" cy="28" r={r} stroke="rgba(255,255,255,0.25)" strokeWidth="5" fill="none" />
      <circle
        cx="28" cy="28" r={r} stroke={color} strokeWidth="5" fill="none"
        strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
        transform="rotate(-90 28 28)"
      />
      <text x="28" y="32" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">
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
        { label: "Tamamlanan", value: done, total: t.length, color: "hsl(48 95% 55%)", sub: "Bitirilen görevler" },
        { label: "Onay Bekleyen", value: submitted, total: t.length, color: "hsl(330 80% 60%)", sub: "İncelemede" },
      ]);
    })();
  }, [user]);

  return (
    <div className="grid gap-4 sm:grid-cols-3 mb-8">
      {stats.map((s, i) => {
        const pct = s.total ? Math.round((s.value / s.total) * 100) : 0;
        const gradients = [
          "bg-gradient-to-br from-violet-500 to-fuchsia-500",
          "bg-gradient-to-br from-amber-400 to-orange-500",
          "bg-gradient-to-br from-cyan-400 to-teal-500",
        ];
        return (
          <Card key={s.label} className={`p-5 text-white border-0 shadow-card overflow-hidden ${gradients[i]}`}>
            <p className="font-semibold text-sm">{s.label}</p>
            <p className="text-3xl font-bold leading-none mt-2">
              {s.value}
              <span className="text-base text-white/70 font-normal ml-0.5">/{s.total}</span>
            </p>
            <p className="text-xs text-white/85 mt-2">{s.sub}</p>
            <div className="mt-4 flex items-center gap-3">
              <Ring percent={pct} color="white" />
              <span className="text-xs text-white/80">İlerleme</span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
