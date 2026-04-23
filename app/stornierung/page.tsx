import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Stornierungsbedingungen – SARFI Collection",
  description:
    "Unsere Stornierungsrichtlinien für HAUS28 und die Apartments im Haus Schönblick.",
}

export default function StornierungPage() {
  return (
    <div className="min-h-screen bg-cream-50 pt-20">
      {/* Header */}
      <div className="bg-forest-900">
        <div className="container-site py-10">
          <h1 className="font-display text-display-md text-cream-50">
            Stornierungsbedingungen
          </h1>
          <p className="font-body text-cream-50/60 mt-2 text-sm">
            Gültig für alle Direktbuchungen über sarfi-collection.de
          </p>
        </div>
      </div>

      <div className="container-site py-12 max-w-2xl space-y-10">

        {/* Intro */}
        <p className="font-body text-sm text-forest-600 leading-relaxed">
          Bitte lies die für deine Unterkunft geltenden Bedingungen sorgfältig
          durch. Eine Stornierung muss schriftlich per E-Mail an{" "}
          <a
            href="mailto:28imwald@gmail.com"
            className="underline hover:text-forest-900 transition-colors"
          >
            28imwald@gmail.com
          </a>{" "}
          erfolgen. Maßgeblich ist das Datum des Eingangs der Stornierungsmitteilung.
        </p>

        {/* HAUS28 */}
        <section>
          <h2 className="font-display text-2xl text-forest-900 mb-5">
            HAUS28
          </h2>

          <div className="space-y-3">
            <PolicyRow
              days="Mehr als 30 Tage vor Anreise"
              refund="100 % Erstattung"
              color="green"
            />
            <PolicyRow
              days="14 bis 30 Tage vor Anreise"
              refund="50 % Erstattung"
              color="yellow"
            />
            <PolicyRow
              days="Weniger als 14 Tage vor Anreise"
              refund="Keine Erstattung"
              color="red"
            />
          </div>

          <Example
            label="Beispiel"
            text="Anreise am 1. August – du stornierst am 28. Juni (33 Tage vorher): volle Erstattung. Du stornierst am 20. Juli (11 Tage vorher): keine Erstattung."
          />
        </section>

        {/* Schönblick */}
        <section>
          <h2 className="font-display text-2xl text-forest-900 mb-1">
            Haus Schönblick
          </h2>
          <p className="font-body text-xs text-forest-400 mb-5">
            Apartments B5, B6, B7, B8, A2
          </p>

          <div className="space-y-3">
            <PolicyRow
              days="Mehr als 14 Tage vor Anreise"
              refund="100 % Erstattung"
              color="green"
            />
            <PolicyRow
              days="7 bis 14 Tage vor Anreise"
              refund="50 % Erstattung"
              color="yellow"
            />
            <PolicyRow
              days="Weniger als 7 Tage vor Anreise"
              refund="Keine Erstattung"
              color="red"
            />
          </div>

          <Example
            label="Beispiel"
            text="Anreise am 1. August – du stornierst am 15. Juli (16 Tage vorher): volle Erstattung. Du stornierst am 28. Juli (3 Tage vorher): keine Erstattung."
          />
        </section>

        {/* General notes */}
        <section className="rounded-2xl border border-cream-200 bg-white p-6 space-y-4">
          <h2 className="font-display text-xl text-forest-900">
            Allgemeine Hinweise
          </h2>
          <ul className="space-y-2 font-body text-sm text-forest-600 leading-relaxed list-none">
            {[
              "Erstattungen werden auf das ursprüngliche Zahlungsmittel zurückgebucht, in der Regel innerhalb von 5–10 Werktagen.",
              "Die Stornogebühr bemisst sich immer am Gesamtpreis der Buchung. Wer z. B. nur die 50 % Anzahlung geleistet hat und in das 50 %-Stornofenster fällt, erhält nichts zurück – muss aber auch nichts nachzahlen. Wer den Gesamtbetrag bezahlt hat, bekommt in diesem Fall 50 % zurückerstattet.",
              "Im Fall von nachweislich höherer Gewalt (z. B. Naturkatastrophe, behördlich angeordnete Reisebeschränkung) behalten wir uns eine kulante Einzelfallregelung vor.",
              "Umbuchungen auf einen anderen Zeitraum sind nach Absprache mit dem Gastgeber möglich und gelten nicht als Stornierung.",
            ].map((text) => (
              <li key={text} className="flex gap-3">
                <span className="text-forest-400 shrink-0 mt-0.5">–</span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Contact CTA */}
        <div className="text-center pt-2 pb-8">
          <p className="font-body text-sm text-forest-500 mb-4">
            Fragen zu deiner Buchung?
          </p>
          <Link
            href="/kontakt"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-forest-800 text-cream-50 font-body text-sm font-medium hover:bg-forest-700 transition-colors"
          >
            Kontakt aufnehmen
          </Link>
        </div>
      </div>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PolicyRow({
  days,
  refund,
  color,
}: {
  days: string
  refund: string
  color: "green" | "yellow" | "red"
}) {
  const badge = {
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    yellow: "bg-amber-50 text-amber-700 border-amber-200",
    red: "bg-red-50 text-red-600 border-red-200",
  }[color]

  const dot = {
    green: "bg-emerald-500",
    yellow: "bg-amber-400",
    red: "bg-red-500",
  }[color]

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-cream-200 bg-white px-4 py-3.5">
      <div className="flex items-center gap-3">
        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${dot}`} />
        <span className="font-body text-sm text-forest-800">{days}</span>
      </div>
      <span
        className={`shrink-0 text-xs font-body font-semibold px-3 py-1 rounded-full border ${badge}`}
      >
        {refund}
      </span>
    </div>
  )
}

function Example({ label, text }: { label: string; text: string }) {
  return (
    <div className="mt-4 rounded-xl bg-cream-100 border border-cream-200 px-4 py-3">
      <p className="font-body text-xs text-forest-500 leading-relaxed">
        <span className="font-semibold text-forest-700">{label}: </span>
        {text}
      </p>
    </div>
  )
}
