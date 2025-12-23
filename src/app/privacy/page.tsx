import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Socialmat",
};

const PRIVACY_TEXT = `Zásady ochrany osobních údajů (Privacy Policy) – Socialmat
Naposledy aktualizováno: 2025-12-23

Tyto zásady popisují, jak aplikace Socialmat („aplikace“, „my“) zpracovává osobní údaje při používání funkcí, zejména při propojení s Instagramem (Instagram Login).

1) Správce a kontakt
Správce: [DOPLŇ: název firmy / jméno a příjmení]
Sídlo: [DOPLŇ]
IČ: [DOPLŇ] (pokud relevantní)
Kontaktní e-mail pro ochranu soukromí: [DOPLŇ: např. privacy@socialmat.app]

2) Jaké údaje zpracováváme
2.1 Údaje z Instagramu (po přihlášení přes Instagram Login)
Po propojení účtu můžeme z Instagram API načítat a zobrazovat:
- Identifikátory účtu: Instagram User ID, uživatelské jméno (username)
- Profilové údaje: profilový obrázek (URL), počet sledujících (followers count)
- Média: seznam příspěvků (např. posledních N), jejich ID, typ média, URL/permalink, čas publikace, případně popisek (dle dostupnosti)
- Statistiky (Insights):
  - statistiky na úrovni účtu (Account Insights)
  - statistiky na úrovni konkrétního média (Media Insights), např. views, reach, saved, shares (dle typu média a dostupnosti v API)

2.2 Technické údaje
- IP adresa a user-agent (protokoly hostingu / reverse proxy)
- záznamy o chybách a provozu (např. čas požadavku, stavový kód)

3) K čemu údaje používáme (účely)
- propojení a autentizace Instagram účtu (Instagram Login)
- zobrazení přehledu profilu a statistik účtu
- zobrazení seznamu příspěvků a statistik k jednotlivým příspěvkům
- zabezpečení, diagnostika a zlepšování stability aplikace

4) Právní základ
- souhlas / autorizace při propojení Instagram účtu (OAuth)
- oprávněný zájem na provozu a zabezpečení služby (u technických logů), pokud relevantní

5) Kde a jak dlouho údaje uchováváme
- Token a informace o platnosti mohou být uloženy lokálně v prohlížeči (např. localStorage).
- Na serveru údaje typicky zpracováváme přechodně pro vyřízení požadavku.
- Provozní logy (pokud jsou aktivní) uchováváme po dobu: [DOPLŇ, např. 30 dní].

6) Sdílení údajů a zpracovatelé
- Meta/Instagram (Instagram API)
- Hosting/infrastruktura: [DOPLŇ: např. Vercel]

7) Jak požádat o smazání dat (Data Deletion)
Instrukce: https://www.socialmat.app/data-deletion (uprav na svou doménu)
Případně e-mailem na: [DOPLŇ EMAIL] (uveď Instagram username).

8) Tvá práva (EU/GDPR)
Máš právo požádat o přístup, opravu, výmaz, omezení zpracování, vznést námitku a podat stížnost u dozorového úřadu.

9) Změny těchto zásad
Aktuální verze bude vždy dostupná na této stránce.
`;

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <pre className="whitespace-pre-wrap leading-6">{PRIVACY_TEXT}</pre>
    </main>
  );
}
