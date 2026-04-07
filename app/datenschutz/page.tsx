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
        <div className="space-y-8 font-body text-sm text-forest-700 leading-relaxed">

          {/* 1 */}
          <section>
            <h2 className="font-display text-xl text-forest-900 mb-3">1. Verantwortlicher</h2>
            <p>
              Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:<br /><br />
              Vincent Sarfi<br />
              Büchelstein 2<br />
              94541 Grattersdorf<br />
              Deutschland<br /><br />
              Telefon: +49 176 56850146<br />
              E-Mail: 28imwald@gmail.com<br />
              Website: www.sarfi-collection.de
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="font-display text-xl text-forest-900 mb-3">2. Allgemeines zur Datenverarbeitung</h2>
            <h3 className="font-semibold text-forest-800 mb-2">Umfang der Verarbeitung personenbezogener Daten</h3>
            <p className="mb-3">
              Wir verarbeiten personenbezogene Daten unserer Nutzer grundsätzlich nur, soweit dies zur Bereitstellung einer funktionsfähigen Website sowie unserer Inhalte und Leistungen erforderlich ist. Die Verarbeitung personenbezogener Daten erfolgt regelmäßig nur nach Einwilligung des Nutzers. Eine Ausnahme gilt in solchen Fällen, in denen eine vorherige Einholung einer Einwilligung aus tatsächlichen Gründen nicht möglich ist und die Verarbeitung der Daten durch gesetzliche Vorschriften gestattet ist.
            </p>
            <h3 className="font-semibold text-forest-800 mb-2">Rechtsgrundlage für die Verarbeitung personenbezogener Daten</h3>
            <p className="mb-3">
              Soweit wir für Verarbeitungsvorgänge personenbezogener Daten eine Einwilligung der betroffenen Person einholen, dient Art. 6 Abs. 1 lit. a DSGVO als Rechtsgrundlage.<br /><br />
              Bei der Verarbeitung von personenbezogenen Daten, die zur Erfüllung eines Vertrages, dessen Vertragspartei die betroffene Person ist, erforderlich ist, dient Art. 6 Abs. 1 lit. b DSGVO als Rechtsgrundlage.<br /><br />
              Soweit eine Verarbeitung personenbezogener Daten zur Erfüllung einer rechtlichen Verpflichtung erforderlich ist, der unser Unternehmen unterliegt, dient Art. 6 Abs. 1 lit. c DSGVO als Rechtsgrundlage.<br /><br />
              Ist die Verarbeitung zur Wahrung eines berechtigten Interesses unseres Unternehmens oder eines Dritten erforderlich und überwiegen die Interessen, Grundrechte und Grundfreiheiten des Betroffenen das erstgenannte Interesse nicht, so dient Art. 6 Abs. 1 lit. f DSGVO als Rechtsgrundlage.
            </p>
            <h3 className="font-semibold text-forest-800 mb-2">Datenlöschung und Speicherdauer</h3>
            <p>
              Die personenbezogenen Daten der betroffenen Person werden gelöscht oder gesperrt, sobald der Zweck der Speicherung entfällt. Eine Speicherung kann darüber hinaus erfolgen, wenn dies durch den europäischen oder nationalen Gesetzgeber in unionsrechtlichen Verordnungen, Gesetzen oder sonstigen Vorschriften, denen der Verantwortliche unterliegt, vorgesehen wurde. Eine Sperrung oder Löschung der Daten erfolgt auch dann, wenn eine durch die genannten Normen vorgeschriebene Speicherfrist abläuft, es sei denn, dass eine Erforderlichkeit zur weiteren Speicherung der Daten für einen Vertragsabschluss oder eine Vertragserfüllung besteht.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="font-display text-xl text-forest-900 mb-3">3. Bereitstellung der Website und Erstellung von Logfiles</h2>
            <h3 className="font-semibold text-forest-800 mb-2">Hosting durch Vercel</h3>
            <p className="mb-3">
              Diese Website wird gehostet von Vercel Inc., 340 Pine Street, Suite 900, San Francisco, CA 94104, USA. Bei jedem Aufruf unserer Website erfasst das System automatisiert Daten und Informationen des aufrufenden Rechners. Folgende Daten werden hierbei erhoben:
            </p>
            <ul className="list-disc list-inside space-y-1 mb-3 ml-2">
              <li>IP-Adresse des Nutzers (anonymisiert)</li>
              <li>Datum und Uhrzeit des Zugriffs</li>
              <li>Website, von der das System des Nutzers auf unsere Website gelangt (Referrer)</li>
              <li>Websites, die vom System des Nutzers über unsere Website aufgerufen werden</li>
              <li>Browsertyp und -version sowie Betriebssystem</li>
            </ul>
            <p className="mb-3">
              Die Daten werden in Logfiles gespeichert. Eine Zusammenführung dieser Daten mit anderen personenbezogenen Daten des Nutzers findet nicht statt. Rechtsgrundlage für die vorübergehende Speicherung der Daten und der Logfiles ist Art. 6 Abs. 1 lit. f DSGVO. Die Daten werden gelöscht, sobald sie für die Erreichung des Zweckes ihrer Erhebung nicht mehr erforderlich sind.
            </p>
            <p>
              Vercel verarbeitet Ihre Daten ggf. in den USA. Vercel ist nach dem EU-US Data Privacy Framework zertifiziert. Weitere Informationen finden Sie unter: <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-gold-600 underline underline-offset-2">vercel.com/legal/privacy-policy</a>
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="font-display text-xl text-forest-900 mb-3">4. Cookies</h2>
            <p className="mb-3">
              Unsere Website verwendet Cookies. Bei Cookies handelt es sich um Textdateien, die im Internetbrowser bzw. vom Internetbrowser auf dem Computersystem des Nutzers gespeichert werden. Ruft ein Nutzer eine Website auf, so kann ein Cookie auf dem Betriebssystem des Nutzers gespeichert werden. Dieser Cookie enthält eine charakteristische Zeichenfolge, die eine eindeutige Identifizierung des Browsers beim erneuten Aufrufen der Website ermöglicht.
            </p>
            <h3 className="font-semibold text-forest-800 mb-2">Technisch notwendige Cookies</h3>
            <p className="mb-3">
              Wir setzen technisch notwendige Cookies ein, um unsere Website nutzerfreundlich zu gestalten. Einige Elemente unserer Internetseite erfordern es, dass der aufrufende Browser auch nach einem Seitenwechsel identifiziert werden kann. Rechtsgrundlage für die Verarbeitung personenbezogener Daten unter Verwendung technisch notwendiger Cookies ist Art. 6 Abs. 1 lit. f DSGVO.
            </p>
            <h3 className="font-semibold text-forest-800 mb-2">Cookie-Einwilligung</h3>
            <p>
              Beim ersten Besuch unserer Website wird Ihre Einwilligung zur Verwendung von Cookies über ein Cookie-Banner eingeholt. Ihre Einwilligung können Sie jederzeit mit Wirkung für die Zukunft widerrufen, indem Sie die Cookie-Einstellungen in Ihrem Browser anpassen oder uns kontaktieren.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="font-display text-xl text-forest-900 mb-3">5. Kontaktformular und E-Mail-Kontakt</h2>
            <p className="mb-3">
              Auf unserer Internetseite ist ein Kontaktformular vorhanden, welches für die elektronische Kontaktaufnahme genutzt werden kann. Nimmt ein Nutzer diese Möglichkeit wahr, so werden die in der Eingabemaske eingegeben Daten an uns übermittelt und gespeichert. Diese Daten sind:
            </p>
            <ul className="list-disc list-inside space-y-1 mb-3 ml-2">
              <li>Name</li>
              <li>E-Mail-Adresse</li>
              <li>Telefonnummer (optional)</li>
              <li>Nachrichteninhalt</li>
            </ul>
            <p className="mb-3">
              Im Zeitpunkt der Absendung der Nachricht werden zudem folgende Daten gespeichert: IP-Adresse des Nutzers sowie Datum und Uhrzeit der Kontaktaufnahme.
            </p>
            <p className="mb-3">
              Für die Verarbeitung der Daten wird im Rahmen des Absendevorgangs Ihre Einwilligung eingeholt und auf diese Datenschutzerklärung verwiesen. Alternativ ist eine Kontaktaufnahme über die bereitgestellte E-Mail-Adresse möglich. In diesem Fall werden die mit der E-Mail übermittelten personenbezogenen Daten des Nutzers gespeichert.
            </p>
            <p>
              Rechtsgrundlage für die Verarbeitung der Daten ist Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) sowie Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahmen). Die Daten werden gelöscht, sobald sie für die Erreichung des Zweckes ihrer Erhebung nicht mehr erforderlich sind, spätestens jedoch nach 3 Jahren.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="font-display text-xl text-forest-900 mb-3">6. Buchungssystem Smoobu</h2>
            <p className="mb-3">
              Für die Abwicklung von Buchungsanfragen nutzen wir das Buchungssystem der Smoobu GmbH, Ackerstraße 76, 13355 Berlin, Deutschland (smoobu.com). Das Buchungswidget wird als eingebettetes iFrame auf unserer Website dargestellt.
            </p>
            <p className="mb-3">
              Im Rahmen des Buchungsvorgangs werden folgende Daten direkt an Smoobu übermittelt und dort verarbeitet:
            </p>
            <ul className="list-disc list-inside space-y-1 mb-3 ml-2">
              <li>Name und Kontaktdaten der buchenden Person</li>
              <li>Reisedaten (An- und Abreisedatum, Anzahl Personen)</li>
              <li>Zahlungsinformationen (verarbeitet durch Smoobu bzw. deren Zahlungsdienstleister)</li>
            </ul>
            <p className="mb-3">
              Rechtsgrundlage für die Verarbeitung ist Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung). Weitere Informationen zum Datenschutz von Smoobu finden Sie unter: <a href="https://www.smoobu.com/de/datenschutz/" target="_blank" rel="noopener noreferrer" className="text-gold-600 underline underline-offset-2">smoobu.com/de/datenschutz</a>
            </p>
            <p>
              Beim Laden des Buchungswidgets kann eine Verbindung zu Smoobu-Servern hergestellt werden, wobei Ihre IP-Adresse übermittelt wird. Dies erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Bereitstellung einer funktionsfähigen Buchungsmöglichkeit).
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="font-display text-xl text-forest-900 mb-3">7. Google Maps</h2>
            <p className="mb-3">
              Auf dieser Website nutzen wir den Kartendienst Google Maps der Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland. Die Nutzung von Google Maps ist für die Darstellung von Lageplänen unserer Unterkünfte notwendig.
            </p>
            <p className="mb-3">
              Zur Nutzung der Funktionen von Google Maps ist es notwendig, Ihre IP-Adresse zu speichern. Diese Informationen werden in der Regel an einen Server von Google in den USA übertragen und dort gespeichert. Google ist nach dem EU-US Data Privacy Framework zertifiziert.
            </p>
            <p className="mb-3">
              Die Nutzung von Google Maps erfolgt im Interesse einer ansprechenden Darstellung unserer Online-Angebote und an einer leichten Auffindbarkeit der von uns auf der Website angegebenen Orte. Dies stellt ein berechtigtes Interesse im Sinne von Art. 6 Abs. 1 lit. f DSGVO dar. Sofern eine entsprechende Einwilligung abgefragt wurde, erfolgt die Verarbeitung ausschließlich auf Grundlage von Art. 6 Abs. 1 lit. a DSGVO.
            </p>
            <p>
              Mehr Informationen zum Umgang mit Nutzerdaten finden Sie in der Datenschutzerklärung von Google: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-gold-600 underline underline-offset-2">policies.google.com/privacy</a>
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="font-display text-xl text-forest-900 mb-3">8. SSL- bzw. TLS-Verschlüsselung</h2>
            <p>
              Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte, wie zum Beispiel Buchungsanfragen oder Anfragen, die Sie an uns als Seitenbetreiber senden, eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von „http://" auf „https://" wechselt und an dem Schloss-Symbol in Ihrer Browserzeile. Wenn die SSL- bzw. TLS-Verschlüsselung aktiviert ist, können die Daten, die Sie an uns übermitteln, nicht von Dritten mitgelesen werden.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="font-display text-xl text-forest-900 mb-3">9. Rechte der betroffenen Person</h2>
            <p className="mb-3">Werden personenbezogene Daten von Ihnen verarbeitet, sind Sie Betroffener i. S. d. DSGVO und es stehen Ihnen folgende Rechte gegenüber dem Verantwortlichen zu:</p>

            <h3 className="font-semibold text-forest-800 mb-1">Auskunftsrecht (Art. 15 DSGVO)</h3>
            <p className="mb-3">Sie haben das Recht, eine Bestätigung darüber zu verlangen, ob Sie betreffende personenbezogene Daten verarbeitet werden.</p>

            <h3 className="font-semibold text-forest-800 mb-1">Recht auf Berichtigung (Art. 16 DSGVO)</h3>
            <p className="mb-3">Sie haben das Recht, unverzüglich die Berichtigung unrichtiger personenbezogener Daten bzw. die Vervollständigung unvollständiger Daten zu verlangen.</p>

            <h3 className="font-semibold text-forest-800 mb-1">Recht auf Löschung (Art. 17 DSGVO)</h3>
            <p className="mb-3">Sie haben das Recht, die unverzügliche Löschung der Sie betreffenden personenbezogenen Daten zu verlangen, sofern die gesetzlichen Voraussetzungen hierfür vorliegen.</p>

            <h3 className="font-semibold text-forest-800 mb-1">Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</h3>
            <p className="mb-3">Sie haben das Recht, die Einschränkung der Verarbeitung der Sie betreffenden personenbezogenen Daten zu verlangen.</p>

            <h3 className="font-semibold text-forest-800 mb-1">Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</h3>
            <p className="mb-3">Sie haben das Recht, die Sie betreffenden personenbezogenen Daten, die Sie uns bereitgestellt haben, in einem strukturierten, gängigen und maschinenlesbaren Format zu erhalten.</p>

            <h3 className="font-semibold text-forest-800 mb-1">Widerspruchsrecht (Art. 21 DSGVO)</h3>
            <p className="mb-3">Sie haben das Recht, aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit gegen die Verarbeitung der Sie betreffenden personenbezogenen Daten, die aufgrund von Art. 6 Abs. 1 lit. f DSGVO erfolgt, Widerspruch einzulegen.</p>

            <h3 className="font-semibold text-forest-800 mb-1">Recht auf Widerruf der datenschutzrechtlichen Einwilligungserklärung</h3>
            <p className="mb-3">Sie haben das Recht, Ihre datenschutzrechtliche Einwilligungserklärung jederzeit zu widerrufen. Durch den Widerruf der Einwilligung wird die Rechtmäßigkeit der aufgrund der Einwilligung bis zum Widerruf erfolgten Verarbeitung nicht berührt.</p>

            <h3 className="font-semibold text-forest-800 mb-1">Beschwerderecht bei einer Aufsichtsbehörde</h3>
            <p>
              Unbeschadet eines anderweitigen verwaltungsrechtlichen oder gerichtlichen Rechtsbehelfs steht Ihnen das Recht auf Beschwerde bei einer Aufsichtsbehörde zu. Die zuständige Aufsichtsbehörde für Bayern ist:<br /><br />
              Bayerisches Landesamt für Datenschutzaufsicht (BayLDA)<br />
              Promenade 18<br />
              91522 Ansbach<br />
              <a href="https://www.lda.bayern.de" target="_blank" rel="noopener noreferrer" className="text-gold-600 underline underline-offset-2">www.lda.bayern.de</a>
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="font-display text-xl text-forest-900 mb-3">10. Aktualität und Änderung dieser Datenschutzerklärung</h2>
            <p>
              Diese Datenschutzerklärung ist aktuell gültig und hat den Stand April 2025. Durch die Weiterentwicklung unserer Website und Angebote oder aufgrund geänderter gesetzlicher beziehungsweise behördlicher Vorgaben kann es notwendig werden, diese Datenschutzerklärung zu ändern. Die jeweils aktuelle Datenschutzerklärung kann jederzeit auf der Website unter <strong>www.sarfi-collection.de/datenschutz</strong> von Ihnen abgerufen und ausgedruckt werden.
            </p>
          </section>

          <p className="text-xs text-forest-400 pt-4 border-t border-cream-200">
            Stand: April 2025
          </p>

        </div>
      </div>
    </div>
  );
}
