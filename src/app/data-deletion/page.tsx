import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Deletion | Socialmat",
};

const DATA_DELETION_TEXT = `Instrukce pro smazání uživatelských dat (User Data Deletion) – Socialmat
Naposledy aktualizováno: 2025-12-23

1) Odpojení aplikace od Instagramu (revoke access)
- V nastavení Instagram/Meta otevři „Apps and Websites“ (Aplikace a weby)
- Najdi aplikaci Socialmat
- Zvol „Remove / Odebrat“

Odpojením se zastaví další přístup aplikace k Instagram API.

2) Žádost o smazání dat v Socialmat
Pošli e-mail:
- Komu: [DOPLŇ: např. privacy@socialmat.app]
- Předmět: Data deletion request
- Do zprávy uveď: svůj Instagram username (např. @tvoje_jmeno) a žádost o smazání dat.

3) Co smažeme
Po ověření žádosti smažeme nebo anonymizujeme data, která o tobě v rámci Socialmat uchováváme, typicky:
- propojení účtu v aplikaci (identifikátory, vazby)
- uložené přehledy/statistiky (pokud jsou uložené)
- případné cache/odvozené analytiky (pokud existují)

4) Lhůta vyřízení
Žádosti vyřizujeme nejpozději do: [DOPLŇ, např. 30 dnů].

5) Kontakt
Správce: [DOPLŇ]
E-mail: [DOPLŇ]
`;

export default function DataDeletionPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <pre className="whitespace-pre-wrap leading-6">{DATA_DELETION_TEXT}</pre>
    </main>
  );
}
