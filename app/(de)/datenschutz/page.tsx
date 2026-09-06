import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutzerklärung – SARFI Collection",
  robots: { index: false },
  alternates: {
    canonical: "https://www.sarfi-collection.de/datenschutz",
  },
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
              E-Mail: hallo@sarfi-collection.de<br />
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
            <h3 className="font-semibold text-forest-800 mb-2">Hosting in Deutschland (Sliplane / Hetzner)</h3>
            <p className="mb-3">
              Diese Website wird gehostet über die Hosting-Plattform Sliplane (Wimadev, Inhaber Lukas Mauser, Freienwalder Str. 3, 13359 Berlin, Deutschland). Die eingesetzten Server werden von der Hetzner Online GmbH (Industriestr. 25, 91710 Gunzenhausen, Deutschland) in einem Rechenzentrum in Deutschland betrieben. Die Verarbeitung findet damit ausschließlich innerhalb der Europäischen Union statt. Bei jedem Aufruf unserer Website erfasst das System automatisiert Daten und Informationen des aufrufenden Rechners. Folgende Daten werden hierbei erhoben:
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
              Der Hosting-Anbieter verarbeitet die Daten in unserem Auftrag auf Grundlage eines Vertrags über Auftragsverarbeitung gemäß Art. 28 DSGVO. Eine Übermittlung in Drittländer findet im Rahmen des Hostings nicht statt.
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
            <h3 className="font-semibold text-forest-800 mb-2">Keine Analyse-, Tracking- oder Marketing-Cookies</h3>
            <p>
              Wir setzen keine Analyse-, Tracking- oder Marketing-Cookies und keine Webanalyse-Dienste ein. Es kommen ausschließlich technisch notwendige Cookies bzw. vergleichbare Speichertechnologien (z.&nbsp;B. localStorage für den Buchungsvorgang) zum Einsatz, für die nach § 25 Abs. 2 TDDDG keine Einwilligung erforderlich ist. Aus diesem Grund verzichten wir auch auf ein Cookie-Banner.
            </p>
            <p className="mt-3">
              Erst wenn Sie im Buchungs- oder Gutscheinvorgang den Zahlungsschritt erreichen, wird das Zahlungsformular unseres Zahlungsdienstleisters Stripe geladen (siehe Abschnitt 7). Stripe setzt dabei eigene Cookies, die ausschließlich der Zahlungsabwicklung und Betrugsprävention dienen und damit für die von Ihnen ausdrücklich gewünschte Zahlung erforderlich sind (§ 25 Abs. 2 Nr. 2 TDDDG). Beim bloßen Besuch der Website werden keine Stripe-Skripte geladen.
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
              <li>Betreff und Nachrichteninhalt</li>
            </ul>
            <p className="mb-3">
              Beim Absenden wird zudem Ihre IP-Adresse kurzzeitig verarbeitet, um Missbrauch (z.&nbsp;B. massenhaftes Absenden) zu verhindern; sie wird nicht dauerhaft gespeichert und nicht mit der Nachricht verknüpft. Die Nachricht selbst wird uns per E-Mail zugestellt; Datum und Uhrzeit ergeben sich aus dem E-Mail-Eingang.
            </p>
            <p className="mb-3">
              Für die Verarbeitung der Daten wird im Rahmen des Absendevorgangs Ihre Einwilligung eingeholt und auf diese Datenschutzerklärung verwiesen. Alternativ ist eine Kontaktaufnahme über die bereitgestellte E-Mail-Adresse möglich. In diesem Fall werden die mit der E-Mail übermittelten personenbezogenen Daten des Nutzers gespeichert.
            </p>
            <p className="mb-3">
              Rechtsgrundlage für die Verarbeitung der Daten ist Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) sowie Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahmen). Die Daten werden gelöscht, sobald sie für die Erreichung des Zweckes ihrer Erhebung nicht mehr erforderlich sind, spätestens jedoch nach 3 Jahren.
            </p>

            <h3 className="font-semibold text-forest-800 mb-2">Bot-Schutz: Cloudflare Turnstile</h3>
            <p className="mb-3">
              Zum Schutz unseres Kontaktformulars, unserer Buchungsstrecke und der Newsletter-Anmeldung vor Missbrauch durch Bots setzen wir den Dienst Cloudflare Turnstile der Cloudflare, Inc., 101 Townsend St., San Francisco, CA 94107, USA ein. Turnstile prüft, ob Eingaben von einem Menschen stammen, und verarbeitet dazu technische Informationen (z. B. IP-Adresse, Browser-Merkmale, Interaktionsdaten). Das Turnstile-Skript wird erst geladen, wenn Sie mit dem jeweiligen Formular interagieren. Dabei kann eine Übertragung von Daten in die USA stattfinden; Cloudflare ist nach dem EU-US Data Privacy Framework zertifiziert (Art. 45 DSGVO), ergänzend gelten die EU-Standardvertragsklauseln. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse am Schutz unserer Website vor Spam, Missbrauch und automatisierten Angriffen). Weitere Informationen: <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer" className="text-gold-600 underline underline-offset-2">cloudflare.com/privacypolicy</a>
            </p>

            <h3 className="font-semibold text-forest-800 mb-2">E-Mail-Versand: Resend</h3>
            <p>
              Für den technischen Versand von E-Mails (Benachrichtigungen aus dem Kontaktformular, Buchungsbestätigungen, Zahlungserinnerungen und Gutschein-Mails nach Abschnitt 6 sowie den Newsletter nach Abschnitt 9) nutzen wir den Dienst Resend (Resend, Inc., 2261 Market Street #5039, San Francisco, CA 94114, USA). Dabei werden die zur Zustellung erforderlichen Daten – insbesondere Name, E-Mail-Adresse, Telefonnummer und Nachrichteninhalt – serverseitig an Resend übermittelt. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung) bzw. Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einem zuverlässigen E-Mail-Versand). Resend verarbeitet die Daten als Auftragsverarbeiter gemäß Art. 28 DSGVO. Eine Übermittlung in die USA wird durch den Abschluss der EU-Standardvertragsklauseln abgesichert. Weitere Informationen: <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-gold-600 underline underline-offset-2">resend.com/legal/privacy-policy</a>
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="font-display text-xl text-forest-900 mb-3">6. Direktbuchungssystem</h2>
            <p className="mb-3">
              Auf unserer Website betreiben wir ein eigenes Direktbuchungssystem. Im Rahmen des Buchungsvorgangs werden folgende personenbezogene Daten erhoben und verarbeitet:
            </p>
            <ul className="list-disc list-inside space-y-1 mb-3 ml-2">
              <li>Vor- und Nachname</li>
              <li>E-Mail-Adresse</li>
              <li>Telefonnummer</li>
              <li>Reisedaten (An- und Abreisedatum, Personenzahl, gewählte Unterkunft)</li>
              <li>optionale Nachricht (besondere Wünsche, Anreisezeit)</li>
              <li>gewählte Sprache der Website (für Bestätigungs- und Erinnerungsmails)</li>
              <li>Zahlungsinformationen (verarbeitet durch Stripe – siehe Abschnitt 7)</li>
            </ul>
            <p className="mb-3">
              Diese Daten verwenden wir zur Abwicklung der Buchung, für die Buchungsbestätigung, für Erinnerungen an eine offene Restzahlung sowie für die Kommunikation rund um Ihren Aufenthalt (z.&nbsp;B. Anreiseinformationen). Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung bzw. vorvertragliche Maßnahmen).
            </p>
            <p className="mb-3">
              Buchungs- und Zahlungsdaten bewahren wir nach Ende des Aufenthalts auf, solange gesetzliche Aufbewahrungspflichten bestehen (steuer- und handelsrechtlich in der Regel 8 bzw. 10 Jahre, § 147 AO, § 14b UStG) oder Ansprüche aus dem Vertrag geltend gemacht werden können (Art. 6 Abs. 1 lit. c und f DSGVO). Anschließend werden sie gelöscht.
            </p>

            <h3 className="font-semibold text-forest-800 mb-2">Melderechtliche Pflichten und Gästebeitrag</h3>
            <p className="mb-3">
              Gäste ohne deutsche Staatsangehörigkeit müssen bei der Anreise einen Meldeschein nach §§ 29, 30 Bundesmeldegesetz (BMG) ausfüllen und unterschreiben; wir sind verpflichtet, den Ausweis einzusehen. Meldescheine bewahren wir ein Jahr ab Abreise auf und vernichten sie danach innerhalb von drei Monaten (§ 30 Abs. 4 BMG). Soweit die Gemeinde einen Gästebeitrag (Kurtaxe) erhebt, übermitteln wir die dafür erforderlichen Angaben (Aufenthaltsdauer, Personenzahl) an die Gemeinde. Rechtsgrundlage ist jeweils Art. 6 Abs. 1 lit. c DSGVO.
            </p>
            <p className="mb-3">
              <strong>Digitaler Meldeschein:</strong> Anstelle des Papierformulars können Sie den Meldeschein über einen persönlichen Link (aus unserer Gästenachricht) oder den QR-Code in der Unterkunft online ausfüllen (§ 29 Abs. 5 BMG). Dabei erheben wir die im Meldeschein vorgeschriebenen Angaben (Name, Geburtsdatum, Staatsangehörigkeit, Anschrift, Art und Nummer des Ausweisdokuments, Mitreisende) sowie ein Foto der Datenseite Ihres Ausweisdokuments zum Abgleich der Angaben; aus der maschinenlesbaren Zone des Fotos lesen wir die Angaben automatisch aus (Texterkennung auf unserem eigenen Server, keine Übermittlung an Dritte), um das Formular vorauszufüllen. Die handschriftliche Unterschrift wird mit Ihrer Zustimmung durch eine Kartenprüfung mit starker Kundenauthentifizierung (3-D Secure) über unseren Zahlungsdienstleister Stripe ersetzt; es findet keine Abbuchung statt, und die Karte wird nach der Prüfung nicht gespeichert. Angaben und Ausweisfoto werden verschlüsselt auf unserem Verwaltungssystem (Sliplane/Hetzner, Deutschland) gespeichert und ein Jahr nach Ihrer Abreise automatisch gelöscht. Rechtsgrundlage ist Art. 6 Abs. 1 lit. c DSGVO (§§ 29, 30 BMG) sowie für das elektronische Verfahren Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO), die Sie jederzeit widerrufen können – dann füllen Sie das Papierformular aus.
            </p>

            <h3 className="font-semibold text-forest-800 mb-2">Geschenkgutscheine</h3>
            <p className="mb-3">
              Beim Kauf eines Gutscheins über unsere Website verarbeiten wir Ihre E-Mail-Adresse (Zustellung des Gutscheins und des Zahlungsbelegs), den gewählten Betrag sowie optional den Namen der beschenkten Person und eine persönliche Nachricht, die auf dem Gutschein abgedruckt werden. Diese Angaben werden zusammen mit dem Gutscheincode bei unserem Zahlungsdienstleister Stripe (Abschnitt 7) als Zahlungsvorgang gespeichert; ein gesondertes Gutscheinregister führen wir nicht. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO. Die Daten werden bis zum Ablauf der Gutscheingültigkeit und darüber hinaus für die Dauer der gesetzlichen Aufbewahrungsfristen gespeichert.
            </p>

            <h3 className="font-semibold text-forest-800 mb-2">Rechnungsanforderung und Zusatzleistungen (Late Checkout, Verlängerung)</h3>
            <p className="mb-3">
              Über die Seite /rechnung können Sie zu einer Buchung eine Rechnung anfordern. Dazu verarbeiten wir die von Ihnen eingegebenen Rechnungsdaten (Firma, Umsatzsteuer-Identifikationsnummer, Anschrift, E-Mail-Adresse) und stellen die Rechnung als PDF per E-Mail zu. Über die während des Aufenthalts bereitgestellte Seite /late-checkout können Sie einen späteren Check-out oder eine Verlängerung buchen; der Zugriff erfolgt über einen persönlichen Zugangscode Ihrer Buchung. Beide Funktionen werden von unserem eigenen Verwaltungssystem (dashboard.sarfi.group) bereitgestellt, das wie diese Website bei Sliplane auf Servern der Hetzner Online GmbH in Deutschland betrieben wird. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO; für Rechnungsdaten zusätzlich Art. 6 Abs. 1 lit. c DSGVO (§ 14 UStG).
            </p>

            <h3 className="font-semibold text-forest-800 mb-2">Channel-Management: Smoobu</h3>
            <p className="mb-3">
              Zur Verwaltung von Buchungen, Verfügbarkeiten und Gästedaten nutzen wir den Property-Management-Dienst der Smoobu GmbH, Ackerstraße 76, 13355 Berlin, Deutschland. Buchungsdaten werden serverseitig an die Smoobu-API übermittelt und dort verarbeitet. Eine direkte Verbindung zwischen Ihrem Browser und Smoobu-Servern findet dabei nicht statt.
            </p>
            <p className="mb-3">
              Rechtsgrundlage für die Übermittlung ist Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung). Smoobu verarbeitet die Daten als Auftragsverarbeiter gemäß Art. 28 DSGVO. Weitere Informationen zum Datenschutz bei Smoobu finden Sie unter: <a href="https://www.smoobu.com/de/datenschutz/" target="_blank" rel="noopener noreferrer" className="text-gold-600 underline underline-offset-2">smoobu.com/de/datenschutz</a>
            </p>

            <h3 className="font-semibold text-forest-800 mb-2">Dynamische Preisgestaltung: PriceLabs</h3>
            <p>
              Für die dynamische Berechnung von Übernachtungspreisen nutzen wir den Dienst PriceLabs (PriceLabs Inc., 200 W. Madison St., Chicago, IL 60606, USA). Dabei werden ausschließlich Unterkunfts-IDs und Datumsbereiche serverseitig übermittelt – keine personenbezogenen Daten der Buchenden. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an marktgerechter Preisgestaltung).
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="font-display text-xl text-forest-900 mb-3">7. Zahlungsabwicklung</h2>

            <h3 className="font-semibold text-forest-800 mb-2">Stripe</h3>
            <p className="mb-3">
              Die Zahlungsabwicklung auf unserer Website erfolgt über den Zahlungsdienstleister Stripe Payments Europe, Ltd., 1 Grand Canal Street Lower, Grand Canal Dock, Dublin, Irland (für Kunden in Europa). Stripe verarbeitet Ihre Zahlungsdaten (z. B. Kartennummer, Ablaufdatum, Prüfziffer) im Rahmen der Buchungsabwicklung.
            </p>
            <p className="mb-3">
              Im Rahmen des Zahlungsvorgangs werden folgende Daten an Stripe übermittelt:
            </p>
            <ul className="list-disc list-inside space-y-1 mb-3 ml-2">
              <li>Name und E-Mail-Adresse</li>
              <li>Zahlungsinformationen (Kartendaten oder Wallet-Daten)</li>
              <li>Buchungsbetrag und Währung</li>
              <li>IP-Adresse und Browser-Informationen</li>
              <li>bei Buchungen: Buchungskennung, Unterkunft und Reisezeitraum als Verwendungszweck</li>
            </ul>
            <p className="mb-3">
              Das Zahlungsformular wird als Stripe-Element direkt in unsere Seite eingebettet; bei Zusatzleistungen (Late Checkout, Verlängerung) werden Sie auf eine von Stripe gehostete Zahlungsseite weitergeleitet. Welche Zahlarten angeboten werden, hängt von Ihrem Gerät und Land ab; neben den nachfolgend beschriebenen Zahlarten können dies z.&nbsp;B. Amazon Pay, EPS, Bancontact, BLIK oder Stripe Link (Speicherung Ihrer Zahlungsdaten bei Stripe für spätere Zahlungen, nur auf Ihren ausdrücklichen Wunsch) sein. Die Schrift des Zahlungsformulars laden wir von unserem eigenen Server; es findet keine Verbindung zu Google Fonts statt.
            </p>
            <p className="mb-3">
              Rechtsgrundlage für die Datenübermittlung ist Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung) sowie Art. 6 Abs. 1 lit. f DSGVO (Betrugsprävention). Stripe verarbeitet Daten ggf. in den USA und ist nach dem EU-US Data Privacy Framework zertifiziert. Weitere Informationen finden Sie unter: <a href="https://stripe.com/de/privacy" target="_blank" rel="noopener noreferrer" className="text-gold-600 underline underline-offset-2">stripe.com/de/privacy</a>
            </p>

            <h3 className="font-semibold text-forest-800 mb-2">Apple Pay</h3>
            <p className="mb-3">
              Wir bieten die Zahlung per Apple Pay an (Apple Inc., One Apple Park Way, Cupertino, CA 95014, USA). Wenn Sie Apple Pay als Zahlungsmethode wählen, wird die Transaktion über Stripe abgewickelt. Apple überträgt dabei tokenisierte Zahlungsdaten, sodass keine vollständigen Kartendaten an uns oder Stripe weitergegeben werden. Apple verarbeitet Ihre Daten gemäß der Apple-Datenschutzrichtlinie: <a href="https://www.apple.com/de/privacy/" target="_blank" rel="noopener noreferrer" className="text-gold-600 underline underline-offset-2">apple.com/de/privacy</a>
            </p>
            <p className="mb-3">
              Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung).
            </p>

            <h3 className="font-semibold text-forest-800 mb-2">Google Pay</h3>
            <p className="mb-3">
              Wir bieten die Zahlung per Google Pay an (Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA). Wenn Sie Google Pay als Zahlungsmethode wählen, wird die Transaktion über Stripe abgewickelt. Google übermittelt dabei tokenisierte Zahlungsdaten. Google verarbeitet Ihre Daten gemäß der Google-Datenschutzrichtlinie: <a href="https://policies.google.com/privacy?hl=de" target="_blank" rel="noopener noreferrer" className="text-gold-600 underline underline-offset-2">policies.google.com/privacy</a>
            </p>
            <p className="mb-3">
              Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung).
            </p>

            <h3 className="font-semibold text-forest-800 mb-2">PayPal</h3>
            <p className="mb-3">
              Wir bieten die Zahlung per PayPal an (PayPal (Europe) S.à r.l. et Cie, S.C.A., 22-24 Boulevard Royal, L-2449 Luxemburg). Wenn Sie PayPal als Zahlungsmethode wählen, wird die Transaktion über Stripe abgewickelt; Sie werden dazu vorübergehend zu PayPal weitergeleitet und kehren nach Abschluss der Zahlung auf unsere Website zurück. PayPal verarbeitet Ihre Daten gemäß der PayPal-Datenschutzerklärung: <a href="https://www.paypal.com/de/legalhub/privacy-full" target="_blank" rel="noopener noreferrer" className="text-gold-600 underline underline-offset-2">paypal.com/de/legalhub/privacy-full</a>
            </p>
            <p className="mb-3">
              Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung).
            </p>

            <h3 className="font-semibold text-forest-800 mb-2">Klarna</h3>
            <p className="mb-3">
              Wir bieten die Zahlung per Klarna an (Klarna Bank AB (publ), Sveavägen 46, 111 34 Stockholm, Schweden). Wenn Sie Klarna als Zahlungsmethode wählen, wird die Transaktion über Stripe abgewickelt; Sie werden dazu vorübergehend zu Klarna weitergeleitet. Klarna kann zur Abwicklung der gewählten Zahlungsart (z. B. Sofortüberweisung oder Rechnungskauf) eigene Bonitäts- und Identitätsprüfungen durchführen und verarbeitet Ihre Daten gemäß der Klarna-Datenschutzerklärung: <a href="https://www.klarna.com/de/datenschutz/" target="_blank" rel="noopener noreferrer" className="text-gold-600 underline underline-offset-2">klarna.com/de/datenschutz</a>
            </p>
            <p>
              Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung).
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="font-display text-xl text-forest-900 mb-3">8. Kartendarstellung (OpenStreetMap)</h2>
            <p className="mb-3">
              Zur Darstellung von Lageplänen unserer Unterkünfte binden wir Kartenausschnitte des Dienstes OpenStreetMap ein, angeboten von der OpenStreetMap Foundation (St John's Innovation Centre, Cowley Road, Cambridge, CB4 0WS, Großbritannien).
            </p>
            <p className="mb-3">
              Beim Laden einer Karte wird eine Verbindung zu Servern der OpenStreetMap Foundation aufgebaut; dabei werden technisch bedingt Ihre IP-Adresse sowie übliche Verbindungsdaten übermittelt. Für Großbritannien liegt ein Angemessenheitsbeschluss der EU-Kommission vor (Art. 45 DSGVO). Die Nutzung erfolgt im Interesse einer ansprechenden Darstellung unserer Online-Angebote und einer leichten Auffindbarkeit der angegebenen Orte; dies stellt ein berechtigtes Interesse im Sinne von Art. 6 Abs. 1 lit. f DSGVO dar.
            </p>
            <p className="mb-3">
              Daneben verlinken wir für die Routenplanung auf Google Maps (Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland). Beim bloßen Besuch unserer Website werden keine Daten an Google übertragen — erst wenn Sie den Link aktiv anklicken, gelten die Datenschutzbestimmungen von Google: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-gold-600 underline underline-offset-2">policies.google.com/privacy</a>
            </p>
            <p className="mb-3">
              Gleiches gilt für unsere Links zu WhatsApp (WhatsApp Ireland Ltd.), Instagram (Meta Platforms Ireland Ltd.) und Airbnb (Airbnb Ireland UC): Es handelt sich um einfache Verlinkungen ohne eingebettete Inhalte oder Plugins. Daten werden erst übertragen, wenn Sie den jeweiligen Link anklicken und die Seite des Anbieters aufrufen.
            </p>
            <p>
              Mehr Informationen zum Umgang mit Nutzerdaten finden Sie in der Datenschutzerklärung der OpenStreetMap Foundation: <a href="https://wiki.osmfoundation.org/wiki/Privacy_Policy" target="_blank" rel="noopener noreferrer" className="text-gold-600 underline underline-offset-2">wiki.osmfoundation.org/wiki/Privacy_Policy</a>
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="font-display text-xl text-forest-900 mb-3">9. Newsletter</h2>
            <p className="mb-3">
              Sie können sich auf unserer Website für unseren Newsletter anmelden. Dazu verarbeiten wir Ihre E-Mail-Adresse sowie den Zeitpunkt der Anmeldung und der Bestätigung. Die Anmeldung erfolgt im Double-Opt-in-Verfahren: Nach Eingabe Ihrer Adresse erhalten Sie eine E-Mail mit einem Bestätigungslink; erst mit Klick auf diesen Link wird Ihre Adresse in unsere Empfängerliste aufgenommen. Ohne Bestätigung wird die Adresse nicht gespeichert. Beim Absenden wird Ihre IP-Adresse kurzzeitig zur Missbrauchsabwehr verarbeitet (siehe Bot-Schutz in Abschnitt 5).
            </p>
            <p className="mb-3">
              Rechtsgrundlage ist Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO, § 7 Abs. 2 Nr. 2 UWG). Sie können den Newsletter jederzeit abbestellen – über den Abmeldelink in jeder Newsletter-E-Mail oder per E-Mail an hallo@sarfi-collection.de. Mit der Abmeldung wird Ihre Adresse aus der Empfängerliste entfernt; die Rechtmäßigkeit der bis dahin erfolgten Verarbeitung bleibt unberührt.
            </p>
            <p>
              Die Empfängerliste wird bei unserem E-Mail-Dienstleister Resend geführt, der den Newsletter in unserem Auftrag versendet (Auftragsverarbeitung nach Art. 28 DSGVO, siehe Abschnitt 5). Eine Auswertung des Öffnungs- oder Klickverhaltens findet nicht statt.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="font-display text-xl text-forest-900 mb-3">10. SSL- bzw. TLS-Verschlüsselung</h2>
            <p>
              Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte, wie zum Beispiel Buchungsanfragen oder Anfragen, die Sie an uns als Seitenbetreiber senden, eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von „http://" auf „https://" wechselt und an dem Schloss-Symbol in Ihrer Browserzeile. Wenn die SSL- bzw. TLS-Verschlüsselung aktiviert ist, können die Daten, die Sie an uns übermitteln, nicht von Dritten mitgelesen werden.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="font-display text-xl text-forest-900 mb-3">11. Rechte der betroffenen Person</h2>
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

          {/* 12 */}
          <section>
            <h2 className="font-display text-xl text-forest-900 mb-3">12. Aktualität und Änderung dieser Datenschutzerklärung</h2>
            <p>
              Diese Datenschutzerklärung ist aktuell gültig und hat den Stand September 2026. Durch die Weiterentwicklung unserer Website und Angebote oder aufgrund geänderter gesetzlicher beziehungsweise behördlicher Vorgaben kann es notwendig werden, diese Datenschutzerklärung zu ändern. Die jeweils aktuelle Datenschutzerklärung kann jederzeit auf der Website unter <strong>www.sarfi-collection.de/datenschutz</strong> von Ihnen abgerufen und ausgedruckt werden.
            </p>
          </section>

          <p className="text-xs text-forest-400 pt-4 border-t border-cream-200">
            Stand: September 2026
          </p>

        </div>
      </div>
    </div>
  );
}
