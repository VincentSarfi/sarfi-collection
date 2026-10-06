// FAQ-Liste einer Apartment-Seite: zuerst Fragen zu genau diesem Apartment
// (aus den Daten erzeugt), dann einige allgemeine Haus-Fragen. Die übrigen
// Haus-Fragen stehen einmal auf /schoenblick statt wortgleich auf allen
// fünf Apartment-Seiten.

import type { Locale } from "@/lib/i18n";
import { schoenblick, type ApartmentData } from "./properties";

type Faq = { question: string; answer: string };

// Allgemeine Fragen (deutsche Quelle), die zusätzlich je Apartment erscheinen.
const GENERAL_ON_APARTMENT = new Set([
  "Wie läuft der Check-in ab?",
  "Wann ist der Check-out?",
  "Gibt es WLAN?",
  "Gibt es Parkplätze?",
  "Sind Haustiere erlaubt?",
  "Wie sind die Stornierungsbedingungen?",
]);

function joinNames(names: string[], and: string): string {
  return names.length > 1 ? `${names.slice(0, -1).join(", ")} ${and} ${names.at(-1)}` : names.join("");
}

function specificFaqs(apt: ApartmentData, locale: Locale): Faq[] {
  const others = Object.values(schoenblick.apartments ?? {})
    .filter((a) => a.id !== apt.id)
    .map((a) => a.name);
  const rooms = (apt.bedroomImages ?? []).map((b) => `${b.name}: ${b.bed}`).join("; ");

  if (locale === "en") {
    return [
      {
        question: `What is ${apt.name} like – is there a balcony or terrace?`,
        answer: `${apt.style} Location: ${apt.location} · Outdoor space: ${apt.outdoor}.`,
      },
      {
        question: `What are the beds like in ${apt.name}?`,
        answer: `${apt.name} has ${apt.bedrooms} bedrooms – ${rooms}. It sleeps up to ${apt.maxGuests} guests.`,
      },
      {
        question: `How big is ${apt.name} and how much does a night cost?`,
        answer: `${apt.name} has ${apt.sqm} m² of living space with ${apt.bedrooms} bedrooms and ${apt.bathrooms} bathroom${apt.bathrooms > 1 ? "s" : ""}. Booked direct with us, a night costs from €${apt.priceFrom}; the exact price depends on your travel dates and is shown during booking, together with the one-off final cleaning fee. There is no tourist tax.`,
      },
      {
        question: `Can I combine ${apt.name} with other apartments?`,
        answer: `Yes. ${apt.name} is one of five apartments at Haus Schönblick, alongside ${joinNames(others, "and")}. With our group booking you can book several of them in one go – for up to 20 guests.`,
      },
    ];
  }

  return [
    {
      question: `Wie ist ${apt.name} eingerichtet – gibt es Balkon oder Terrasse?`,
      answer: `${apt.style} Lage: ${apt.location} · Außenbereich: ${apt.outdoor}.`,
    },
    {
      question: `Welche Betten gibt es in ${apt.name}?`,
      answer: `${apt.name} hat ${apt.bedrooms} Schlafzimmer – ${rooms}. Platz ist für bis zu ${apt.maxGuests} Personen.`,
    },
    {
      question: `Wie groß ist ${apt.name} und was kostet eine Nacht?`,
      answer: `${apt.name} hat ${apt.sqm} m² Wohnfläche mit ${apt.bedrooms} Schlafzimmern und ${apt.bathrooms} Badezimmer. Direkt bei uns gebucht kostet eine Nacht ab ${apt.priceFrom} €; der genaue Preis hängt vom Reisezeitraum ab und wird dir bei der Buchung zusammen mit der einmaligen Endreinigung angezeigt. Eine Kurtaxe gibt es nicht.`,
    },
    {
      question: `Kann ich ${apt.name} mit anderen Apartments kombinieren?`,
      answer: `Ja. ${apt.name} ist eines von fünf Apartments im Haus Schönblick, zusammen mit ${joinNames(others, "und")}. Über die Gruppenbuchung buchst du mehrere davon in einem Schritt – für bis zu 20 Personen.`,
    },
  ];
}

/**
 * FAQs für die Apartment-Seite. `apt` ist bereits lokalisiert
 * (localizeProperty); die allgemeinen Fragen werden über ihre Position in der
 * deutschen Quelle ausgewählt, weil die Übersetzung die Reihenfolge behält.
 */
export function apartmentFaqs(apt: ApartmentData, locale: Locale): Faq[] {
  const general = schoenblick.faqs.flatMap((faq, i) =>
    GENERAL_ON_APARTMENT.has(faq.question) && apt.faqs[i] ? [apt.faqs[i]] : [],
  );
  return [...specificFaqs(apt, locale), ...general];
}
