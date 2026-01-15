"use client";

import Link from "next/link";
import { LegalLayout } from "@/components/layout/LegalLayout";

const sections = [
  { id: "spravce", title: "1. Správce a kontakt" },
  { id: "udaje", title: "2. Jaké údaje zpracováváme" },
  { id: "ucely", title: "3. K čemu údaje používáme" },
  { id: "zaklad", title: "4. Právní základ" },
  { id: "uchovani", title: "5. Kde a jak dlouho uchováváme" },
  { id: "sdileni", title: "6. Sdílení údajů" },
  { id: "smazani", title: "7. Jak požádat o smazání" },
  { id: "prava", title: "8. Tvá práva (GDPR)" },
  { id: "zmeny", title: "9. Změny zásad" },
];

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Ochrana osobních údajů"
      badge="Právní dokumenty"
      lastUpdated="23. prosince 2025"
      sections={sections}
    >
      <p className="text-lg text-white/70 mb-8">
        Tyto zásady popisují, jak aplikace SocialMat zpracovává osobní údaje při používání funkcí,
        zejména při propojení s Instagramem (Instagram Login).
      </p>

      <section id="spravce" className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">1. Správce a kontakt</h2>
        <div className="space-y-2 text-white/70">
          <p><strong className="text-white">Správce:</strong> SocialMat s.r.o.</p>
          <p><strong className="text-white">Sídlo:</strong> Praha, Česká republika</p>
          <p><strong className="text-white">Kontaktní e-mail:</strong>{" "}
            <a href="mailto:privacy@socialmat.app" className="text-[#E1306C] hover:underline">
              privacy@socialmat.app
            </a>
          </p>
        </div>
      </section>

      <section id="udaje" className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">2. Jaké údaje zpracováváme</h2>

        <h3 className="text-lg font-semibold text-white mt-6 mb-3">
          2.1 Údaje z Instagramu (po přihlášení přes Instagram Login)
        </h3>
        <p className="text-white/70 mb-4">Po propojení účtu můžeme z Instagram API načítat a zobrazovat:</p>
        <ul className="list-none space-y-2 text-white/70">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E1306C] mt-2 flex-shrink-0" />
            <span><strong className="text-white">Identifikátory účtu:</strong> Instagram User ID, uživatelské jméno (username)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E1306C] mt-2 flex-shrink-0" />
            <span><strong className="text-white">Profilové údaje:</strong> profilový obrázek (URL), počet sledujících (followers count)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E1306C] mt-2 flex-shrink-0" />
            <span><strong className="text-white">Média:</strong> seznam příspěvků, jejich ID, typ média, URL/permalink, čas publikace</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E1306C] mt-2 flex-shrink-0" />
            <span><strong className="text-white">Statistiky (Insights):</strong> statistiky na úrovni účtu a jednotlivých médií (views, reach, saved, shares)</span>
          </li>
        </ul>

        <h3 className="text-lg font-semibold text-white mt-6 mb-3">2.2 Technické údaje</h3>
        <ul className="list-none space-y-2 text-white/70">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E1306C] mt-2 flex-shrink-0" />
            <span>IP adresa a user-agent (protokoly hostingu / reverse proxy)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E1306C] mt-2 flex-shrink-0" />
            <span>Záznamy o chybách a provozu (např. čas požadavku, stavový kód)</span>
          </li>
        </ul>
      </section>

      <section id="ucely" className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">3. K čemu údaje používáme (účely)</h2>
        <ul className="list-none space-y-2 text-white/70">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E1306C] mt-2 flex-shrink-0" />
            <span>Propojení a autentizace Instagram účtu (Instagram Login)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E1306C] mt-2 flex-shrink-0" />
            <span>Zobrazení přehledu profilu a statistik účtu</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E1306C] mt-2 flex-shrink-0" />
            <span>Zobrazení seznamu příspěvků a statistik k jednotlivým příspěvkům</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E1306C] mt-2 flex-shrink-0" />
            <span>Zabezpečení, diagnostika a zlepšování stability aplikace</span>
          </li>
        </ul>
      </section>

      <section id="zaklad" className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">4. Právní základ</h2>
        <ul className="list-none space-y-2 text-white/70">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E1306C] mt-2 flex-shrink-0" />
            <span>Souhlas / autorizace při propojení Instagram účtu (OAuth)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E1306C] mt-2 flex-shrink-0" />
            <span>Oprávněný zájem na provozu a zabezpečení služby (u technických logů)</span>
          </li>
        </ul>
      </section>

      <section id="uchovani" className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">5. Kde a jak dlouho údaje uchováváme</h2>
        <ul className="list-none space-y-2 text-white/70">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E1306C] mt-2 flex-shrink-0" />
            <span>Token a informace o platnosti mohou být uloženy lokálně v prohlížeči (např. localStorage)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E1306C] mt-2 flex-shrink-0" />
            <span>Na serveru údaje typicky zpracováváme přechodně pro vyřízení požadavku</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E1306C] mt-2 flex-shrink-0" />
            <span>Provozní logy (pokud jsou aktivní) uchováváme po dobu 30 dní</span>
          </li>
        </ul>
      </section>

      <section id="sdileni" className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">6. Sdílení údajů a zpracovatelé</h2>
        <ul className="list-none space-y-2 text-white/70">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E1306C] mt-2 flex-shrink-0" />
            <span><strong className="text-white">Meta/Instagram</strong> – Instagram API pro načítání dat</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E1306C] mt-2 flex-shrink-0" />
            <span><strong className="text-white">Vercel</strong> – Hosting a infrastruktura</span>
          </li>
        </ul>
      </section>

      <section id="smazani" className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">7. Jak požádat o smazání dat</h2>
        <p className="text-white/70 mb-4">
          Podrobné instrukce pro smazání dat najdeš na stránce{" "}
          <Link href="/data-deletion" className="text-[#E1306C] hover:underline">
            Smazání dat
          </Link>.
        </p>
        <p className="text-white/70">
          Případně můžeš poslat e-mail na{" "}
          <a href="mailto:privacy@socialmat.app" className="text-[#E1306C] hover:underline">
            privacy@socialmat.app
          </a>{" "}
          (uveď svůj Instagram username).
        </p>
      </section>

      <section id="prava" className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">8. Tvá práva (EU/GDPR)</h2>
        <p className="text-white/70 mb-4">Máš právo:</p>
        <ul className="list-none space-y-2 text-white/70">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E1306C] mt-2 flex-shrink-0" />
            <span>Požádat o přístup ke svým osobním údajům</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E1306C] mt-2 flex-shrink-0" />
            <span>Požádat o opravu nepřesných údajů</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E1306C] mt-2 flex-shrink-0" />
            <span>Požádat o výmaz údajů</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E1306C] mt-2 flex-shrink-0" />
            <span>Požádat o omezení zpracování</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E1306C] mt-2 flex-shrink-0" />
            <span>Vznést námitku proti zpracování</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E1306C] mt-2 flex-shrink-0" />
            <span>Podat stížnost u dozorového úřadu (ÚOOÚ)</span>
          </li>
        </ul>
      </section>

      <section id="zmeny">
        <h2 className="text-2xl font-bold text-white mb-4">9. Změny těchto zásad</h2>
        <p className="text-white/70">
          Aktuální verze těchto zásad bude vždy dostupná na této stránce.
          O významných změnách tě budeme informovat e-mailem nebo notifikací v aplikaci.
        </p>
      </section>
    </LegalLayout>
  );
}
