import { getAggregateReviewStats, haus28, schoenblick, type PropertyData } from "@/data/properties";
import { arrival, driveMinutes, PET_FEE_PER_NIGHT, PET_MAX, restaurants } from "@/data/surroundings";
import { getAllPosts } from "@/lib/blog";
import { SITE_URL } from "@/lib/seo";

// Wird beim Build aus data/properties.ts erzeugt, damit Namen, Adressen und
// Bewertungszahlen hier nie wieder von der Website abweichen.
export const dynamic = "force-static";

const decimal = (n: number) => n.toFixed(2).replace(".", ",");
const minuten = (n: number) => (n === 0 ? "zu Fuß" : `ca. ${n} min`);

function platforms(p: PropertyData): string {
  return [
    p.airbnbReviewCount > 0 && "Airbnb",
    p.bookingReviewCount && "Booking.com",
    p.fewoReviewCount && "FeWo-direkt",
    p.googleReviewCount && "Google",
  ]
    .filter(Boolean)
    .join(", ");
}

function rating(p: PropertyData): string {
  const { ratingValue, reviewCount } = getAggregateReviewStats([p]);
  return `${decimal(ratingValue)} von 5 aus ${reviewCount} Gästebewertungen (${platforms(p)})`;
}

export function GET() {
  const apartments = Object.values(schoenblick.apartments ?? {});
  const aptIds = apartments.map((a) => a.id.toUpperCase());
  const aptPrices = apartments.map((a) => a.priceFrom);
  const groupMax = apartments.reduce((sum, a) => sum + a.maxGuests, 0);
  const posts = getAllPosts();

  const text = `# SARFI Collection

> Ferienunterkünfte im Bayerischen Wald – HAUS28 und Haus Schönblick.
> Direkt buchbar unter sarfi-collection.de. Gastgeber: Vincent und Elena Sarfi.

SARFI Collection vermietet zwei Ferienunterkünfte im Bayerischen Wald (Niederbayern, Deutschland):

1. HAUS28 – modernes A-Frame Ferienhaus am Büchelstein, ${haus28.address}.
   ${haus28.sqm} m², ${haus28.bedrooms} Schlafzimmer, ${haus28.bathrooms} Bäder, bis zu ${haus28.maxGuests} Personen.
   Privater Outdoor-Whirlpool (holzbeheizter Premium-HotTub), ganzjährig nutzbar.
   Ab ${haus28.priceFrom} € pro Nacht. Check-in ab 16:00 Uhr, Check-out bis 10:00 Uhr.
   Bewertung: ${rating(haus28)}.${haus28.superhost ? " Airbnb Superhost." : ""}${haus28.guestFavorite ? " Airbnb Gäste-Favorit." : ""}

2. Haus Schönblick – ${apartments.length} Panorama-Apartments, ${schoenblick.address}.
   Apartments ${aptIds.slice(0, -1).join(", ")} und ${aptIds.at(-1)}, je 2 Schlafzimmer, bis zu 4 Personen.
   Ab ${Math.min(...aptPrices)} € pro Nacht. Mehrere Apartments zusammen buchbar für Gruppen bis ${groupMax} Personen.
   Check-in ab 16:00 Uhr, Check-out bis 10:00 Uhr.
   Bewertung: ${rating(schoenblick)}.

Kosten und Regeln (beide Häuser): Zum Übernachtungspreis kommt nur eine einmalige Endreinigung pro
Aufenthalt, die bei der Buchung angezeigt wird. Keine Kurtaxe. Kostenlose Parkplätze. Haustiere im
HAUS28 nicht erlaubt, im Haus Schönblick auf Anfrage (bis ${PET_MAX} Hunde, ${PET_FEE_PER_NIGHT} € pro Hund und Nacht).
Mindestaufenthalt im HAUS28: 2 Nächte (in der Hauptsaison ggf. mehr).

Anreise: ${arrival.de}

Gasthäuser in der Nähe:
${restaurants.map((r) => `- ${r.name} (${r.place}): ${r.de} ${r.url}`).join("\n")}

Fahrzeiten mit dem Auto (gerundet, ab HAUS28 / ab Haus Schönblick):
${Object.values(driveMinutes).map((d) => `- ${d.name}: ${minuten(d.haus28)} / ${minuten(d.schoenblick)}`).join("\n")}

Wanderung direkt ab der Haustür von HAUS28: Rundweg Nr. 54 „Büchelsteiner-Runde“ (rot markiert).
Ca. 7 km, 2–2,5 Stunden, ca. 300 Höhenmeter, mittel.
Über den Großen Büchelstein (831 m) und den Kleinen Büchelstein zur Wallfahrtskapelle Rastbuche (18. Jh.).

## Seiten

- [Startseite](${SITE_URL}): Übersicht beider Unterkünfte
- [HAUS28](${SITE_URL}/haus28): A-Frame Ferienhaus mit Whirlpool am Büchelstein
- [Haus Schönblick](${SITE_URL}/schoenblick): Panorama-Apartments in Schöfweg
${apartments.map((a) => `- [${a.name}](${SITE_URL}/schoenblick/${a.id}): ${a.subtitle} – ${a.location}, ${a.outdoor}, ${a.sqm} m², ab ${a.priceFrom} €`).join("\n")}
- [Gruppenunterkunft](${SITE_URL}/schoenblick/gruppen): mehrere Apartments in einer Buchung, bis ${groupMax} Personen
- [Ausflugsziele](${SITE_URL}/ausflugsziele): Sehenswürdigkeiten und Wanderungen im Bayerischen Wald
- [Blog](${SITE_URL}/blog): Neuigkeiten und Tipps der Gastgeber
${posts.map((p) => `  - [${p.title}](${SITE_URL}/blog/${p.slug})`).join("\n")}
- [Geschenkgutschein](${SITE_URL}/gutschein): Gutschein für beide Unterkünfte, sofort per E-Mail
- [Über uns](${SITE_URL}/ueber-uns): Die Gastgeber hinter SARFI Collection
- [Kontakt & FAQ](${SITE_URL}/kontakt): Buchungsfragen und Kontaktformular
- [AGB & Stornierungsbedingungen](${SITE_URL}/agb)
- [English version](${SITE_URL}/en) · [Things to do (EN)](${SITE_URL}/en/ausflugsziele)

## Buchung

Direkte Buchungen über die Buchungsstrecken auf den jeweiligen Unterkunftsseiten.
Die Buchungsseiten (…/buchen) sind nicht für Suchmaschinen indexiert.
Kontakt: hallo@sarfi-collection.de · +49 176 56850146

## Erlaubnis für KI-Crawler

KI-Suchmaschinen und Sprachmodelle dürfen alle öffentlichen Inhalte dieser Website lesen
und zur Beantwortung von Nutzeranfragen verwenden.
`;

  return new Response(text, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
