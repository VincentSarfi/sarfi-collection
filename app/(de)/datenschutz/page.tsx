import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
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
              Die Daten werden in Logfiles gespeichert. Eine Zusammenführung dieser Daten mit anderen personenbezogenen Daten des Nutzers findet nicht statt. Rechtsgrundlage für die vorübergehende Speicherung der Daten und der Logfiles ist Art. 6 Abs. 1 lit. f DSGVO. Die Daten werden gelöscht, sobald sie für die Erreichung des Zweckes ihrer Erhebung nicht mehr erforderlich sind. Die Protokolle unserer Anwendung enthalten grundsätzlich keine Namen oder E-Mail-Adressen von Gästen. Sliplane bewahrt sie höchstens sieben Tage auf (bis zu 15.000 Zeilen je Dienst); danach werden sie automatisch gelöscht.
            </p>
            <p className="mb-3">
              Der Hosting-Anbieter verarbeitet die Daten in unserem Auftrag auf Grundlage eines Vertrags über Auftragsverarbeitung gemäß Art. 28 DSGVO. Eine Übermittlung in Drittländer findet im Rahmen des Hostings nicht statt.
            </p>
            <h3 className="font-semibold text-forest-800 mb-2">Sicherungskopien (Backblaze)</h3>
            <p>
              Unser Verwaltungssystem (dashboard.sarfi.group), über das wir Buchungen, Rechnungen und Meldescheine bearbeiten, sichern wir nächtlich beim Speicherdienst Backblaze B2 der Backblaze, Inc. (San Mateo, USA), die als Auftragsverarbeiter gemäß Art. 28 DSGVO für uns tätig ist. Die Sicherungskopien werden auf unserem Server verschlüsselt, bevor sie übertragen werden; Backblaze erhält keinen Schlüssel und kann die Inhalte nicht lesen. Soweit Daten dabei in die USA gelangen, stützen wir die Übermittlung auf die EU-Standardvertragsklauseln (Art. 46 Abs. 2 lit. c DSGVO). Die Sicherungskopien dienen nur der Wiederherstellung nach einem Ausfall und werden turnusmäßig überschrieben, spätestens nach rund zwei Jahren. Rechtsgrundlage ist unser berechtigtes Interesse, Daten vor Verlust zu schützen (Art. 6 Abs. 1 lit. f, Art. 32 DSGVO).
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="font-display text-xl text-forest-900 mb-3">4. Cookies und Speicher im Browser</h2>
            <p className="mb-3">
              Wir selbst setzen auf dieser Website keine Cookies. Analyse-, Tracking- oder Marketing-Cookies und Webanalyse-Dienste setzen wir ebenfalls nicht ein. Aus diesem Grund verzichten wir auf ein Cookie-Banner.
            </p>
            <h3 className="font-semibold text-forest-800 mb-2">Speicher im Browser beim digitalen Meldeschein</h3>
            <p className="mb-3">
              Nur der digitale Meldeschein (Abschnitt 6) legt Daten in Ihrem Browser ab: im lokalen Speicher (localStorage) die Zufallskennung je weiterer Person und den Vermerk, auf welchem Gerät der erste Meldeschein begonnen wurde, und im Sitzungsspeicher (sessionStorage) den Link zum digitalen Meldeschein. Das ist für den von Ihnen gewünschten Dienst technisch erforderlich; eine Einwilligung ist dafür nach § 25 Abs. 2 Nr. 2 TDDDG nicht nötig.
            </p>
            <h3 className="font-semibold text-forest-800 mb-2">Cookies und Skripte von Dienstleistern</h3>
            <p>
              Erst wenn Sie im Buchungs- oder Gutscheinvorgang den Zahlungsschritt oder beim digitalen Meldeschein den Bestätigungsschritt erreichen, wird das Formular unseres Zahlungsdienstleisters Stripe geladen (siehe Abschnitt 7). Stripe setzt dabei eigene Cookies, die ausschließlich der Abwicklung und Betrugsprävention dienen und damit für den von Ihnen ausdrücklich gewünschten Vorgang erforderlich sind (§ 25 Abs. 2 Nr. 2 TDDDG). Beim bloßen Besuch der Website werden keine Stripe-Skripte geladen. Ebenso wird der Bot-Schutz Cloudflare Turnstile (Abschnitt 5) erst geladen, wenn Sie ein Formular nutzen; er liest dabei technische Merkmale Ihres Browsers aus, um Missbrauch des von Ihnen genutzten Formulars zu verhindern (§ 25 Abs. 2 Nr. 2 TDDDG).
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
              Zum Schutz unseres Kontaktformulars, unserer Buchungsstrecke, des Gutscheinkaufs und der Newsletter-Anmeldung vor Missbrauch durch Bots setzen wir den Dienst Cloudflare Turnstile der Cloudflare, Inc., 101 Townsend St., San Francisco, CA 94107, USA ein. Turnstile prüft, ob Eingaben von einem Menschen stammen, und verarbeitet dazu technische Informationen (z. B. IP-Adresse, Browser-Merkmale, Interaktionsdaten). Das Turnstile-Skript wird erst geladen, wenn Sie mit dem jeweiligen Formular interagieren. Dabei kann eine Übertragung von Daten in die USA stattfinden; Cloudflare ist nach dem EU-US Data Privacy Framework zertifiziert (Art. 45 DSGVO), ergänzend gelten die EU-Standardvertragsklauseln. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse am Schutz unserer Website vor Spam, Missbrauch und automatisierten Angriffen). Weitere Informationen: <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer" className="text-gold-600 underline underline-offset-2">cloudflare.com/privacypolicy</a>
            </p>

            <h3 className="font-semibold text-forest-800 mb-2">E-Mail-Versand: Resend</h3>
            <p className="mb-3">
              Für den technischen Versand von E-Mails nutzen wir den Dienst Resend (Resend, Inc., 2261 Market Street #5039, San Francisco, CA 94114, USA). Darüber versenden wir Buchungsbestätigungen, Zahlungserinnerungen und Gutschein-Mails (Abschnitt 6), die Bestätigungsmail zur Newsletter-Anmeldung und den Newsletter (Abschnitt 9), Rechnungen aus unserem Verwaltungssystem sowie interne Benachrichtigungen an uns (Nachrichten aus dem Kontaktformular, neue Buchungen und begonnene Buchungsvorgänge). Dabei werden die zur Zustellung erforderlichen Daten – insbesondere Name, E-Mail-Adresse, Telefonnummer und Nachrichteninhalt – serverseitig an Resend übermittelt. Den Versand für unsere Domain wickelt Resend über Server von Amazon Web Services in Irland ab; weil Resend seinen Sitz in den USA hat, ist eine Übermittlung dorthin nicht ausgeschlossen. Resend ist nach dem EU-US Data Privacy Framework zertifiziert (Art. 45 DSGVO). Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung) bzw. Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einem zuverlässigen E-Mail-Versand). Resend verarbeitet die Daten als Auftragsverarbeiter gemäß Art. 28 DSGVO. Weitere Informationen: <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-gold-600 underline underline-offset-2">resend.com/legal/privacy-policy</a>
            </p>

            <h3 className="font-semibold text-forest-800 mb-2">E-Mail-Postfach: iCloud Mail</h3>
            <p>
              E-Mails an hallo@sarfi-collection.de – auch die Nachrichten aus dem Kontaktformular und unsere internen Benachrichtigungen – empfangen und speichern wir über den Dienst iCloud Mail. Für die Verarbeitung personenbezogener Daten in der EU ist dort die Apple Distribution International Limited, Hollyhill Industrial Estate, Hollyhill, Cork, Irland, verantwortlich. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Bearbeitung Ihrer Anfrage bzw. Buchung) sowie Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einer zuverlässigen Kommunikation). Weitere Informationen: <a href="https://www.apple.com/de/legal/privacy/" target="_blank" rel="noopener noreferrer" className="text-gold-600 underline underline-offset-2">apple.com/de/legal/privacy</a>
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
              <li>Anzahl mitreisender Hunde (nur in Unterkünften, in denen Hunde erlaubt sind)</li>
              <li>optionale Nachricht (besondere Wünsche, Anreisezeit)</li>
              <li>bei einer Firmenbuchung: Firma, Umsatzsteuer-Identifikationsnummer und Rechnungsanschrift</li>
              <li>gewählte Sprache der Website (für Bestätigungs- und Erinnerungsmails)</li>
              <li>Zahlungsinformationen (verarbeitet durch Stripe – siehe Abschnitt 7)</li>
            </ul>
            <p className="mb-3">
              Diese Daten verwenden wir zur Abwicklung der Buchung, für die Buchungsbestätigung, für Erinnerungen an eine offene Restzahlung sowie für die Kommunikation rund um Ihren Aufenthalt (z.&nbsp;B. Anreiseinformationen). Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung bzw. vorvertragliche Maßnahmen).
            </p>
            <p className="mb-3">
              Sobald Sie im Buchungsformular in den Zahlungsschritt wechseln, legen wir bei Stripe einen Zahlungsvorgang mit Ihren Buchungsangaben an (Abschnitt 7) und erhalten eine interne E-Mail, dass ein Buchungsvorgang begonnen wurde. Sie enthält Ihre Buchungsangaben sowie Ihre IP-Adresse und die Kennung Ihres Browsers (User-Agent). Das geschieht auch dann, wenn Sie die Zahlung nicht abschließen. Wir nutzen diese Angaben, um bei einem abgebrochenen Vorgang zu erkennen, ob ein technisches Problem vorlag, Ihnen gegebenenfalls Hilfe anzubieten und Betrugsversuche zu erkennen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahmen) sowie Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einer funktionierenden Buchungsstrecke und an Betrugsprävention). Kommt keine Buchung zustande, löschen wir die interne E-Mail spätestens sechs Monate nach dem Vorgang; den unvollständigen Zahlungsvorgang bewahrt Stripe nach seinen eigenen Aufbewahrungsregeln auf.
            </p>
            <p className="mb-3">
              Buchungs- und Zahlungsdaten bewahren wir nach Ende des Aufenthalts auf, solange gesetzliche Aufbewahrungspflichten bestehen (steuer- und handelsrechtlich in der Regel 8 bzw. 10 Jahre, § 147 AO, § 14b UStG) oder Ansprüche aus dem Vertrag geltend gemacht werden können (Art. 6 Abs. 1 lit. c und f DSGVO). Anschließend werden sie gelöscht.
            </p>

            <h3 className="font-semibold text-forest-800 mb-2">Melderechtliche Pflichten und Gästebeitrag</h3>
            <p className="mb-3">
              Gäste ohne deutsche Staatsangehörigkeit müssen bei der Anreise einen Meldeschein nach §§ 29, 30 Bundesmeldegesetz (BMG) ausfüllen und unterschreiben; wir sind verpflichtet, den Ausweis einzusehen. Meldescheine bewahren wir ein Jahr ab Abreise auf und vernichten sie danach innerhalb von drei Monaten (§ 30 Abs. 4 BMG). Soweit die Gemeinde einen Gästebeitrag (Kurtaxe) erhebt, übermitteln wir die dafür erforderlichen Angaben (Aufenthaltsdauer, Personenzahl) an die Gemeinde. Rechtsgrundlage ist jeweils Art. 6 Abs. 1 lit. c DSGVO.
            </p>
            <h3 className="font-semibold text-forest-800 mb-2">Digitaler Meldeschein</h3>
            <p className="mb-3">
              Statt des Papierformulars können Sie den Meldeschein online ausfüllen (§ 29 Abs. 5 BMG). Das ist freiwillig; das Papierformular liegt in jeder Unterkunft bereit. Den Link erhalten Sie mit unserer Check-in-Nachricht oder einer gesonderten Nachricht, die wir über unseren Channel-Manager Smoobu bzw. die Nachrichtenfunktion Ihres Buchungsportals versenden; alternativ scannen Sie den QR-Code in der Unterkunft. Der Link aus der Check-in-Nachricht enthält Ihre Buchungsnummer und die vierstellige Gäste-PIN Ihrer Buchung und funktioniert nur vom Tag vor der Anreise bis zur Abreise. Beim Aufruf prüft unser Verwaltungssystem Buchungsnummer und PIN bei Smoobu; aus dieser Abfrage speichern wir nur das Ergebnis der Prüfung. Den Zeitpunkt des ersten Aufrufs dieses Links vermerken wir, damit wir sehen, ob er angekommen ist. Nach dem Öffnen entfernt die Seite den Link aus der Adresszeile Ihres Browsers; bis Sie den Tab schließen, bleibt er nur im Sitzungsspeicher des Browsers (sessionStorage), damit Neuladen und Sprachwechsel funktionieren.
            </p>
            <p className="mb-3">
              Jede erwachsene Person ohne deutsche Staatsangehörigkeit, die nicht als Ehe- oder Lebenspartner:in oder minderjähriges Kind einer anderen meldepflichtigen Person mitreist (z.&nbsp;B. Kolleg:innen), füllt einen eigenen Meldeschein aus und bestätigt ihn selbst mit der eigenen Karte bzw. dem eigenen Apple Pay (§ 29 Abs. 2 und 5 BMG) – nacheinander auf einem Gerät oder über denselben Link auf dem eigenen. Für jeden dieser Meldescheine gilt das hier Beschriebene gleichermaßen. Damit jedes Gerät nur die eigenen Meldescheine weiterbearbeiten und bestätigen kann, erzeugt die Seite für jede weitere Person eine Zufallskennung und legt sie im lokalen Speicher Ihres Browsers (localStorage) ab (ist er gesperrt oder voll, nur für diesen Tab im sessionStorage oder bis zum Schließen der Seite im Arbeitsspeicher; die Seite weist dann darauf hin); für den ersten Meldeschein einer Buchung vermerkt sie dort nur, dass er auf diesem Gerät begonnen wurde, damit ihn ein anderes Gerät nicht versehentlich überschreibt. Abgelegt ist beides unter der Unterkunft und Ihrem Anreise- und Abreisedatum; es öffnet nur zusammen mit dem Link etwas und wird beim nächsten Aufruf der Seite nach Ihrer Abreise aus dem Browser entfernt. Von der Kennung speichern wir nur einen nicht umkehrbaren Prüfwert (Hash), den wir nach Ihrer Abreise löschen. Namen zeigt die Seite nur auf dem Gerät, auf dem der jeweilige Meldeschein ausgefüllt wurde, den Namen aus der Buchung nur zum Vorausfüllen, solange noch niemand mit dem ersten Meldeschein begonnen hat; anderen Mitreisenden zeigt sie höchstens, wie viele weitere Meldescheine es gibt und wie viele davon bestätigt sind. Angefangene weitere Meldescheine, die zwei Stunden lang nicht eingereicht werden, verwerfen wir samt Foto, sobald für die Buchung ein neuer angelegt wird.
            </p>
            <p className="mb-3">Beim digitalen Meldeschein verarbeiten wir:</p>
            <ul className="list-disc list-inside space-y-1 mb-3 ml-2">
              <li>die Angaben des Meldescheins (§ 30 Abs. 2 BMG): An- und Abreisedatum, Familienname, Vornamen, Geburtsdatum, Staatsangehörigkeit(en), Anschrift (Straße, Hausnummer, Postleitzahl, Ort, Land) und Nummer Ihres Ausweisdokuments sowie die Zahl mitreisender ausländischer Ehe- oder Lebenspartner:innen und minderjähriger Kinder (deren Namen, Geburtsdaten und Staatsangehörigkeiten erfassen wir nicht)</li>
              <li>ein Foto der Datenseite Ihres Ausweisdokuments anstelle des Vorzeigens; die Angaben aus der maschinenlesbaren Zone lesen wir automatisch aus, um das Formular vorauszufüllen und Ihre Angaben mit dem Dokument abzugleichen (§ 30 Abs. 2 Satz 2 BMG; Texterkennung auf unserem eigenen Server; Bildmetadaten wie Standort oder Gerät werden entfernt). Die ausgelesenen Angaben, darunter Art, ausstellender Staat und Gültigkeit des Dokuments, dienen nur diesem Abgleich: Wir halten sie zusammen mit dem Foto verschlüsselt vor und löschen sie mit ihm; in den Meldeschein übernehmen wir sie nicht. Nur wenn kein gültiges, anerkanntes Dokument vorliegt, vermerken wir, welches Dokument vorgelegt wurde.</li>
              <li>einen Vermerk über den Abgleich: Zeitpunkt, ob er automatisch oder durch uns erfolgte, Ergebnis und gegebenenfalls, welche Angaben vom Dokument abweichen; eine Abweichung oder die Nichtvorlage des Dokuments steht auch im Meldeschein (§ 30 Abs. 2 Satz 3 und 4 BMG)</li>
              <li>zur Bestätigung anstelle der Unterschrift: Art der Bestätigung (Apple Pay oder Karte), Zeitpunkt, ob sie erst nach dem Anreisetag erfolgte, den von Ihnen eingegebenen Namen des Karteninhabers mit einem Abgleich, ob er zum Meldeschein passt, sowie die Kennungen des Vorgangs und des Zahlungsmittels bei Stripe (Zahlungszuordnungsnummer nach der Beherbergungsmeldedatenverordnung)</li>
              <li>damit jede Person mit ihrer eigenen Karte bestätigt (§ 29 Abs. 5 BMG): bis zu Ihrer Abreise einen nicht umkehrbaren Prüfwert der Karte bzw. des Apple-Pay-Zahlungsmittels, gebildet aus einer Kennung, die Stripe dafür liefert, und einem geheimen Schlüssel, nur innerhalb Ihrer Buchung vergleichbar. Hat dasselbe Zahlungsmittel schon den Meldeschein einer anderen Person dieser Buchung bestätigt, lehnen wir die Bestätigung ab. Liefert Stripe keine solche Kennung, vermerken wir nur, dass die Karte nicht prüfbar war.</li>
              <li>je weiterer Person den Prüfwert der Zufallskennung auf Ihrem Gerät (siehe oben)</li>
            </ul>
            <p className="mb-3">
              Die Bestätigung ersetzt die Unterschrift durch einen kartengebundenen Vorgang mit starker Kundenauthentifizierung (§ 29 Abs. 5 BMG). Sie ist ab dem Anreisetag möglich und läuft über unseren Zahlungsdienstleister Stripe (Abschnitt 7) mit Apple Pay oder Ihrer Karte; die Authentifizierung selbst (z.&nbsp;B. Face ID, Touch ID oder Freigabe in der Banking-App) führen Apple bzw. Ihre Bank durch. Es wird nichts abgebucht. Stripe erhält dazu die Karten- bzw. Wallet-Daten, den Namen des Karteninhabers, technische Geräte- und Verbindungsdaten sowie Unterkunft und Anreisedatum als Verwendungszweck. Wir lösen die Karte direkt nach der Prüfung wieder von unserem Stripe-Konto und speichern keine Kartendaten. Findet keine starke Authentifizierung statt, genügt die Bestätigung nicht; dann unterschreiben Sie bitte das Papierformular. Liegen die Angaben des ersten Meldescheins einer Buchung vor, die Bestätigung aber noch nicht, erinnern wir die buchende Person am Anreisetag einmal per Nachricht; weitere Personen erinnern wir nicht, weil wir keinen Kontakt zu ihnen haben.
            </p>
            <p className="mb-3">
              Wer die deutsche Staatsangehörigkeit hat, braucht keinen Meldeschein. Bestätigen Sie auf der Seite, dass alle Reisenden die deutsche Staatsangehörigkeit haben oder nur Sie selbst (und Ihre Kolleg:innen eigene Meldescheine ausfüllen), speichern wir nur diesen Vermerk mit Zeitpunkt; zuvor hochgeladene Angaben und Fotos löschen wir sofort. Gibt eine weitere Person an, die deutsche Staatsangehörigkeit zu haben, speichern wir dazu nichts; hatte sie schon einen eigenen Meldeschein angefangen, löschen wir dessen Foto und Angaben sofort und behalten bis ein Jahr nach der Abreise nur den Vermerk „nicht nötig“ mit Zeitpunkt.
            </p>
            <p className="mb-3">
              Die Angaben des Meldescheins und das Ausweisfoto speichern wir verschlüsselt auf unserem Verwaltungssystem (dashboard.sarfi.group, Sliplane/Hetzner, Deutschland). Den Vermerk zur Bestätigung (Art, Zeitpunkt, Name des Karteninhabers, Kennungen bei Stripe, bis zur Abreise der Prüfwert der Karte), den Vermerk zum Abgleich und Ihre Staatsangehörigkeit speichern wir dort ohne gesonderte Verschlüsselung, geschützt durch die Zugangssicherung des Systems. Für digital bestätigte Meldescheine legen wir zusätzlich je Person den Datensatz nach § 2 der Beherbergungsmeldedatenverordnung verschlüsselt ab. Das Ausweisfoto löschen wir, sobald Ihre Angaben damit abgeglichen sind: stimmen sie mit der maschinenlesbaren Zone überein, mit der erfolgreichen Bestätigung (bis dahin bleibt es nur, damit Sie Ihre Angaben ohne neues Foto korrigieren können), sonst nach unserer Sichtprüfung; spätestens aber bei Ihrer Abreise oder sieben Tage nach der Anreise, je nachdem, was früher eintritt. Ein Jahr nach Ihrer Abreise löschen wir alles Übrige automatisch, auch den Zeitpunkt des Aufrufs (§ 30 Abs. 4 BMG); bestehen bleibt nur ein Statusvermerk zur Buchung (z.&nbsp;B. „gelöscht“ oder „kein Meldeschein nötig“) ohne weitere Angaben. Angaben aus abgebrochenen Vorgängen, in denen kein Meldeschein eingereicht wurde, löschen wir bereits nach Ihrer Abreise. Ausweisfotos nehmen wir von den Sicherungskopien aus. Die übrigen Angaben sind in den verschlüsselten Sicherungskopien bei Backblaze enthalten (Abschnitt 3), die nur der Wiederherstellung nach einem Ausfall dienen und spätestens nach rund zwei Jahren überschrieben werden; spielen wir eine Sicherung zurück, löschen wir abgelaufene Angaben sofort erneut.
            </p>
            <p className="mb-3">
              Auf Verlangen müssen wir Meldescheine den nach Landesrecht zuständigen Behörden (z.&nbsp;B. Polizei oder Meldebehörde) vorlegen bzw. elektronisch bereitstellen (§ 30 Abs. 4 BMG). Darüber hinaus erhalten nur Stripe (Bestätigung), Smoobu (Versand des Links sowie Prüfung von Buchungsnummer und PIN, Auftragsverarbeiter), unser Hosting-Anbieter (Auftragsverarbeiter, Abschnitt 3) und Backblaze (verschlüsselte Sicherungskopien ohne Ausweisfotos, Auftragsverarbeiter, Abschnitt 3) Daten im beschriebenen Umfang. Die Angaben des Meldescheins und das Ausweisfoto geben wir weder an Smoobu noch an Buchungsportale weiter.
            </p>
            <p className="mb-3">
              Die Angaben des Meldescheins und die Bestätigung verarbeiten wir zur Erfüllung unserer gesetzlichen Pflicht (Art. 6 Abs. 1 lit. c DSGVO i.&nbsp;V.&nbsp;m. §§ 29, 30 BMG und der Beherbergungsmeldedatenverordnung). Das Ausweisfoto und die automatische Texterkennung verarbeiten wir mit Ihrer Einwilligung, die Sie vor dem Hochladen erteilen (Art. 6 Abs. 1 lit. a DSGVO). Sie können sie jederzeit widerrufen, z.&nbsp;B. per E-Mail an hallo@sarfi-collection.de; dann löschen wir das Foto sofort, soweit es noch vorhanden ist. Die Angaben eines bereits erstellten Meldescheins müssen wir auch nach einem Widerruf bis zum Ablauf der gesetzlichen Frist aufbewahren. Die Zufallskennung je weiterer Person und der Vermerk zum ersten Meldeschein im Browser sind für den von Ihnen gewünschten Dienst technisch erforderlich (§ 25 Abs. 2 Nr. 2 TDDDG). Diese Kennung, den Prüfwert der Karte, die Prüfung des Links, den Zeitpunkt des ersten Aufrufs und den Vermerk zur deutschen Staatsangehörigkeit verarbeiten wir aufgrund unseres berechtigten Interesses, die Meldepflicht verlässlich und nachweisbar zu erfüllen und den Zugang vor Unbefugten zu schützen (Art. 6 Abs. 1 lit. f DSGVO).
            </p>

            <h3 className="font-semibold text-forest-800 mb-2">Geschenkgutscheine</h3>
            <p className="mb-3">
              Beim Kauf eines Gutscheins über unsere Website verarbeiten wir Ihren Namen und Ihre E-Mail-Adresse (Zustellung des Gutscheins und des Zahlungsbelegs), den gewählten Betrag sowie optional den Namen der beschenkten Person und eine persönliche Nachricht, die auf dem Gutschein abgedruckt werden. Diese Angaben werden zusammen mit dem Gutscheincode bei unserem Zahlungsdienstleister Stripe (Abschnitt 7) als Zahlungsvorgang gespeichert; ein gesondertes Gutscheinregister führen wir nicht. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO. Die Daten werden bis zum Ablauf der Gutscheingültigkeit und darüber hinaus für die Dauer der gesetzlichen Aufbewahrungsfristen gespeichert.
            </p>

            <h3 className="font-semibold text-forest-800 mb-2">Rechnungsanforderung und Zusatzleistungen (Late Checkout, Verlängerung)</h3>
            <p className="mb-3">
              Über die Seite /rechnung können Sie zu einer Buchung eine Rechnung anfordern. Dazu verarbeiten wir die von Ihnen eingegebenen Rechnungsdaten (Firma, Umsatzsteuer-Identifikationsnummer, Anschrift, E-Mail-Adresse) und stellen die Rechnung als PDF per E-Mail zu. Über die während des Aufenthalts bereitgestellte Seite /late-checkout können Sie einen späteren Check-out oder eine Verlängerung buchen; der Zugriff erfolgt über einen persönlichen Zugangscode Ihrer Buchung. Beide Funktionen werden von unserem eigenen Verwaltungssystem (dashboard.sarfi.group) bereitgestellt, das wie diese Website bei Sliplane auf Servern der Hetzner Online GmbH in Deutschland betrieben wird. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO; für Rechnungsdaten zusätzlich Art. 6 Abs. 1 lit. c DSGVO (§ 14 UStG).
            </p>

            <h3 className="font-semibold text-forest-800 mb-2">Rechnungserstellung: Lexware Office</h3>
            <p className="mb-3">
              Rechnungen erstellen wir mit der Buchhaltungssoftware Lexware Office der Haufe-Lexware GmbH &amp; Co. KG, Munzinger Straße 9, 79111 Freiburg, Deutschland. Dazu übermittelt unser Verwaltungssystem die Rechnungsangaben (Name bzw. Firma, gegebenenfalls Umsatzsteuer-Identifikationsnummer, Anschrift, E-Mail-Adresse) sowie Leistungszeitraum und Beträge an Lexware. Die Daten werden nach Angaben von Lexware ausschließlich in Rechenzentren in Deutschland (Frankfurt am Main) gespeichert. Lexware verarbeitet die Daten als Auftragsverarbeiter gemäß Art. 28 DSGVO. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b und c DSGVO (§ 14 UStG, § 147 AO).
            </p>

            <h3 className="font-semibold text-forest-800 mb-2">Auslesen der Rechnungsanschrift: Anthropic (Claude)</h3>
            <p className="mb-3">
              Viele Gäste nennen ihren Rechnungswunsch und ihre Rechnungsanschrift nur in der Buchungsnotiz oder in einer Nachricht an uns. Damit wir sie zuverlässig erkennen, übermittelt unser Verwaltungssystem für die Rechnungsstellung die Buchungsnotiz und den Nachrichtenverlauf Ihrer Buchung (über Smoobu bzw. Ihr Buchungsportal) an die Claude-API von Anthropic, die daraus Rechnungswunsch und Rechnungsanschrift ausliest. Fehlt dabei eine Angabe oder ist sie unklar, prüfen wir die Rechnung von Hand. Vertragspartner ist die Anthropic Ireland, Limited, 6th Floor, South Bank House, Barrow Street, Dublin 4, D04 TR29, Irland; die Verarbeitung kann auch durch die Anthropic PBC in den USA erfolgen. Anthropic verarbeitet die Daten als Auftragsverarbeiter gemäß Art. 28 DSGVO; für Übermittlungen in die USA gelten die EU-Standardvertragsklauseln (Art. 46 Abs. 2 lit. c DSGVO). Anthropic darf die Inhalte nicht zum Training seiner Modelle verwenden und löscht Ein- und Ausgaben nach eigenen Angaben innerhalb von 30 Tagen, soweit sie nicht wegen eines Verstoßes gegen die Nutzungsrichtlinien oder aus rechtlichen Gründen länger aufbewahrt werden müssen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b und c DSGVO (Rechnungsstellung) sowie Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einer zügigen und fehlerarmen Bearbeitung von Rechnungswünschen). Weitere Informationen: <a href="https://www.anthropic.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-gold-600 underline underline-offset-2">anthropic.com/legal/privacy</a>
            </p>

            <h3 className="font-semibold text-forest-800 mb-2">Channel-Management: Smoobu</h3>
            <p className="mb-3">
              Zur Verwaltung von Buchungen, Verfügbarkeiten und Gästedaten nutzen wir den Property-Management-Dienst der Smoobu GmbH, Ackerstraße 76, 13355 Berlin, Deutschland. Buchungsdaten werden serverseitig an die Smoobu-API übermittelt und dort verarbeitet; die Anzahl der Hunde und bei einer Firmenbuchung Firma, Umsatzsteuer-Identifikationsnummer und Rechnungsanschrift stehen dabei in der Notiz zur Buchung. Eine direkte Verbindung zwischen Ihrem Browser und Smoobu-Servern findet dabei nicht statt.
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
              <li>bei Buchungen außerdem als Angaben zum Zahlungsvorgang, damit wir die Buchung nach der Zahlung anlegen können: Telefonnummer, Personenzahl, Anzahl Hunde, Ihre Nachricht an uns, gewählte Sprache und bei einer Firmenbuchung Firma, Umsatzsteuer-Identifikationsnummer und Rechnungsanschrift</li>
              <li>bei Gutscheinen: Name der Käuferin bzw. des Käufers, Gutscheincode, Betrag sowie optional Name der beschenkten Person und persönliche Nachricht</li>
            </ul>
            <p className="mb-3">
              Das Zahlungsformular wird als Stripe-Element direkt in unsere Seite eingebettet; bei Zusatzleistungen (Late Checkout, Verlängerung) und beim Restbetrag einer Buchung mit Anzahlung, den Sie über einen Stripe-Zahlungslink begleichen, werden Sie auf eine von Stripe gehostete Zahlungsseite weitergeleitet. Welche Zahlarten angeboten werden, hängt von Ihrem Gerät und Land ab; neben den nachfolgend beschriebenen Zahlarten können dies z.&nbsp;B. Amazon Pay, EPS, Bancontact, BLIK oder Stripe Link (Speicherung Ihrer Zahlungsdaten bei Stripe für spätere Zahlungen, nur auf Ihren ausdrücklichen Wunsch) sein. Die Schrift des Zahlungsformulars laden wir von unserem eigenen Server; es findet keine Verbindung zu Google Fonts statt.
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
            <h2 className="font-display text-xl text-forest-900 mb-3">8. Kartendarstellung (OpenFreeMap)</h2>
            <p className="mb-3">
              Auf den Seiten unserer Unterkünfte zeigen wir eine interaktive Karte der Lage und der Ausflugsziele in der Umgebung. Sie wird erst geladen, wenn Sie zu ihr scrollen. Kartendaten und Kartenschriften beziehen wir vom Dienst OpenFreeMap der Hyperknot Software Kft. (Ungarn); die Kartendaten selbst stammen aus OpenStreetMap. Die Höhendaten für das Relief liefern wir von unserem eigenen Server aus.
            </p>
            <p className="mb-3">
              Beim Laden der Karte wird eine Verbindung zu den Servern von OpenFreeMap aufgebaut; dabei werden technisch bedingt Ihre IP-Adresse sowie übliche Verbindungsdaten (z. B. Browsertyp, Zeitpunkt, angefragter Kartenausschnitt) übermittelt. OpenFreeMap setzt nach eigenen Angaben keine Cookies und speichert IP-Adressen nicht in den regulären Zugriffsprotokollen, sondern nur in Fehlerprotokollen (Löschung nach 7 Tagen) oder vorübergehend zur Abwehr von Missbrauch (höchstens 30 Tage). Die Daten werden über das Content-Delivery-Netzwerk von Cloudflare (Cloudflare, Inc., 101 Townsend St., San Francisco, CA 94107, USA) ausgeliefert; dabei kann eine Übertragung von Daten in die USA stattfinden. Cloudflare ist nach dem EU-US Data Privacy Framework zertifiziert (Art. 45 DSGVO). Die Nutzung erfolgt im Interesse einer ansprechenden Darstellung unserer Online-Angebote und einer leichten Auffindbarkeit der angegebenen Orte; dies stellt ein berechtigtes Interesse im Sinne von Art. 6 Abs. 1 lit. f DSGVO dar.
            </p>
            <p className="mb-3">
              Daneben verlinken wir für die Routenplanung auf Google Maps (Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland). Beim bloßen Besuch unserer Website werden keine Daten an Google übertragen — erst wenn Sie den Link aktiv anklicken, gelten die Datenschutzbestimmungen von Google: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-gold-600 underline underline-offset-2">policies.google.com/privacy</a>
            </p>
            <p className="mb-3">
              Gleiches gilt für unsere Links zu WhatsApp (WhatsApp Ireland Ltd.), Instagram (Meta Platforms Ireland Ltd.) und Airbnb (Airbnb Ireland UC): Es handelt sich um einfache Verlinkungen ohne eingebettete Inhalte oder Plugins. Daten werden erst übertragen, wenn Sie den jeweiligen Link anklicken und die Seite des Anbieters aufrufen.
            </p>
            <p className="mb-3">
              Mehr Informationen zum Umgang mit Nutzerdaten finden Sie in der Datenschutzerklärung von OpenFreeMap: <a href="https://openfreemap.org/privacy/" target="_blank" rel="noopener noreferrer" className="text-gold-600 underline underline-offset-2">openfreemap.org/privacy</a>
            </p>
            <h3 className="font-semibold text-forest-800 mb-2">Webcam-Bild</h3>
            <p>
              Bei den Ausflugszielen zeigen wir das aktuelle Bild der Webcam am Steinberglift. Das Bild holt unser Server beim Webcam-Anbieter (evfile01.de) ab und liefert es selbst aus; Ihre IP-Adresse oder andere Daten Ihres Browsers werden dabei nicht an den Webcam-Anbieter übertragen.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="font-display text-xl text-forest-900 mb-3">9. Newsletter</h2>
            <p className="mb-3">
              Sie können sich auf unserer Website für unseren Newsletter anmelden. Dazu verarbeiten wir Ihre E-Mail-Adresse sowie den Zeitpunkt der Anmeldung und der Bestätigung. Die Anmeldung erfolgt im Double-Opt-in-Verfahren: Nach Eingabe Ihrer Adresse erhalten Sie eine E-Mail mit einem Bestätigungslink; erst mit Klick auf diesen Link wird Ihre Adresse in unsere Empfängerliste aufgenommen. Ohne Bestätigung nehmen wir die Adresse nicht in die Empfängerliste auf; lediglich im Versandprotokoll unseres E-Mail-Dienstleisters Resend ist der Versand der Bestätigungsmail vermerkt. Beim Absenden wird Ihre IP-Adresse kurzzeitig zur Missbrauchsabwehr verarbeitet (siehe Bot-Schutz in Abschnitt 5).
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
              Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte, wie zum Beispiel Buchungsanfragen oder Anfragen, die Sie an uns als Seitenbetreiber senden, eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von „http://“ auf „https://“ wechselt und an dem Schloss-Symbol in Ihrer Browserzeile. Wenn die SSL- bzw. TLS-Verschlüsselung aktiviert ist, können die Daten, die Sie an uns übermitteln, nicht von Dritten mitgelesen werden.
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
              Diese Datenschutzerklärung ist aktuell gültig und hat den Stand 22. Oktober 2026. Durch die Weiterentwicklung unserer Website und Angebote oder aufgrund geänderter gesetzlicher beziehungsweise behördlicher Vorgaben kann es notwendig werden, diese Datenschutzerklärung zu ändern. Die jeweils aktuelle Datenschutzerklärung kann jederzeit auf der Website unter <strong>www.sarfi-collection.de/datenschutz</strong> von Ihnen abgerufen und ausgedruckt werden.
            </p>
          </section>

          <p className="text-xs text-forest-400 pt-4 border-t border-cream-200">
            Stand: 22. Oktober 2026
          </p>

        </div>
      </div>
    </div>
  );
}
