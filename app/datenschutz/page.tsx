import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutzerklärung – SARFI Collection",
  robots: { index: false },
};

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-cream-50 pt-20">
      <div className="bg-forest-900">
        <div className="container-site py-10">
          <h1 className="font-display text-display-md text-cream-50">Datenschutzerklärung</h1>
        </div>
      </div>

      <div className="container-site py-12 max-w-2xl">
        {/* TODO: Diese Datenschutzerklärung ist ein Platzhalter und MUSS von einem Anwalt geprüft werden. */}
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200">
          <p className="font-body text-sm text-amber-800">
            ⚠️ <strong>Hinweis:</strong> Diese Datenschutzerklärung ist ein Platzhalter und muss vor dem Go-Live von einem auf Datenschutzrecht spezialisierten Anwalt geprüft und angepasst werden.
          </p>
        </div>

        <div className="space-y-8 font-body text-forest-700">

          <section>
            <h2 className="font-display text-xl text-forest-900 mb-3">1. Datenschutz auf einen Blick</h2>
            <h3 className="font-semibold text-forest-800 mb-2">Allgemeine Hinweise</h3>
            <p className="text-sm leading-relaxed">
              Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-forest-900 mb-3">2. Verantwortliche Stelle</h2>
            <p className="text-sm leading-relaxed">
              Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:<br /><br />
              [TODO: Name und vollständige Adresse des Verantwortlichen eintragen – identisch mit Impressum]<br /><br />
              E-Mail: [TODO: E-Mail-Adresse]
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-forest-900 mb-3">3. Datenerfassung auf dieser Website</h2>
            <h3 className="font-semibold text-forest-800 mb-2">Cookies</h3>
            <p className="text-sm leading-relaxed">
              Diese Website verwendet Cookies. Cookies sind kleine Textdateien, die auf Ihrem Endgerät gespeichert werden. Wir verwenden ausschließlich technisch notwendige Cookies sowie – nach Ihrer Einwilligung – Cookies zu Analysezwecken.
            </p>
            <h3 className="font-semibold text-forest-800 mb-2 mt-4">Kontaktformular</h3>
            <p className="text-sm leading-relaxed">
              Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert.
            </p>
            <h3 className="font-semibold text-forest-800 mb-2 mt-4">Drittanbieter: Smoobu</h3>
            <p className="text-sm leading-relaxed">
              Für die Buchungsabwicklung nutzen wir Smoobu (smoobu.com). Beim Buchungsvorgang werden die von Ihnen eingegebenen Daten direkt an Smoobu übertragen. Es gelten die Datenschutzbestimmungen von Smoobu.
            </p>
            <h3 className="font-semibold text-forest-800 mb-2 mt-4">Google Maps</h3>
            <p className="text-sm leading-relaxed">
              Diese Website nutzt Google Maps zur Darstellung von Karten. Anbieter ist die Google Ireland Limited. Bei Nutzung von Google Maps können Daten an Google-Server übertragen werden. Es gelten die Datenschutzbestimmungen von Google.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-forest-900 mb-3">4. Ihre Rechte</h2>
            <p className="text-sm leading-relaxed mb-3">
              Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem das Recht, die Berichtigung oder Löschung dieser Daten zu verlangen.
            </p>
            <p className="text-sm leading-relaxed">
              Wenn Sie Fragen zum Datenschutz haben, wenden Sie sich bitte an: [TODO: E-Mail-Adresse]
            </p>
          </section>

          <p className="text-xs text-forest-400 pt-4 border-t border-cream-200">
            Stand: {new Date().getFullYear()} · TODO: Diese Datenschutzerklärung muss vor Aktivierung der Website von einem Anwalt geprüft werden.
          </p>
        </div>
      </div>
    </div>
  );
}
