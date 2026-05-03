import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase recovery link sets a session via hash automatically
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => { if (data.session) setReady(true); });
    return () => sub.subscription.unsubscribe();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) toast({ title: "Hata", description: error.message, variant: "destructive" });
    else { toast({ title: "Şifre güncellendi" }); navigate("/dashboard"); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-card p-4">
      <Card className="p-6 w-full max-w-md shadow-elegant">
        <h1 className="text-xl font-bold mb-4">Yeni şifre belirle</h1>
        {!ready ? (
          <p className="text-sm text-muted-foreground">Bağlantı doğrulanıyor...</p>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label>Yeni şifre</Label>
              <Input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" disabled={loading} className="w-full">{loading ? "..." : "Şifreyi güncelle"}</Button>
          </form>
        )}
      </Card>
    </div>
  );
}
