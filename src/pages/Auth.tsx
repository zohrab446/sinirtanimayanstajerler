import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import { Globe2 } from "lucide-react";

export default function Auth() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"student" | "business" | "mentor">("student");

  useEffect(() => { if (user) navigate("/dashboard"); }, [user, navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: { full_name: fullName, role },
      },
    });
    setLoading(false);
    if (error) toast({ title: "Kayıt başarısız", description: error.message, variant: "destructive" });
    else { toast({ title: "Hoş geldin!", description: "Hesabın oluşturuldu." }); navigate("/dashboard"); }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) toast({ title: "Giriş başarısız", description: error.message, variant: "destructive" });
    else navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-card p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 font-bold mb-6">
          <div className="w-9 h-9 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Globe2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <span>Sınır Tanımayan Stajyerler</span>
        </Link>
        <Card className="p-6 shadow-elegant">
          <Tabs defaultValue="signin">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="signin">Giriş Yap</TabsTrigger>
              <TabsTrigger value="signup">Kayıt Ol</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4 mt-4">
                <div><Label>E-posta</Label><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                <div><Label>Şifre</Label><Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
                <Button type="submit" className="w-full" disabled={loading}>{loading ? "..." : "Giriş Yap"}</Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4 mt-4">
                <div><Label>Ad Soyad</Label><Input required value={fullName} onChange={(e) => setFullName(e.target.value)} /></div>
                <div><Label>E-posta</Label><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                <div><Label>Şifre</Label><Input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} /></div>
                <div>
                  <Label className="mb-2 block">Rol</Label>
                  <RadioGroup value={role} onValueChange={(v) => setRole(v as any)} className="grid grid-cols-3 gap-2">
                    {[["student","Öğrenci"],["business","İşletme"],["mentor","Mentor"]].map(([v,l]) => (
                      <Label key={v} htmlFor={v} className="border rounded-md p-2 text-center cursor-pointer hover:bg-accent/10 [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5">
                        <RadioGroupItem value={v} id={v} className="sr-only" />
                        <span className="text-sm">{l}</span>
                      </Label>
                    ))}
                  </RadioGroup>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>{loading ? "..." : "Hesap Oluştur"}</Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
