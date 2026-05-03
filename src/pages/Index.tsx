import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  Globe2, Briefcase, Award, UserPlus, Search, Rocket, BadgeCheck,
  GraduationCap, Building2, ArrowRight, Check, Mail, Phone, MapPin
} from "lucide-react";
import heroIllustration from "@/assets/hero-illustration.jpg";

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href} className="text-sm text-slate-600 hover:text-slate-900 transition-colors">{children}</a>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* NAV */}
      <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-slate-100">
        <div className="container mx-auto max-w-7xl px-6 flex h-16 items-center justify-between">
          <a href="#" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1E40AF] flex items-center justify-center">
              <Globe2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-slate-900">Sınır Tanımayan Stajyerler</span>
          </a>
          <nav className="hidden lg:flex items-center gap-8">
            <NavLink href="#hero">Ana Sayfa</NavLink>
            <NavLink href="#how">Nasıl Çalışır?</NavLink>
            <NavLink href="#students">Öğrenciler</NavLink>
            <NavLink href="#business">İşletmeler</NavLink>
            <NavLink href="#contact">İletişim</NavLink>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/auth"><Button variant="ghost" size="sm" className="text-slate-700">Giriş Yap</Button></Link>
            <Link to="/auth"><Button size="sm" className="bg-[#1E40AF] hover:bg-[#1E3A8A] text-white">Kayıt Ol</Button></Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section id="hero" className="container mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#1E40AF] text-xs font-medium mb-6">
              🌍 Türkiye merkezli, küresel etkili
            </span>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] text-slate-900 mb-5">
              Sınırları Aş, <span className="text-[#1E40AF]">Deneyim Kazan</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-xl">
              Türkiye'deki üniversite öğrencilerini dünya ile buluşturan dijital staj ve mentorluk platformu.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/auth">
                <Button size="lg" className="bg-[#1E40AF] hover:bg-[#1E3A8A] text-white">
                  Hemen Katıl <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">
                  İşletme Olarak Katıl
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100/40 to-transparent rounded-3xl -z-10" />
            <img
              src={heroIllustration}
              alt="Küresel staj ağı illüstrasyonu"
              width={1280}
              height={1024}
              className="w-full h-auto rounded-2xl"
            />
          </div>
        </div>
      </section>

      {/* QUICK FEATURES */}
      <section className="container mx-auto max-w-7xl px-6 pb-16 md:pb-20">
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { icon: Globe2, title: "Küresel Deneyim", desc: "Farklı ülkelerdeki gerçek projelerde uluslararası deneyim kazan." },
            { icon: Briefcase, title: "Gerçek Projeler", desc: "Sahada çalışan KOBİ ve sosyal girişimlerle birebir çalış." },
            { icon: Award, title: "Sertifika Fırsatı", desc: "Tamamladığın her projeden doğrulanabilir dijital sertifika al." },
          ].map((f) => (
            <Card key={f.title} className="p-6 border border-slate-100 shadow-[0_2px_12px_rgba(15,23,42,0.04)] hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)] transition-shadow rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-[#1E40AF]" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-slate-900">{f.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="bg-slate-50/60 border-y border-slate-100">
        <div className="container mx-auto max-w-7xl px-6 py-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-[#1E40AF] text-xs font-medium mb-4">Nasıl Çalışır?</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">Dört adımda başla</h2>
            <p className="text-slate-600">Kayıttan sertifikaya kadar süreç sade ve şeffaf.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: UserPlus, title: "Profilini Oluştur", desc: "Yeteneklerini, ilgi alanlarını ve müsaitliğini ekle." },
              { icon: Search, title: "Eşleşmeni Bul", desc: "Sana uygun küresel projeleri akıllı sistemle keşfet." },
              { icon: Rocket, title: "Projeye Başla", desc: "Mentor desteğiyle gerçek bir ekipte çalışmaya başla." },
              { icon: BadgeCheck, title: "Sertifikanı Al", desc: "Başarıyla tamamladığın projeden dijital sertifika kazan." },
            ].map((s, i) => (
              <Card key={s.title} className="p-6 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(15,23,42,0.04)] rounded-2xl relative">
                <div className="absolute top-5 right-5 text-xs font-bold text-slate-300">0{i + 1}</div>
                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                  <s.icon className="w-5 h-5 text-[#1E40AF]" />
                </div>
                <h3 className="font-semibold mb-2 text-slate-900">{s.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{s.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FOR WHO */}
      <section className="container mx-auto max-w-7xl px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-[#1E40AF] text-xs font-medium mb-4">Kimler İçin?</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">Herkes için bir fırsat</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Card id="students" className="p-8 border border-slate-100 shadow-[0_2px_12px_rgba(15,23,42,0.04)] rounded-2xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-[#1E40AF]" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Öğrenciler İçin</h3>
            </div>
            <ul className="space-y-3">
              {[
                "Uluslararası deneyim kazan",
                "Gerçek projelerde yer al",
                "Kariyerine güçlü başla",
                "Mentorluk desteği al",
              ].map((b) => (
                <li key={b} className="flex items-start gap-3 text-slate-700">
                  <Check className="w-5 h-5 text-[#1E40AF] shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <Link to="/auth" className="inline-block mt-6">
              <Button className="bg-[#1E40AF] hover:bg-[#1E3A8A] text-white">Öğrenci Olarak Katıl</Button>
            </Link>
          </Card>

          <Card id="business" className="p-8 border border-slate-100 shadow-[0_2px_12px_rgba(15,23,42,0.04)] rounded-2xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-[#1E40AF]" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">İşletmeler İçin</h3>
            </div>
            <ul className="space-y-3">
              {[
                "Genç ve yetenekli danışmanlara ulaş",
                "İş süreçlerini geliştir",
                "Yenilikçi çözümler üret",
                "Düşük maliyetle yüksek fayda sağla",
              ].map((b) => (
                <li key={b} className="flex items-start gap-3 text-slate-700">
                  <Check className="w-5 h-5 text-[#1E40AF] shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <Link to="/auth" className="inline-block mt-6">
              <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">İşletme Olarak Katıl</Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-slate-50/60 border-y border-slate-100">
        <div className="container mx-auto max-w-7xl px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              ["250+", "Öğrenci"],
              ["80+", "İşletme"],
              ["40+", "Mentor"],
              ["15+", "Ülke"],
            ].map(([n, l]) => (
              <Card key={l} className="p-6 text-center bg-white border border-slate-100 rounded-2xl shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
                <div className="text-3xl md:text-4xl font-bold text-[#1E40AF] mb-1">{n}</div>
                <div className="text-sm text-slate-600">{l}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-3xl bg-gradient-to-br from-[#1E3A8A] via-[#1E40AF] to-[#3B82F6] p-10 md:p-16 text-white text-center shadow-[0_20px_60px_-15px_rgba(30,64,175,0.4)]">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
            Sen de küresel bir deneyimin parçası ol!
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Hemen katıl, yeni fırsatları keşfet ve geleceğini bugünden şekillendir.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/auth">
              <Button size="lg" className="bg-white text-[#1E40AF] hover:bg-blue-50">
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
      </section>

      {/* FOOTER */}
      <footer id="contact" className="border-t border-slate-100 bg-white">
        <div className="container mx-auto max-w-7xl px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#1E40AF] flex items-center justify-center">
                  <Globe2 className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-slate-900">Sınır Tanımayan Stajyerler</span>
              </div>
              <p className="text-sm text-slate-600 max-w-sm">
                Türkiye'deki üniversite öğrencilerini dünya ile buluşturan dijital staj ve mentorluk platformu.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-3 text-sm">Platform</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#how" className="hover:text-slate-900">Nasıl Çalışır?</a></li>
                <li><a href="#students" className="hover:text-slate-900">Öğrenciler</a></li>
                <li><a href="#business" className="hover:text-slate-900">İşletmeler</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-3 text-sm">İletişim</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> info@sinirtanimayan.com</li>
                <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> +90 212 000 00 00</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> İstanbul, Türkiye</li>
              </ul>
            </div>
          </div>
          <div className="pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} Sınır Tanımayan Stajyerler. Tüm hakları saklıdır.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
