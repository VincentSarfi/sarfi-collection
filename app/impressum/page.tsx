import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum – SARFI Collection",
  robots: { index: false },
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
              Angaben gemäß § 5 TMG
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
              E-Mail: 28imwald@gmail.com
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-forest-900 mb-3">
              Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
            </h2>
            <p>
              Vincent Sarfi<br />
              Büchelstein 2<br />
              94541 Grattersdorf
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-forest-900 mb-3">Haftungsausschluss</h2>
            <h3 className="font-body font-semibold text-forest-800 mb-2">Haftung für Inhalte</h3>
            <p className="text-sm leading-relaxed">
              Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
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
