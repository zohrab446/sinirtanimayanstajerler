import { Link, useNavigate } from "react-router-dom";
import { Globe2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function AppHeader() {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Globe2 className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="hidden sm:inline">Sınır Tanımayan Stajyerler</span>
        </Link>
        <nav className="flex items-center gap-2">
          <Link to="/projects"><Button variant="ghost" size="sm">Projeler</Button></Link>
          {user ? (
            <>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">{role === "student" ? "Başvurularım" : "Panel"}</Button>
              </Link>
              {role && <span className="text-xs px-2 py-1 rounded bg-secondary text-muted-foreground capitalize">{role}</span>}
              <Button variant="outline" size="sm" onClick={async () => { await signOut(); navigate("/"); }}>
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <Link to="/auth"><Button size="sm" className="bg-gradient-primary">Giriş / Kayıt</Button></Link>
          )}
        </nav>
      </div>
    </header>
  );
}
