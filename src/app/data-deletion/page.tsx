"use client";

import { Send, ExternalLink, Clock, CheckCircle, Mail } from "lucide-react";
import { LegalLayout } from "@/components/layout/LegalLayout";

const sections = [
  { id: "odpojeni", title: "1. Odpojení od Instagramu" },
  { id: "zadost", title: "2. Žádost o smazání" },
  { id: "co-smazeme", title: "3. Co smažeme" },
  { id: "lhuta", title: "4. Lhůta vyřízení" },
  { id: "kontakt", title: "5. Kontakt" },
];

export default function DataDeletionPage() {
  return (
    <LegalLayout
      title="Smazání uživatelských dat"
      badge="Data Deletion"
      lastUpdated="23. prosince 2025"
      sections={sections}
    >
      <p className="text-lg text-white/70 mb-8">
        Níže najdeš instrukce, jak požádat o smazání svých dat z aplikace SocialMat
        a jak odpojit aplikaci od svého Instagram účtu.
      </p>

      {/* Quick action card */}
      <div className="bg-gradient-to-br from-[#833AB4]/20 via-[#E1306C]/10 to-transparent border border-[#E1306C]/30 rounded-2xl p-6 mb-12">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Mail className="w-5 h-5 text-[#E1306C]" />
          Rychlá žádost o smazání
        </h3>
        <p className="text-white/70 mb-4">
          Pošli e-mail s předmětem &ldquo;Data deletion request&rdquo; a uveď svůj Instagram username.
        </p>
        <a
          href="mailto:privacy@socialmat.app?subject=Data%20deletion%20request"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold transition-all hover:-translate-y-0.5"
          style={{
            background: "linear-gradient(135deg, #833AB4, #E1306C, #F77737)",
            boxShadow: "0 8px 24px -8px rgba(225, 48, 108, 0.4)",
          }}
        >
          <Send className="w-4 h-4" />
          privacy@socialmat.app
        </a>
      </div>

      <section id="odpojeni" className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">
          1. Odpojení aplikace od Instagramu (revoke access)
        </h2>
        <p className="text-white/70 mb-6">
          Pro okamžité zastavení přístupu aplikace k tvým datům:
        </p>

        <div className="space-y-4">
          {[
            {
              step: 1,
              title: "Otevři nastavení Instagramu",
              description: "V aplikaci Instagram jdi do Nastavení → Zabezpečení → Aplikace a weby",
            },
            {
              step: 2,
              title: "Najdi SocialMat",
              description: "V seznamu aktivních aplikací vyhledej \"SocialMat\"",
            },
            {
              step: 3,
              title: "Odeber přístup",
              description: "Klikni na \"Odebrat\" nebo \"Remove\" pro zrušení přístupu",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm"
                style={{ background: "linear-gradient(135deg, #833AB4, #E1306C)" }}
              >
                {item.step}
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                <p className="text-white/60 text-sm">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <p className="text-blue-200 text-sm flex items-start gap-2">
            <ExternalLink className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>
              Odpojením se okamžitě zastaví další přístup aplikace k Instagram API.
              Tvá existující data v SocialMat však zůstanou, dokud nepožádáš o jejich smazání.
            </span>
          </p>
        </div>
      </section>

      <section id="zadost" className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">
          2. Žádost o smazání dat v SocialMat
        </h2>
        <p className="text-white/70 mb-4">
          Pro kompletní smazání tvých dat z našich systémů pošli e-mail:
        </p>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-white/50 text-sm w-20">Komu:</span>
            <a href="mailto:privacy@socialmat.app" className="text-[#E1306C] hover:underline">
              privacy@socialmat.app
            </a>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/50 text-sm w-20">Předmět:</span>
            <span className="text-white">Data deletion request</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-white/50 text-sm w-20">Obsah:</span>
            <span className="text-white/70">
              Tvůj Instagram username (např. @tvoje_jmeno) a žádost o smazání dat
            </span>
          </div>
        </div>
      </section>

      <section id="co-smazeme" className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">3. Co smažeme</h2>
        <p className="text-white/70 mb-4">
          Po ověření žádosti smažeme nebo anonymizujeme všechna data, která o tobě uchováváme:
        </p>

        <ul className="space-y-3">
          {[
            "Propojení účtu v aplikaci (identifikátory, vazby)",
            "Uložené přehledy a statistiky",
            "Cache a odvozené analytiky",
            "Historii aktivit a nastavení",
          ].map((item, i) => (
            <li key={i} className="flex items-center gap-3 text-white/70">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section id="lhuta" className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">4. Lhůta vyřízení</h2>

        <div className="flex items-center gap-4 p-6 rounded-xl bg-white/5 border border-white/10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#833AB4]/20 to-[#E1306C]/20 flex items-center justify-center">
            <Clock className="w-8 h-8 text-[#E1306C]" />
          </div>
          <div>
            <p className="text-white font-semibold text-lg">Maximálně 30 dní</p>
            <p className="text-white/60 text-sm">
              Žádosti vyřizujeme nejpozději do 30 dní od obdržení.
              Obvykle však do 7 pracovních dnů.
            </p>
          </div>
        </div>
      </section>

      <section id="kontakt">
        <h2 className="text-2xl font-bold text-white mb-4">5. Kontakt</h2>

        <div className="space-y-3 text-white/70">
          <p>
            <strong className="text-white">Správce:</strong> SocialMat s.r.o.
          </p>
          <p>
            <strong className="text-white">E-mail:</strong>{" "}
            <a href="mailto:privacy@socialmat.app" className="text-[#E1306C] hover:underline">
              privacy@socialmat.app
            </a>
          </p>
        </div>

        <div className="mt-6 p-4 rounded-xl bg-[#E1306C]/10 border border-[#E1306C]/20">
          <p className="text-white/80 text-sm">
            Máš-li jakékoliv otázky ohledně zpracování tvých osobních údajů,
            neváhej nás kontaktovat. Rádi ti pomůžeme.
          </p>
        </div>
      </section>
    </LegalLayout>
  );
}
