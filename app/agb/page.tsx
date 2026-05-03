import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "AGB – SARFI Collection",
  description:
    "Allgemeine Geschäftsbedingungen für Direktbuchungen bei SARFI Collection – Kurzzeitvermietung von Ferienwohnungen im Bayerischen Wald.",
}

export default function AgbPage() {
  return (
    <div className="min-h-screen bg-cream-50 pt-20">
      {/* Header */}
      <div className="bg-forest-900">
        <div className="container-site py-10">
          <h1 className="font-display text-display-md text-cream-50">
            Allgemeine Geschäftsbedingungen
          </h1>
          <p className="font-body text-cream-50/60 mt-2 text-sm">
            Gültig für alle Direktbuchungen über sarfi-collection.de
          </p>
        </div>
      </div>

      <div className="container-site py-12 max-w-2xl space-y-10">

        {/* § 1 Vertragsgegenstand */}
        <section>
          <h2 className="font-display text-xl text-forest-900 mb-3">
            § 1 Vertragsgegenstand
          </h2>
          <div className="font-body text-sm text-forest-700 leading-relaxed space-y-3">
            <p>
              Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für die
              Kurzzeitvermietung von Ferienwohnungen und -häusern über die
              Website sarfi-collection.de.
            </p>
            <p>
              Gegenstand des Vertrages ist die zeitlich begrenzte Überlassung
              einer Ferienunterkunft zur ausschließlich touristischen Nutzung.
              Eine Nutzung als dauerhafter Wohnsitz ist ausdrücklich
              ausgeschlossen.
            </p>
          </div>
        </section>

        {/* § 2 Vertragsparteien */}
        <section>
          <h2 className="font-display text-xl text-forest-900 mb-3">
            § 2 Vertragsparteien
          </h2>
          <div className="font-body text-sm text-forest-700 leading-relaxed space-y-3">
            <p>
              Vermieter und Vertragspartner ist:
            </p>
            <div className="rounded-xl border border-cream-200 bg-white px-5 py-4 font-body text-sm text-forest-800 leading-relaxed">
              Vincent Sarfi<br />
              Büchelstein 2<br />
              94541 Grattersdorf<br />
              Deutschland<br />
              E-Mail:{" "}
              <a
                href="mailto:hallo@sarfi-collection.de"
                className="underline hover:text-forest-900 transition-colors"
              >
                hallo@sarfi-collection.de
              </a>
            </div>
            <p>
              Der Gast ist die natürliche Person, die die Buchung vornimmt und
              als Hauptmieter für die Einhaltung dieser AGB verantwortlich ist.
            </p>
          </div>
        </section>

        {/* § 3 Vertragsschluss */}
        <section>
          <h2 className="font-display text-xl text-forest-900 mb-3">
            § 3 Vertragsschluss
          </h2>
          <div className="font-body text-sm text-forest-700 leading-relaxed space-y-3">
            <p>
              Der Mietvertrag kommt mit der schriftlichen Buchungsbestätigung
              des Vermieters (per E-Mail) zustande. Die Buchungsanfrage des
              Gastes stellt ein bindendes Angebot dar. Der Vermieter ist
              berechtigt, eine Buchungsanfrage ohne Angabe von Gründen
              abzulehnen.
            </p>
          </div>
        </section>

        {/* § 4 Preise & Zahlungsbedingungen */}
        <section>
          <h2 className="font-display text-xl text-forest-900 mb-3">
            § 4 Preise &amp; Zahlungsbedingungen
          </h2>
          <div className="font-body text-sm text-forest-700 leading-relaxed space-y-3">
            <p>
              Alle angegebenen Preise sind Endpreise und beinhalten die
              gesetzliche Mehrwertsteuer sowie alle anfallenden Nebenkosten,
              sofern nicht gesondert ausgewiesen.
            </p>
            <p>
              Die Zahlung erfolgt in zwei Raten:
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-3 rounded-xl border border-cream-200 bg-white px-4 py-3.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-forest-800">Anzahlung (50 %)</span>
                  <span className="text-forest-600"> – fällig unmittelbar nach Buchungsbestätigung</span>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-cream-200 bg-white px-4 py-3.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-forest-800">Restzahlung (50 %)</span>
                  <span className="text-forest-600"> – fällig spätestens 14 Tage vor dem Anreisedatum</span>
                </div>
              </div>
            </div>
            <p>
              Bei Buchungen, die weniger als 14 Tage vor der Anreise erfolgen,
              ist der Gesamtbetrag sofort in voller Höhe fällig.
            </p>
          </div>
        </section>

        {/* § 5 Stornierungsbedingungen */}
        <section id="stornierung" className="scroll-mt-24">
          <div className="rounded-2xl border-2 border-forest-200 bg-forest-50/40 p-6 space-y-6">
            <div>
              <h2 className="font-display text-xl text-forest-900 mb-1">
                § 5 Stornierungsbedingungen
              </h2>
              <p className="font-body text-xs text-forest-500">
                Hervorgehobener Abschnitt – bitte sorgfältig lesen
              </p>
            </div>

            <p className="font-body text-sm text-forest-600 leading-relaxed">
              Eine Stornierung muss schriftlich per E-Mail an{" "}
              <a
                href="mailto:hallo@sarfi-collection.de"
                className="underline hover:text-forest-900 transition-colors"
              >
                hallo@sarfi-collection.de
              </a>{" "}
              erfolgen. Maßgeblich ist das Datum des Eingangs der
              Stornierungsmitteilung.
            </p>

            {/* HAUS28 */}
            <div>
              <h3 className="font-display text-lg text-forest-900 mb-4">
                HAUS28
              </h3>
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
            </div>

            {/* Schönblick */}
            <div>
              <h3 className="font-display text-lg text-forest-900 mb-1">
                Haus Schönblick
              </h3>
              <p className="font-body text-xs text-forest-400 mb-4">
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
            </div>

            {/* General notes */}
            <div className="rounded-2xl border border-cream-200 bg-white p-5 space-y-3">
              <h3 className="font-display text-base text-forest-900">
                Allgemeine Hinweise zur Stornierung
              </h3>
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
            </div>
          </div>
        </section>

        {/* § 6 Hausregeln */}
        <section>
          <h2 className="font-display text-xl text-forest-900 mb-3">
            § 6 Hausregeln
          </h2>
          <div className="rounded-2xl border border-cream-200 bg-white p-6">
            <ul className="space-y-3 font-body text-sm text-forest-700 leading-relaxed list-none">
              {[
                { icon: "🕓", text: "Check-in ab 16:00 Uhr, Check-out bis 10:00 Uhr" },
                { icon: "🚭", text: "Rauchen innerhalb der Unterkunft ist nicht gestattet" },
                { icon: "🐾", text: "Haustiere nur nach vorheriger Absprache mit dem Vermieter erlaubt" },
                { icon: "🔇", text: "Die Hausordnung sowie die Ruhezeiten der jeweiligen Unterkunft sind einzuhalten" },
                { icon: "🧹", text: "Die Unterkunft ist in ordentlichem Zustand zu hinterlassen" },
              ].map(({ icon, text }) => (
                <li key={text} className="flex gap-3">
                  <span className="shrink-0">{icon}</span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* § 7 Haftungsausschluss */}
        <section>
          <h2 className="font-display text-xl text-forest-900 mb-3">
            § 7 Haftungsausschluss
          </h2>
          <div className="font-body text-sm text-forest-700 leading-relaxed space-y-3">
            <p>
              Der Vermieter haftet nicht für Schäden, die durch höhere Gewalt,
              unvorhersehbare Ereignisse oder Umstände entstehen, die außerhalb
              seines Einflussbereichs liegen (z. B. Unwetter, Stromausfälle,
              Bauarbeiten in der Umgebung).
            </p>
            <p>
              Der Gast haftet für alle schuldhaft verursachten Schäden an der
              Unterkunft, dem Inventar und dem Grundstück. Schäden sind dem
              Vermieter unverzüglich zu melden.
            </p>
            <p>
              Eine Haftung des Vermieters für Wertgegenstände, die in der
              Unterkunft zurückgelassen oder abhandengekommen sind, ist
              ausgeschlossen, sofern kein Vorsatz oder grobe Fahrlässigkeit
              vorliegt.
            </p>
          </div>
        </section>

        {/* § 8 Anwendbares Recht */}
        <section>
          <h2 className="font-display text-xl text-forest-900 mb-3">
            § 8 Anwendbares Recht &amp; Gerichtsstand
          </h2>
          <div className="font-body text-sm text-forest-700 leading-relaxed space-y-3">
            <p>
              Es gilt ausschließlich das Recht der Bundesrepublik Deutschland
              unter Ausschluss des UN-Kaufrechts (CISG).
            </p>
            <p>
              Für Streitigkeiten aus dem Mietverhältnis ist, sofern gesetzlich
              zulässig, der Sitz des Vermieters (Grattersdorf) als
              Gerichtsstand vereinbart.
            </p>
            <p>
              Wir sind nicht bereit oder verpflichtet, an
              Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </div>
        </section>

        {/* § 9 Salvatorische Klausel */}
        <section>
          <h2 className="font-display text-xl text-forest-900 mb-3">
            § 9 Salvatorische Klausel
          </h2>
          <p className="font-body text-sm text-forest-700 leading-relaxed">
            Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder
            werden, bleibt die Wirksamkeit der übrigen Bestimmungen
            unberührt. An die Stelle der unwirksamen Bestimmung tritt die
            gesetzlich zulässige Regelung, die dem wirtschaftlichen Zweck der
            unwirksamen Bestimmung am nächsten kommt.
          </p>
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

        <p className="text-xs text-forest-400 pt-4 border-t border-cream-200 font-body">
          Stand: Mai 2026
        </p>
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
