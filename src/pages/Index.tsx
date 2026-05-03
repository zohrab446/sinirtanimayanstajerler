import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  GraduationCap, Building2, UserCheck, Shield, Sparkles, Target, MessageSquare,
  Award, BarChart3, Globe2, Zap, Users, Briefcase, ArrowRight, CheckCircle2,
  Code2, Database, Rocket, Heart, TrendingUp, AlertTriangle
} from "lucide-react";
import heroGlobe from "@/assets/hero-globe.jpg";

const Section = ({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children: React.ReactNode }) => (
  <section id={id} className="container py-20 md:py-28">
    <div className="max-w-3xl mb-12">
      <Badge variant="secondary" className="mb-4 font-medium">{eyebrow}</Badge>
      <h2 className="text-3xl md:text-5xl font-bold tracking-tight">{title}</h2>
    </div>
    {children}
  </section>
);

const FeatureCard = ({ icon: Icon, title, desc }: any) => (
  <Card className="p-6 bg-gradient-card shadow-card hover:shadow-elegant transition-smooth border-border/60">
    <div className="w-11 h-11 rounded-lg bg-gradient-primary flex items-center justify-center mb-4 shadow-glow">
      <Icon className="w-5 h-5 text-primary-foreground" />
    </div>
    <h3 className="font-semibold text-lg mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
  </Card>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* NAV */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/60">
        <div className="container flex h-16 items-center justify-between">
          <a href="#" className="flex items-center gap-2 font-bold">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Globe2 className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-[Sora]">Sınır Tanımayan Stajyerler</span>
          </a>
          <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
            <a href="#vision" className="hover:text-foreground transition-smooth">Vizyon</a>
            <a href="#features" className="hover:text-foreground transition-smooth">Özellikler</a>
            <a href="#tech" className="hover:text-foreground transition-smooth">Teknoloji</a>
            <a href="#business" className="hover:text-foreground transition-smooth">İş Modeli</a>
            <a href="#mvp" className="hover:text-foreground transition-smooth">MVP</a>
          </nav>
          <Link to="/projects"><Button variant="ghost" size="sm">Projeler</Button></Link>
          <Link to="/auth"><Button size="sm" className="bg-gradient-primary border-0 shadow-glow">Giriş / Kayıt</Button></Link>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden bg-hero text-primary-foreground">
        <div className="absolute inset-0 opacity-40">
          <img src={heroGlobe} alt="Küresel danışman ağı" width={1600} height={1024} className="w-full h-full object-cover object-center" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80" />
        <div className="container relative py-24 md:py-36 max-w-4xl">
          <Badge className="mb-6 bg-accent/20 text-accent border-accent/30 hover:bg-accent/30">🌍 Türkiye merkezli, küresel etkili</Badge>
          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6">
            Stajyer değil, <span className="text-gradient">küresel danışman</span> olun.
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mb-8 leading-relaxed">
            Üniversite öğrencilerini gelişmekte olan ülkelerdeki KOBİ'ler ve sosyal girişimlerle eşleştiren,
            beceri-bazlı eşleştirme ve aktif danışmanlık platformu.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/auth"><Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 border-0">
              Hemen Başla <ArrowRight className="ml-2 w-4 h-4" />
            </Button></Link>
            <Link to="/projects"><Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              Projelere Göz At
            </Button></Link>
          </div>
          <div className="grid grid-cols-3 gap-6 mt-16 max-w-xl">
            {[["50+", "Pilot ülke hedefi"], ["10K", "Öğrenci kapasitesi"], ["1K+", "KOBİ ağı"]].map(([n, l]) => (
              <div key={l}>
                <div className="text-3xl md:text-4xl font-bold text-accent">{n}</div>
                <div className="text-sm text-primary-foreground/70">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 1. PRODUCT VISION */}
      <Section id="vision" eyebrow="01 — Ürün Tanımı" title="Stajdan danışmanlığa: küresel etkinin yeni formatı">
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <Card className="p-7 bg-gradient-card shadow-card">
            <Target className="w-7 h-7 text-primary mb-3" />
            <h3 className="font-semibold text-xl mb-2">Temel Amaç</h3>
            <p className="text-muted-foreground leading-relaxed">
              Türk üniversite öğrencilerinin akademik bilgisini, gelişmekte olan pazarlardaki KOBİ ve sosyal girişimlere
              <strong className="text-foreground"> ölçülebilir değer </strong> üreten kısa-orta vadeli danışmanlık projelerine dönüştürmek.
            </p>
          </Card>
          <Card className="p-7 bg-gradient-card shadow-card">
            <Sparkles className="w-7 h-7 text-accent mb-3" />
            <h3 className="font-semibold text-xl mb-2">Fark Yaratan Yön</h3>
            <p className="text-muted-foreground leading-relaxed">
              Klasik sanal stajların aksine öğrenci, <strong className="text-foreground">aktif karar verici ve danışman</strong> rolüne yerleştirilir.
              AI destekli skill-matching, mentor denetimi ve ölçülebilir KPI'lar ile.
            </p>
          </Card>
        </div>

        <h3 className="font-semibold text-xl mb-5">Kullanıcı Tipleri & Değer Önerisi</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: GraduationCap, role: "Öğrenci", color: "text-primary",
              value: "Gerçek dünya projesi, uluslararası referans, beceri sertifikası, mikro-gelir." },
            { icon: Building2, role: "KOBİ / İşletme", color: "text-accent",
              value: "Düşük maliyetli uzman desteği, dijital dönüşüm, genç beyin gücüne erişim." },
            { icon: UserCheck, role: "Mentor", color: "text-primary",
              value: "Sosyal etki yaratma, kıdem puanı, network, isteğe bağlı danışmanlık ücreti." },
            { icon: Shield, role: "Admin", color: "text-accent",
              value: "Eşleşme kalitesi, KPI takibi, içerik denetimi, sertifika onayı." },
          ].map((u) => (
            <Card key={u.role} className="p-6 hover:shadow-elegant transition-smooth">
              <u.icon className={`w-8 h-8 ${u.color} mb-3`} />
              <h4 className="font-semibold mb-2">{u.role}</h4>
              <p className="text-sm text-muted-foreground">{u.value}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* 2. USER FLOWS */}
      <Section id="flows" eyebrow="02 — Kullanıcı Akışları" title="Üç rol, üç net yolculuk">
        <div className="grid lg:grid-cols-3 gap-6">
          {[
            {
              icon: GraduationCap, title: "Öğrenci Akışı", color: "from-primary to-primary-glow",
              steps: ["Kayıt + e-posta/üniversite doğrulaması", "Profil: yetenekler, dil, ilgi alanları, müsaitlik",
                "AI ile proje önerileri & başvuru", "Mülakat + eşleşme onayı", "Proje yürütme (task, sprint, mentor toplantıları)",
                "Değerlendirme + dijital sertifika & rozet"]
            },
            {
              icon: Building2, title: "İşletme Akışı", color: "from-accent to-primary-glow",
              steps: ["Şirket profili & doğrulama (vergi/kayıt)", "İhtiyaç tanımı: problem, beceri, süre, bütçe",
                "AI önerisi: 3-5 aday öğrenci", "Görüşme + ekip onayı", "Proje yönetim panosu (Kanban, deadline)",
                "Teslim + öğrenci/mentor değerlendirmesi"]
            },
            {
              icon: UserCheck, title: "Mentor Akışı", color: "from-primary to-accent",
              steps: ["Başvuru + uzmanlık doğrulaması", "Haftalık kapasite belirleme", "Atanan projelerde rehberlik",
                "Haftalık check-in & rapor", "Sorun çözüme katkı (eskalasyon)", "Mentor puanı + sosyal etki raporu"]
            },
          ].map((f) => (
            <Card key={f.title} className="p-6 bg-gradient-card shadow-card">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-glow`}>
                <f.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-4">{f.title}</h3>
              <ol className="space-y-3">
                {f.steps.map((s, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center">{i + 1}</span>
                    <span className="text-muted-foreground leading-relaxed">{s}</span>
                  </li>
                ))}
              </ol>
            </Card>
          ))}
        </div>
      </Section>

      {/* 3. CORE FEATURES */}
      <Section id="features" eyebrow="03 — Çekirdek Özellikler" title="Ölçeklenebilir bir danışmanlık altyapısı">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          <FeatureCard icon={Zap} title="Akıllı Eşleştirme"
            desc="Skill-vector + proje gereksinim vektörü cosine benzerlik + müsaitlik + dil + zaman dilimi puanı." />
          <FeatureCard icon={BarChart3} title="3 Ayrı Dashboard"
            desc="Öğrenci: aktif proje, KPI, kazanç. İşletme: ekip, ilerleme, ROI. Mentor: portföy, riskli projeler." />
          <FeatureCard icon={Briefcase} title="Proje Yönetimi"
            desc="Kanban board, sprint, deadline uyarıları, dosya paylaşımı, milestone bazlı ödeme tetikleyici." />
          <FeatureCard icon={MessageSquare} title="Mesaj & Video"
            desc="Realtime chat (kanal başına), Daily.co/Jitsi entegrasyonu, kayıtlı standuplar, transcript." />
          <FeatureCard icon={Heart} title="Değerlendirme Sistemi"
            desc="Çift yönlü 5 boyutlu rating, NPS, mentor müdahalesi tetikleyen düşük skor uyarıları." />
          <FeatureCard icon={Award} title="Dijital Sertifika"
            desc="PDF + LinkedIn paylaşılabilir doğrulanabilir sertifika (blockchain-ready hash imzası)." />
        </div>
      </Section>

      {/* 4. TECH ARCHITECTURE */}
      <Section id="tech" eyebrow="04 — Teknik Mimari" title="Modern, ölçeklenebilir tech stack">
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-7 bg-gradient-card shadow-card">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2"><Code2 className="w-5 h-5 text-primary" /> Stack</h3>
            <ul className="space-y-2.5 text-sm">
              <li className="flex justify-between border-b border-border/60 pb-2"><span className="text-muted-foreground">Frontend</span><span className="font-medium">Next.js 14 (App Router) + Tailwind + shadcn/ui</span></li>
              <li className="flex justify-between border-b border-border/60 pb-2"><span className="text-muted-foreground">Backend</span><span className="font-medium">Node.js (NestJS) + tRPC</span></li>
              <li className="flex justify-between border-b border-border/60 pb-2"><span className="text-muted-foreground">DB</span><span className="font-medium">PostgreSQL + pgvector</span></li>
              <li className="flex justify-between border-b border-border/60 pb-2"><span className="text-muted-foreground">Auth/Storage</span><span className="font-medium">Supabase / Lovable Cloud</span></li>
              <li className="flex justify-between border-b border-border/60 pb-2"><span className="text-muted-foreground">Realtime</span><span className="font-medium">WebSockets + Daily.co</span></li>
              <li className="flex justify-between border-b border-border/60 pb-2"><span className="text-muted-foreground">AI/Matching</span><span className="font-medium">OpenAI embeddings + custom scoring</span></li>
              <li className="flex justify-between"><span className="text-muted-foreground">Infra</span><span className="font-medium">Vercel + Render + Cloudflare R2</span></li>
            </ul>
          </Card>
          <Card className="p-7 bg-gradient-card shadow-card">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2"><Database className="w-5 h-5 text-accent" /> Eşleştirme Pseudo-Kod</h3>
<pre className="text-xs bg-foreground/95 text-primary-foreground/90 p-4 rounded-lg overflow-x-auto leading-relaxed"><code>{`function matchScore(student, project) {
  const skillSim = cosine(
    student.skillEmbedding,
    project.requiredEmbedding
  );  // 0..1

  const langOK   = overlap(student.langs, project.langs);
  const tzScore  = 1 - abs(student.tz - project.tz)/12;
  const availOK  = student.hoursPerWeek >= project.hoursNeeded;
  const ratingW  = (student.rating ?? 4) / 5;

  return 0.55*skillSim
       + 0.15*langOK
       + 0.15*tzScore
       + 0.10*availOK
       + 0.05*ratingW;
}
// top 5 -> öneri
`}</code></pre>
          </Card>
        </div>

        <Card className="p-7 bg-gradient-card shadow-card">
          <h3 className="font-semibold text-lg mb-4">Örnek API Endpointleri</h3>
          <div className="grid md:grid-cols-2 gap-3 font-mono text-xs">
            {[
              ["POST", "/api/auth/register"],
              ["POST", "/api/students/profile"],
              ["GET",  "/api/projects?match=true"],
              ["POST", "/api/projects"],
              ["POST", "/api/match/run"],
              ["POST", "/api/projects/:id/apply"],
              ["GET",  "/api/projects/:id/tasks"],
              ["POST", "/api/projects/:id/tasks"],
              ["POST", "/api/messages/:channel"],
              ["POST", "/api/reviews"],
              ["GET",  "/api/certificates/:id/verify"],
              ["GET",  "/api/admin/metrics"],
            ].map(([m, p]) => (
              <div key={p} className="flex items-center gap-3 p-2.5 rounded-md bg-secondary/60">
                <Badge variant={m === "GET" ? "secondary" : "default"} className="font-mono">{m}</Badge>
                <code className="text-foreground">{p}</code>
              </div>
            ))}
          </div>
        </Card>
      </Section>

      {/* 5. UI/UX */}
      <Section id="design" eyebrow="05 — UI/UX Tasarım" title="Global SaaS hissi: minimal, güvenilir, hızlı">
        <div className="grid md:grid-cols-3 gap-5 mb-8">
          {[
            { t: "Ana Sayfa", d: "Hero (manifesto + CTA), eşleştirme animasyonu, 3 kullanıcı yolu, etki metrikleri, sosyal kanıt, sponsor logoları." },
            { t: "Dashboard", d: "Sol sidebar (rol bazlı menü), üst KPI kartları, aktif projeler tablosu, sağ aktivite akışı, hızlı eylem butonu." },
            { t: "Profil", d: "Üstte avatar+puan, beceriler chip listesi, tamamlanan projeler timeline, sertifikalar grid, paylaşılabilir public link." },
          ].map((w) => (
            <Card key={w.t} className="p-6 bg-gradient-card shadow-card">
              <Badge variant="secondary" className="mb-3">Wireframe</Badge>
              <h4 className="font-semibold mb-2">{w.t}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{w.d}</p>
            </Card>
          ))}
        </div>

        <Card className="p-7 bg-gradient-card shadow-card">
          <h3 className="font-semibold mb-5">Renk Paleti & Stil</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { c: "bg-hero", l: "Hero Gradient", h: "Indigo → Cyan" },
              { c: "bg-primary", l: "Primary", h: "#1E40FF" },
              { c: "bg-accent", l: "Accent", h: "Teal #20C5B0" },
              { c: "bg-foreground", l: "Ink", h: "Slate 950" },
              { c: "bg-muted", l: "Surface", h: "Slate 50" },
            ].map((p) => (
              <div key={p.l}>
                <div className={`${p.c} h-20 rounded-xl shadow-card mb-2 border border-border/40`} />
                <div className="text-sm font-semibold">{p.l}</div>
                <div className="text-xs text-muted-foreground">{p.h}</div>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-6">
            <strong className="text-foreground">Tipografi:</strong> Sora (başlık) + Inter (gövde). Yumuşak gölgeler, 14px radius, generous whitespace, micro-interaction'lar (200-300ms).
          </p>
        </Card>
      </Section>

      {/* 6. BUSINESS MODEL */}
      <Section id="business" eyebrow="06 — İş Modeli" title="Çoklu gelir, sürdürülebilir etki">
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { icon: Users, t: "Freemium (Öğrenci)", d: "Ücretsiz katılım. Premium (₺79/ay): erken eşleşme, mentor 1-1, sertifika öncelikli." },
            { icon: Briefcase, t: "B2B (KOBİ)", d: "Proje başına %15 platform fee veya aylık paket ($99-$499). Enterprise: özel ekip + SLA." },
            { icon: Heart, t: "CSR & Hibe", d: "Kurumsal sponsorluk (Türk Telekom, Garanti, BMW Vakfı), AB hibeleri, UNDP & Erasmus+ ortaklığı." },
          ].map((m) => (
            <Card key={m.t} className="p-6 bg-gradient-card shadow-card hover:shadow-elegant transition-smooth">
              <m.icon className="w-8 h-8 text-primary mb-3" />
              <h4 className="font-semibold mb-2">{m.t}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{m.d}</p>
            </Card>
          ))}
        </div>
        <Card className="p-6 mt-6 bg-gradient-primary text-primary-foreground shadow-elegant">
          <div className="flex items-start gap-4">
            <TrendingUp className="w-6 h-6 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold mb-1">12 ay hedef gelir karması</h4>
              <p className="text-sm text-primary-foreground/85">%45 B2B fee · %25 kurumsal sponsorluk · %20 hibe · %10 öğrenci premium. ARR hedefi: $250K-$400K.</p>
            </div>
          </div>
        </Card>
      </Section>

      {/* 7. SCALE & RISKS */}
      <Section id="scale" eyebrow="07 — Ölçeklenebilirlik & Riskler" title="Küresel büyüme, kontrollü risk">
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-7 bg-gradient-card shadow-card">
            <Rocket className="w-7 h-7 text-accent mb-3" />
            <h3 className="font-semibold text-lg mb-3">Global Expansion Planı</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" /> Faz 1: Türkiye + Balkanlar (pilot, 6 ay)</li>
              <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" /> Faz 2: MENA + Orta Asya (üniversite ortaklıkları)</li>
              <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" /> Faz 3: Afrika + Güneydoğu Asya (UNDP partnership)</li>
              <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" /> Faz 4: LATAM, çoklu dil (ES, FR, AR, EN, TR)</li>
            </ul>
          </Card>
          <Card className="p-7 bg-gradient-card shadow-card">
            <AlertTriangle className="w-7 h-7 text-destructive mb-3" />
            <h3 className="font-semibold text-lg mb-3">Risk & Çözüm</h3>
            <ul className="space-y-3 text-sm">
              <li><strong className="text-foreground">Zaman farkı:</strong> <span className="text-muted-foreground">Async-first kültür, Loom standuplar, otomatik özet AI.</span></li>
              <li><strong className="text-foreground">Kalite kontrol:</strong> <span className="text-muted-foreground">Mentor denetimi + milestone onayı + 5-boyutlu rating.</span></li>
              <li><strong className="text-foreground">Motivasyon kaybı:</strong> <span className="text-muted-foreground">Gamification (XP, rozet), mikro-ödemeler, peer accountability.</span></li>
              <li><strong className="text-foreground">Dolandırıcılık:</strong> <span className="text-muted-foreground">KYC, escrow ödeme, AI içerik denetimi.</span></li>
            </ul>
          </Card>
        </div>
      </Section>

      {/* 8. MVP */}
      <Section id="mvp" eyebrow="08 — MVP Tanımı" title="3 ayda sahaya çıkacak lean versiyon">
        <Card className="p-8 bg-gradient-card shadow-elegant">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-4 text-accent">✅ MVP'de Olacaklar</h3>
              <ul className="space-y-2.5 text-sm">
                {["Email auth + 3 rol (öğrenci, KOBİ, mentor)",
                  "Profil + skill tag sistemi",
                  "Manuel + tag-bazlı eşleştirme (AI sonra)",
                  "Basit proje sayfası: brief, task listesi, deadline",
                  "1-1 mesajlaşma (text)",
                  "Çift yönlü değerlendirme (5 yıldız + yorum)",
                  "PDF sertifika üretimi",
                  "Admin paneli (eşleşme + içerik denetimi)"].map((i) => (
                  <li key={i} className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" /><span>{i}</span></li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-muted-foreground">⏳ V2'ye Bırakılanlar</h3>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                {["AI embedding tabanlı eşleştirme",
                  "Video görüşme entegrasyonu",
                  "Escrow + milestone ödemeleri",
                  "Mobil native uygulama",
                  "Gamification & XP sistemi",
                  "Çoklu dil (EN, AR, ES, FR)",
                  "Blockchain doğrulamalı sertifika",
                  "Public API & ortak entegrasyonları"].map((i) => (
                  <li key={i} className="flex gap-2"><span className="text-muted-foreground/60">○</span><span>{i}</span></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-border/60 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Hedef pilot</div>
              <div className="font-semibold">100 öğrenci · 30 KOBİ · 10 mentor · 25 tamamlanan proje</div>
            </div>
            <Link to="/auth"><Button size="lg" className="bg-gradient-primary border-0 shadow-glow">Pilota Katıl <ArrowRight className="ml-2 w-4 h-4" /></Button></Link>
          </div>
        </Card>
      </Section>

      {/* FOOTER */}
      <footer className="border-t border-border/60 py-10 mt-10">
        <div className="container flex flex-col md:flex-row justify-between gap-4 text-sm text-muted-foreground">
          <div>© 2026 Sınır Tanımayan Stajyerler — Türkiye'den dünyaya.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground transition-smooth">Manifesto</a>
            <a href="#" className="hover:text-foreground transition-smooth">İletişim</a>
            <a href="#" className="hover:text-foreground transition-smooth">Yatırımcı Kit</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
