import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum – SARFI Collection",
  robots: { index: false },
  alternates: {
    canonical: "https://www.sarfi-collection.de/impressum",
  },
};

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-cream-50 pt-20">
      <div className="bg-forest-900">
        <div className="container-site py-10">
          <h1 className="font-display text-display-md text-cream-50">Impressum</h1>
        </div>
      </div>

      <div className="container-site py-12 max-w-2xl">
        <div className="prose prose-sm max-w-none font-body text-forest-700 space-y-6">

          <section>
            <h2 className="font-display text-xl text-forest-900 mb-3">
              Angaben gemäß § 5 DDG
            </h2>
            <p>
              Vincent Sarfi<br />
              Büchelstein 2<br />
              94541 Grattersdorf<br />
              Deutschland
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-forest-900 mb-3">Kontakt</h2>
            <p>
              Telefon: +49 176 56850146<br />
              E-Mail: hallo@sarfi-collection.de
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-forest-900 mb-3">
              Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
            </h2>
            <p>
              Vincent Sarfi<br />
              Büchelstein 2<br />
              94541 Grattersdorf
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-forest-900 mb-3">
              Verbraucherstreitbeilegung
            </h2>
            <p className="text-sm leading-relaxed">
              Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen (§ 36 VSBG). Die frühere Online-Streitbeilegungsplattform der EU-Kommission wurde zum 20. Juli 2025 eingestellt.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-forest-900 mb-3">Haftungsausschluss</h2>
            <h3 className="font-body font-semibold text-forest-800 mb-2">Haftung für Inhalte</h3>
            <p className="text-sm leading-relaxed">
              Als Diensteanbieter sind wir für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Für fremde Informationen gelten die Haftungsprivilegien der Art. 4 bis 6 der Verordnung (EU) 2022/2065 (Digital Services Act); eine allgemeine Pflicht zur Überwachung übermittelter oder gespeicherter fremder Informationen besteht nach Art. 8 dieser Verordnung nicht. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt.
            </p>
            <h3 className="font-body font-semibold text-forest-800 mb-2 mt-4">Haftung für Links</h3>
            <p className="text-sm leading-relaxed">
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-forest-900 mb-3">Urheberrecht</h2>
            <p className="text-sm leading-relaxed">
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
            </p>
          </section>

          <p className="text-xs text-forest-400 pt-4 border-t border-cream-200">
            Stand: {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}
