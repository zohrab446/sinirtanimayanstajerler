import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  Globe2, Briefcase, Award, UserPlus, Search, Rocket, BadgeCheck,
  GraduationCap, Building2, ArrowRight, Check, Mail, Phone, MapPin, Sparkles
} from "lucide-react";
import heroIllustration from "@/assets/hero-illustration.jpg";

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{children}</a>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* NAV */}
      <header className="sticky top-0 z-50 bg-background/85 backdrop-blur-md border-b border-border">
        <div className="container mx-auto max-w-7xl px-6 flex h-16 items-center justify-between">
          <a href="#" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <Globe2 className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">Sınır Tanımayan Stajyerler</span>
          </a>
          <nav className="hidden lg:flex items-center gap-8">
            <NavLink href="#hero">Ana Sayfa</NavLink>
            <NavLink href="#how">Nasıl Çalışır?</NavLink>
            <NavLink href="#students">Öğrenciler</NavLink>
            <NavLink href="#business">İşletmeler</NavLink>
            <NavLink href="#contact">İletişim</NavLink>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/auth"><Button variant="ghost" size="sm">Giriş Yap</Button></Link>
            <Link to="/auth"><Button size="sm" className="bg-gradient-primary text-primary-foreground border-0">Kayıt Ol</Button></Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section id="hero" className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 -right-40 w-[600px] h-[600px] rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-0 -left-40 w-[500px] h-[500px] rounded-full bg-accent/10 blur-3xl" />
        </div>
        <div className="container mx-auto max-w-7xl px-6 py-16 md:py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6 border border-primary/20">
              <Sparkles className="w-3.5 h-3.5" /> Türkiye merkezli, küresel etkili
            </span>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05] mb-5">
              Sınırları Aş, <span className="text-gradient">Deneyim Kazan</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl">
              Türkiye'deki üniversite öğrencilerini dünya ile buluşturan dijital staj ve mentorluk platformu.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/auth">
                <Button size="lg" className="bg-gradient-primary text-primary-foreground border-0 shadow-elegant">
                  Hemen Katıl <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline">
                  İşletme Olarak Katıl
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 bg-gradient-primary opacity-20 blur-2xl rounded-3xl" />
            <img
              src={heroIllustration}
              alt="Küresel staj ağı"
              width={1280}
              height={1024}
              className="relative w-full h-auto rounded-3xl shadow-elegant border border-border"
            />
          </div>
        </div>
      </section>

      {/* QUICK FEATURES */}
      <section className="container mx-auto max-w-7xl px-6 py-16">
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { icon: Globe2, title: "Küresel Deneyim", desc: "Farklı ülkelerdeki gerçek projelerde uluslararası deneyim kazan." },
            { icon: Briefcase, title: "Gerçek Projeler", desc: "Sahada çalışan KOBİ ve sosyal girişimlerle birebir çalış." },
            { icon: Award, title: "Sertifika Fırsatı", desc: "Tamamladığın her projeden doğrulanabilir dijital sertifika al." },
          ].map((f) => (
            <Card key={f.title} className="p-6 border-border shadow-card hover:shadow-elegant transition-smooth bg-gradient-card">
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 shadow-glow">
                <f.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="bg-secondary/40 border-y border-border">
        <div className="container mx-auto max-w-7xl px-6 py-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">Nasıl Çalışır?</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Dört adımda başla</h2>
            <p className="text-muted-foreground">Kayıttan sertifikaya kadar süreç sade ve şeffaf.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: UserPlus, title: "Profilini Oluştur", desc: "Yeteneklerini, ilgi alanlarını ve müsaitliğini ekle." },
              { icon: Search, title: "Eşleşmeni Bul", desc: "Sana uygun küresel projeleri akıllı sistemle keşfet." },
              { icon: Rocket, title: "Projeye Başla", desc: "Mentor desteğiyle gerçek bir ekipte çalışmaya başla." },
              { icon: BadgeCheck, title: "Sertifikanı Al", desc: "Başarıyla tamamladığın projeden dijital sertifika kazan." },
            ].map((s, i) => (
              <Card key={s.title} className="p-6 bg-card border-border shadow-card relative">
                <div className="absolute top-5 right-5 text-xs font-bold text-muted-foreground/40">0{i + 1}</div>
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <s.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FOR WHO */}
      <section className="container mx-auto max-w-7xl px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-4">Kimler İçin?</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Herkes için bir fırsat</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Card id="students" className="p-8 border-border shadow-card bg-gradient-card">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
                <GraduationCap className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold">Öğrenciler İçin</h3>
            </div>
            <ul className="space-y-3">
              {[
                "Uluslararası deneyim kazan",
                "Gerçek projelerde yer al",
                "Kariyerine güçlü başla",
                "Mentorluk desteği al",
              ].map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <Link to="/auth" className="inline-block mt-6">
              <Button className="bg-gradient-primary text-primary-foreground border-0">Öğrenci Olarak Katıl</Button>
            </Link>
          </Card>

          <Card id="business" className="p-8 border-border shadow-card bg-gradient-card">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-accent flex items-center justify-center shadow-glow">
                <Building2 className="w-6 h-6 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-bold">İşletmeler İçin</h3>
            </div>
            <ul className="space-y-3">
              {[
                "Genç ve yetenekli danışmanlara ulaş",
                "İş süreçlerini geliştir",
                "Yenilikçi çözümler üret",
                "Düşük maliyetle yüksek fayda sağla",
              ].map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <Link to="/auth" className="inline-block mt-6">
              <Button variant="outline">İşletme Olarak Katıl</Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-secondary/40 border-y border-border">
        <div className="container mx-auto max-w-7xl px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              ["250+", "Öğrenci"],
              ["80+", "İşletme"],
              ["40+", "Mentor"],
              ["15+", "Ülke"],
            ].map(([n, l]) => (
              <Card key={l} className="p-6 text-center bg-card border-border shadow-card">
                <div className="text-3xl md:text-4xl font-bold text-gradient mb-1">{n}</div>
                <div className="text-sm text-muted-foreground">{l}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-3xl bg-hero p-10 md:p-16 text-primary-foreground text-center shadow-elegant relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-white/30 blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-accent/40 blur-3xl" />
          </div>
          <div className="relative">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
              Sen de küresel bir deneyimin parçası ol!
            </h2>
            <p className="text-primary-foreground/90 text-lg mb-8 max-w-2xl mx-auto">
              Hemen katıl, yeni fırsatları keşfet ve geleceğini bugünden şekillendir.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/auth">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                  Hemen Katıl <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline" className="border-white/40 bg-transparent text-white hover:bg-white/10">
                  İşletme Olarak Başvur
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="border-t border-border bg-card">
        <div className="container mx-auto max-w-7xl px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center">
                  <Globe2 className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-semibold">Sınır Tanımayan Stajyerler</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-sm">
                Türkiye'deki üniversite öğrencilerini dünya ile buluşturan dijital staj ve mentorluk platformu.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#how" className="hover:text-foreground">Nasıl Çalışır?</a></li>
                <li><a href="#students" className="hover:text-foreground">Öğrenciler</a></li>
                <li><a href="#business" className="hover:text-foreground">İşletmeler</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">İletişim</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> info@sinirtanimayan.com</li>
                <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> +90 212 000 00 00</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> İstanbul, Türkiye</li>
              </ul>
            </div>
          </div>
          <div className="pt-6 border-t border-border text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} Sınır Tanımayan Stajyerler. Tüm hakları saklıdır.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
