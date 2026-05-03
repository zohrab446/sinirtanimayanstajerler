import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";

const WEEKS = 26; // last ~6 months
const DAY_MS = 24 * 60 * 60 * 1000;

function dateKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

function levelClass(count: number) {
  if (count === 0) return "bg-muted";
  if (count < 2) return "bg-emerald-200";
  if (count < 4) return "bg-emerald-400";
  if (count < 7) return "bg-emerald-600";
  return "bg-emerald-700";
}

export default function ActivityHeatmap() {
  const { user } = useAuth();
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!user) return;
    const since = new Date(Date.now() - WEEKS * 7 * DAY_MS).toISOString();
    (async () => {
      const map: Record<string, number> = {};
      const add = (iso?: string | null) => {
        if (!iso) return;
        const k = iso.slice(0, 10);
        map[k] = (map[k] || 0) + 1;
      };
      const [m, t, ts] = await Promise.all([
        supabase.from("messages").select("created_at").eq("sender_id", user.id).gte("created_at", since),
        supabase.from("tasks").select("submitted_at").eq("submitted_by", user.id).gte("submitted_at", since),
        supabase.from("tasks").select("created_at").eq("created_by", user.id).gte("created_at", since),
      ]);
      (m.data ?? []).forEach((r: any) => add(r.created_at));
      (t.data ?? []).forEach((r: any) => add(r.submitted_at));
      (ts.data ?? []).forEach((r: any) => add(r.created_at));
      setCounts(map);
    })();
  }, [user]);

  const grid = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Align grid to end on Saturday of current week
    const dayOfWeek = today.getDay();
    const end = new Date(today.getTime() + (6 - dayOfWeek) * DAY_MS);
    const start = new Date(end.getTime() - (WEEKS * 7 - 1) * DAY_MS);
    const weeks: { date: Date; count: number; future: boolean }[][] = [];
    for (let w = 0; w < WEEKS; w++) {
      const col: { date: Date; count: number; future: boolean }[] = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(start.getTime() + (w * 7 + d) * DAY_MS);
        col.push({ date, count: counts[dateKey(date)] || 0, future: date > today });
      }
      weeks.push(col);
    }
    return weeks;
  }, [counts]);

  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">Çalışma Günlerim</h3>
        <span className="text-xs text-muted-foreground">{total} aktivite · son 6 ay</span>
      </div>
      <div className="overflow-x-auto">
        <div className="flex gap-[3px]">
          {grid.map((week, i) => (
            <div key={i} className="flex flex-col gap-[3px]">
              {week.map((cell, j) => (
                <div
                  key={j}
                  title={`${cell.date.toLocaleDateString("tr-TR")} · ${cell.count} aktivite`}
                  className={`w-3 h-3 rounded-[3px] ${cell.future ? "bg-transparent" : levelClass(cell.count)}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-end gap-1 mt-3 text-xs text-muted-foreground">
        <span>Az</span>
        <span className="w-3 h-3 rounded-[3px] bg-muted" />
        <span className="w-3 h-3 rounded-[3px] bg-emerald-200" />
        <span className="w-3 h-3 rounded-[3px] bg-emerald-400" />
        <span className="w-3 h-3 rounded-[3px] bg-emerald-600" />
        <span className="w-3 h-3 rounded-[3px] bg-emerald-700" />
        <span>Çok</span>
      </div>
    </Card>
  );
}
