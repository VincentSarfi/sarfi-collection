// Ausflugsziele-Seite (components/pages/AusflugszielePageContent.tsx).
// Nur Texte – Farben, Emojis und Bildmaterial liegen in der Komponente bzw.
// in data/ausflugsziele-bildmaterial.ts (Websites, Zusatzlinks, Fotos).
// Fakten geprüft am 06.10.2026 (Betreiber-Websites, Nationalpark-Steckbrief,
// Tourenportal Landkreis Deggendorf); elypso & JOSKA ergänzt am 12.10.2026
// (elypso.de, joska.com); Brotjacklriegel, Großer Arber, Passau, Museumsdorf
// und Glasmuseum Frauenau am 12.10.2026 – nur aus der geprüften Faktenliste in
// Issue #6 (Betreiberseiten); Fahrzeiten aus data/surroundings.ts.
import { ca as caRaw, driveMinutes as m } from "@/data/surroundings";

// „~30 min“ ohne Umbruch zwischen Zahl und Einheit (geschütztes Leerzeichen)
const ca = (minutes: number) => caRaw(minutes).replace(/ /g, " ");

const ausflugsziele = {
  breadcrumbHome: "Startseite",
  breadcrumbCurrent: "Ausflugsziele",
  hero: {
    eyebrow: "Region Bayerischer Wald",
    h1: "Ausflugsziele & Freizeitangebote",
    intro:
      "Vom Wanderweg an der Haustür bis zum Tagesausflug in den Nationalpark – sortiert nach Fahrzeit ab HAUS28 und Haus Schönblick. Tippe auf ein Ziel für alle Details.",
    pillHaus28: "HAUS28 · Grattersdorf",
    pillSchoenblick: "Haus Schönblick · Schöfweg",
  },
  overview: {
    heading: "Mehr erleben im Bayerischen Wald",
  },
  filter: {
    legend: "Ausflüge filtern",
    alle: "Alle",
    kinder: "Mit Kindern",
    regen: "Bei Regen",
    winter: "Im Winter",
    essen: "Essen gehen",
  },
  // {von}/{bis} füllt die Komponente aus data/surroundings.ts
  groups: {
    naehe: { heading: "Vor der Tür", note: "zu Fuß oder bis 10 min", hint: "" },
    nah: { heading: "In der Nähe", note: "{von}–{bis} min mit dem Auto", hint: "" },
    weiter: {
      heading: "Ein Stück weiter",
      note: "{von}–{bis} min mit dem Auto",
      hint: "Baumwipfelpfad und Tier-Freigelände liegen zusammen im Nationalparkzentrum Lusen – gut an einem Tag zu verbinden. Für einen Glas-Tag passen das Glasmuseum Frauenau und JOSKA zusammen.",
    },
  },
  restaurants: {
    heading: "Gasthäuser in der Nähe",
    intro:
      "Nach dem Ausflug oder einfach am Abend: unsere Tipps für bayerische und regionale Küche, alle nur wenige Minuten von den Unterkünften entfernt.",
    websiteLabel: "Website",
  },
  distanceTable: {
    heading: "Entfernungen mit dem Auto",
    summary: "Alle Fahrzeiten als Tabelle",
    colDestination: "Ausflugsziel",
    colHaus28: "ab HAUS28",
    colSchoenblick: "ab Haus Schönblick",
  },
  leiste: {
    zuFuss: "zu Fuß",
    min: "min",
  },
  gutZuWissen: "Gut zu wissen",
  highlightsLabel: "Highlights",
  practicalLabel: "Praktische Infos",
  photoLabel: "Foto",
  officialWebsiteLabel: "Offizielle Website",
  newTabHint: "(öffnet in neuem Tab)",
  webcam: {
    caption: "Live-Webcam am Steinberglift",
    linkLabel: "Webcam: Steinberglift – zur Webcam-Seite",
    fallback: "Webcam gerade nicht erreichbar – Live-Bild auf steinberglift.de ansehen",
  },
  attractions: [
    {
      id: "pullman-city",
      tag: "Familie & Unterhaltung",
      cardTags: ["Kinder", "Familie"],
      name: "Pullman City",
      schemaName: "Pullman City – Westernstadt Eging am See",
      subtitle: "Westernstadt in Eging am See – seit 1997",
      distance: `${ca(m.pullmanCity.haus28)} von HAUS28 & Haus Schönblick`,
      fromHaus28: ca(m.pullmanCity.haus28),
      fromSchoenblick: ca(m.pullmanCity.schoenblick),
      description:
        "Am Südrand des Bayerischen Waldes liegt in Eging am See die Westernstadt Pullman City – seit 1997 auf rund 200.000 m². Hier warten Westernshows, Ponyreiten, Goldwaschen, der Wasserspielplatz „El Dorado“ mit Rutsche, ein Kleintiergehege und Western-Gastronomie. Ein echtes Highlight für Familien und alle, die den Wilden Westen erleben wollen – ohne die USA zu verlassen.",
      schemaDescription:
        "Westernstadt auf rund 200.000 m² mit Westernshows, Ponyreiten, Goldwaschen und Wasserspielplatz.",
      highlights: [
        "Wechselndes Showprogramm",
        "Wasserspielplatz „El Dorado“ mit Rutsche",
        "Pferdeshow & Ponyreiten",
        "Goldwaschen für Kinder",
        "Übernachtung in Hotels, Blockhütten oder Tipis möglich",
      ],
      practicalInfo: [
        { label: "Saison", value: "ab März, im Winter mit Weihnachtsprogramm – nicht täglich geöffnet, Kalender auf pullmancity.de" },
        { label: "Adresse", value: "Ruberting 30, 94535 Eging am See" },
        { label: "Tipp", value: "Einen ganzen Tag einplanen und die Showzeiten vorab im Tagesprogramm nachsehen" },
      ],
    },
    {
      id: "baumwipfelpfad",
      tag: "Natur & Erlebnis",
      cardTags: ["Natur", "Kinder", "Barrierearm"],
      name: "Baumwipfelpfad Neuschönau",
      schemaName: "Baumwipfelpfad Neuschönau",
      subtitle: "Einer der längsten Baumwipfelpfade Europas",
      distance: `${ca(m.nationalparkLusen.schoenblick)} von Haus Schönblick · ${ca(m.nationalparkLusen.haus28)} von HAUS28`,
      fromHaus28: ca(m.nationalparkLusen.haus28),
      fromSchoenblick: ca(m.nationalparkLusen.schoenblick),
      description:
        "Der Baumwipfelpfad in Neuschönau im Nationalpark Bayerischer Wald gehört mit 1.300 m zu den längsten Europas. Der barrierearme Holzsteg (höchstens 6 % Steigung) führt in 8 bis 25 m Höhe durch die Baumkronen. Höhepunkt ist der 44 m hohe Aussichtsturm, das „Baumei“, mit Rundumblick über den Nationalpark. Für Kinder gibt es Erlebnisstationen entlang des Weges.",
      schemaDescription:
        "Einer der längsten Baumwipfelpfade Europas: 1.300 m Holzsteg in 8–25 m Höhe und ein 44 m hoher Aussichtsturm im Nationalpark Bayerischer Wald.",
      highlights: [
        "1.300 m Holzsteg in 8–25 m Höhe",
        "44 m hoher Aussichtsturm „Baumei“",
        "Barrierearm, mit Kinderwagen & Rollstuhl befahrbar",
        "Erlebnisstationen für Kinder",
        "Direkt am Tier-Freigelände des Nationalparks",
      ],
      practicalInfo: [
        { label: "Öffnung", value: "ganzjährig, im Winter nicht täglich – Zeiten auf treetop-walks.com" },
        { label: "Eintritt", value: "Erwachsene 13 €, Kinder 6–14 J. 11 €, unter 6 frei, Familie 31 € (Stand 2026)" },
        { label: "Tipp", value: "Kombi mit dem Tier-Freigelände (nebenan, kostenlos)" },
      ],
    },
    {
      id: "nationalpark",
      tag: "Natur & Wandern",
      cardTags: ["Natur", "Kinder"],
      name: "Nationalpark Bayerischer Wald",
      schemaName: "Nationalpark Bayerischer Wald",
      subtitle: "Deutschlands ältester Nationalpark",
      distance: `${ca(m.nationalparkLusen.schoenblick)} von Haus Schönblick · ${ca(m.nationalparkLusen.haus28)} von HAUS28 (Nationalparkzentrum Lusen)`,
      fromHaus28: ca(m.nationalparkLusen.haus28),
      fromSchoenblick: ca(m.nationalparkLusen.schoenblick),
      description:
        "Seit 1970 ist der Bayerische Wald Deutschlands erster Nationalpark – heute 24.945 ha, auf denen die Natur sich selbst überlassen bleibt. Das Besucherzentrum Hans-Eisenmann-Haus in Neuschönau und das Haus zur Wildnis in Ludwigsthal bieten spannende Ausstellungen. Im Tier-Freigelände leben Luchse, Wölfe, Bären, Wisente und Fischotter in naturnahen Gehegen – der Eintritt ist frei.",
      schemaDescription:
        "Deutschlands ältester Nationalpark – 24.945 ha Wildnis mit Tier-Freigelände, Besucherzentren und rund 350 km Wanderwegen.",
      highlights: [
        "Tier-Freigelände: Luchs, Wolf, Bär, Wisent (kostenlos)",
        "Rund 350 km markierte Wanderwege",
        "Ranger-Führungen & Naturprogramme",
        "Besucherzentrum mit interaktiven Ausstellungen",
        "Urwald – Natur ohne menschliche Eingriffe",
      ],
      practicalInfo: [
        { label: "Eintritt", value: "Tier-Freigelände kostenlos, Parkplatz gebührenpflichtig" },
        { label: "Saison", value: "ganzjährig zugänglich, Besucherzentrum im Spätherbst einige Wochen geschlossen" },
        { label: "Tipp", value: "Morgendliche Wanderungen für Wildtierbeobachtung" },
      ],
    },
    {
      id: "skigebiet-sonnenwald",
      tag: "Winter & Sport",
      cardTags: ["Winter", "Kinder"],
      name: "Steinberglift Langfurth",
      schemaName: "Steinberglift Langfurth (Schöfweg)",
      subtitle: "Familien-Skilift direkt am Haus Schönblick",
      distance: `direkt bei Haus Schönblick in Langfurth · ${ca(m.steinberglift.haus28)} von HAUS28`,
      fromHaus28: ca(m.steinberglift.haus28),
      fromSchoenblick: "zu Fuß (ca. 600 m)",
      description:
        "Der Steinberglift in Langfurth bei Schöfweg liegt buchstäblich vor der Haustür von Haus Schönblick: eine 400 m lange Hauptpiste, dazu ein Kinderland mit Anfängerlift, Förderband und Übungshang sowie ein Rodelhang. Weitere Lifte gibt es am nahen Brotjacklriegel (1.011 m) – in Schöfweg sind es insgesamt sieben Liftanlagen – und rund 23 km gespurte Loipen in Schöfweg und Umgebung. Die Live-Webcam zeigt den aktuellen Schneezustand – ideal zur Planung direkt aus der Unterkunft.",
      schemaDescription:
        "Familienfreundlicher Skilift in Langfurth bei Schöfweg mit 400-m-Piste, Kinderland, Rodelhang und Live-Webcam.",
      highlights: [
        "Hauptpiste 400 m & Kinderland",
        "Rodelhang",
        "Rund 23 km Loipen in Schöfweg und Umgebung",
        "Live-Webcam für Schneekontrolle",
        "Familien- & anfängerfreundlich",
      ],
      practicalInfo: [
        { label: "Saison", value: "Winter, schneeabhängig (mit Beschneiung)" },
        { label: "Einkehr", value: "Stoaberg Alm direkt am Lift (neu seit September 2026)" },
        { label: "Tipp", value: "Schlittschuhlaufen in Grafenau als Alternative" },
      ],
    },
    {
      id: "indoor-golf",
      tag: "Sport & Spaß",
      cardTags: ["Regenwetter"],
      name: "Rusel-Arena Indoor Golf",
      schemaName: "Rusel-Arena Indoor Golf",
      subtitle: "6 TrackMan-Simulatoren am Golfplatz Rusel",
      distance: `${ca(m.ruselArena.haus28)} von HAUS28 & Haus Schönblick`,
      fromHaus28: ca(m.ruselArena.haus28),
      fromSchoenblick: ca(m.ruselArena.schoenblick),
      description:
        "Seit Ende 2024 gibt es am Golfplatz Deggendorf-Rusel die Rusel-Arena: Auf 370 m² stehen 6 TrackMan-Simulatoren bereit – mit präziser Schlaganalyse und über 200 internationalen Golfplätzen zur Auswahl. Anfänger, Fortgeschrittene und Profis sind gleichermaßen willkommen, witterungsunabhängig das ganze Jahr.",
      schemaDescription: "370 m² Indoor-Golfsimulator mit 6 TrackMan-Stationen am Golfplatz Rusel bei Deggendorf.",
      highlights: [
        "6 TrackMan-Simulationsstationen",
        "370 m² Indoor-Anlage",
        "Über 200 internationale Golfplätze",
        "Präzise Schlaganalyse & Auswertung",
        "Ganzjährig & wetterunabhängig",
      ],
      practicalInfo: [
        { label: "Preis", value: "ab 44 € / 55 min / Station" },
        { label: "Buchung", value: "Online über arena.deggendorfer-golfclub.de" },
        { label: "Tipp", value: "Auch für Nicht-Golfer ideal als Gruppenaktivität" },
      ],
    },
    {
      id: "elypso",
      tag: "Baden & Wellness",
      cardTags: ["Regenwetter", "Kinder", "Winter"],
      name: "elypso Deggendorf",
      schemaName: "elypso Freizeit- und Erlebnisbad Deggendorf",
      subtitle: "Freizeit- und Erlebnisbad mit Saunawelt",
      distance: `${ca(m.elypso.haus28)} von HAUS28 & Haus Schönblick`,
      fromHaus28: ca(m.elypso.haus28),
      fromSchoenblick: ca(m.elypso.schoenblick),
      description:
        "Das elypso in Deggendorf ist das große Freizeit- und Erlebnisbad der Region: In der Badewelt warten Sportbecken, ein Multibecken mit Strömungskanal, die Wellness-Lagune mit Poolbar und Whirlpool sowie ein Kinderbereich mit Rutschen. Die Saunawelt bietet mehrere Themensaunen mit Aufgüssen, Saunagarten und Naturbadeteich. Im Sommer öffnet zusätzlich das Freibad mit Sandstrand. Der verlässliche Plan für Regentage – und nach einem Skitag die perfekte Aufwärm-Station.",
      schemaDescription:
        "Freizeit- und Erlebnisbad in Deggendorf mit Badewelt, Saunawelt mit Themensaunen und Sommer-Freibad.",
      highlights: [
        "Sportbecken & Multibecken mit Strömungskanal",
        "Wellness-Lagune mit Poolbar & Whirlpool",
        "Saunawelt mit Themensaunen & Naturbadeteich",
        "Kinderbereich & Rutschen",
        "Freibad mit Sandstrand im Sommer",
      ],
      practicalInfo: [
        { label: "Öffnung", value: "Badewelt & Saunawelt ganzjährig, Freibad Mitte Mai bis Mitte September – Zeiten auf elypso.de" },
        { label: "Eintritt", value: "aktuelle Preise auf elypso.de · Saunawelt ohne Begleitung eines Erwachsenen ab 16 Jahren" },
        { label: "Adresse", value: "Sandnerhofweg 4–6, 94469 Deggendorf" },
      ],
    },
    {
      id: "joska",
      tag: "Glas & Handwerk",
      cardTags: ["Regenwetter", "Kinder"],
      name: "JOSKA Glasparadies",
      schemaName: "JOSKA Glasparadies Bodenmais",
      subtitle: "Glasmacher-Tradition zum Anfassen in Bodenmais",
      distance: `${ca(m.joska.schoenblick)} von Haus Schönblick · ${ca(m.joska.haus28)} von HAUS28`,
      fromHaus28: ca(m.joska.haus28),
      fromSchoenblick: ca(m.joska.schoenblick),
      description:
        "Im JOSKA Glasparadies in Bodenmais erlebst du die Glasmacher-Tradition des Bayerischen Waldes zum Anfassen: In der Glashütte siehst du den Glasmachern bei der Arbeit zu – die Besichtigung ist kostenlos und ohne Voranmeldung – und bläst unter Anleitung sogar dein eigenes Glasstück. Dazu kommen die große Glas- und Deko-Welt mit Shop, Kristallgärten und Abenteuer-Spielplatz sowie das Erlebnisrestaurant, der JOSKA Biergarten und das Café Kristallino. Ideal als Halbtagesausflug, auch bei Regen.",
      schemaDescription:
        "Glas-Erlebniswelt in Bodenmais mit Glashütte (Besichtigung kostenlos, ohne Voranmeldung), Glasblasen zum Mitmachen, Shop und Gastronomie.",
      highlights: [
        "Glashütte: Glasmachern live zusehen – kostenlos, ohne Voranmeldung",
        "Glasblasen zum Mitmachen – eigenes Stück gestalten",
        "Kristallgärten & großer Abenteuer-Spielplatz",
        "Große Glas- & Deko-Welt mit Shop",
        "Erlebnisrestaurant, JOSKA Biergarten & Café Kristallino",
      ],
      practicalInfo: [
        { label: "Öffnung", value: "ganzjährig, auch Sonn- & Feiertage – Zeiten auf joska.com" },
        { label: "Eintritt", value: "Glashütte kostenlos besichtigen, ohne Voranmeldung; Glasblasen für Besucher siehe joska.com" },
        { label: "Adresse", value: "Am Moosbach 1, 94249 Bodenmais" },
      ],
    },
    {
      id: "arber",
      tag: "Berg & Winter",
      cardTags: ["Winter", "Natur", "Barrierearm"],
      name: "Großer Arber",
      schemaName: "Großer Arber mit Arber-Bergbahn und Großem Arbersee",
      subtitle: "1.456 m – der „König des Bayerischen Waldes“",
      distance: `${ca(m.arber.haus28)} von HAUS28 & Haus Schönblick`,
      fromHaus28: ca(m.arber.haus28),
      fromSchoenblick: ca(m.arber.schoenblick),
      description:
        "Mit 1.456 Metern ist der Große Arber der höchste Berg des Bayerisch-Böhmischen Gebirgsmassivs – nicht umsonst heißt er „König des Bayerischen Waldes“. Die Gondelbahn bringt dich bequem und barrierefrei auf den Gipfel, die Wege oben sind breit genug für Rollstühle und Gehhilfen. Im Winter wird der Arber zum Skigebiet mit Rodelbahnen, Tourenskigehen und Winterwandern. Zum Arber gehört auch der Große Arbersee mit barrierefreiem Arberseehaus, Tretbootverleih und Waldkugelbahn.",
      schemaDescription:
        "Höchster Berg des Bayerisch-Böhmischen Gebirgsmassivs (1.456 m) mit barrierefreier Gondelbahn, Skigebiet im Winter und dem Großen Arbersee.",
      highlights: [
        "Gondelbahn bequem & barrierefrei auf den Gipfel",
        "Gipfelwege breit genug für Rollstuhl & Gehhilfen",
        "Winter: Skigebiet, Rodelbahnen, Tourenski, Winterwandern",
        "Ski- & Snowboardverleih",
        "Großer Arbersee: Tretboote, Waldkugelbahn, barrierefreies Arberseehaus",
      ],
      practicalInfo: [
        { label: "Saison", value: "Sommer: Gondelbahn & Wandern · Winter: Skigebiet & Rodeln – Betriebszeiten und Preise auf arber.de" },
        { label: "Anfahrt", value: "bis zur Talstation der Arber-Bergbahn" },
        { label: "Tipp", value: "Gipfel und Arbersee an einem Tag verbinden" },
      ],
    },
    {
      id: "passau",
      tag: "Stadt & Kultur",
      cardTags: ["Regenwetter", "Kultur"],
      name: "Passau",
      schemaName: "Passau – Dreiflüssestadt mit Dom St. Stephan",
      subtitle: "Dreiflüssestadt an Donau, Inn und Ilz",
      distance: `${ca(m.passau.haus28)} von HAUS28 · ${ca(m.passau.schoenblick)} von Haus Schönblick`,
      fromHaus28: ca(m.passau.haus28),
      fromSchoenblick: ca(m.passau.schoenblick),
      description:
        "In Passau treffen am Dreiflüsseeck drei Flüsse aus drei Himmelsrichtungen zusammen: Donau, Inn und Ilz. Der Dom St. Stephan mit seinen weißen Türmen und blaugrünen Kuppeln wurde nach dem Stadtbrand von 1662 von Carlo Lurago und Giovanni Battista Carlone gestaltet. Seine Orgel nennt die Stadt die größte Domorgel der Welt – mit 17.974 Pfeifen und 233 Registern; von Mai bis Oktober gibt es werktags um 12 Uhr ein Mittagskonzert. Dazu kommen die Veste Oberhaus mit dem Oberhausmuseum und Schifffahrten auf den Flüssen. Ein Stadttag, der auch bei Regen funktioniert.",
      schemaDescription:
        "Dreiflüssestadt an Donau, Inn und Ilz mit Dom St. Stephan (Domorgel mit 17.974 Pfeifen und 233 Registern), Veste Oberhaus und Oberhausmuseum.",
      highlights: [
        "Dreiflüsseeck: Donau, Inn & Ilz",
        "Dom St. Stephan – gestaltet nach dem Stadtbrand 1662",
        "Domorgel mit 17.974 Pfeifen & 233 Registern",
        "Veste Oberhaus mit Oberhausmuseum",
        "Schifffahrten auf den Flüssen",
      ],
      practicalInfo: [
        { label: "Orgelkonzerte", value: "Mai–Oktober werktags 12 Uhr (Mittagskonzert Erwachsene 6 €, Stand 2026), dazu 1× im Monat donnerstags 19:30 Uhr; im Advent Mi–Sa 12 Uhr" },
        { label: "Fahrzeit", value: "gerechnet bis zur Altstadt (Rathausplatz)" },
        { label: "Tipp", value: "Bei Regen Dom und Oberhausmuseum, bei Sonne eine Schifffahrt" },
      ],
    },
    {
      id: "museumsdorf",
      tag: "Freilichtmuseum",
      cardTags: ["Kinder", "Kultur"],
      name: "Museumsdorf Bayerischer Wald",
      schemaName: "Museumsdorf Bayerischer Wald (Tittling)",
      subtitle: "Freilichtmuseum am Dreiburgensee bei Tittling",
      distance: `${ca(m.museumsdorf.schoenblick)} von Haus Schönblick · ${ca(m.museumsdorf.haus28)} von HAUS28`,
      fromHaus28: ca(m.museumsdorf.haus28),
      fromSchoenblick: ca(m.museumsdorf.schoenblick),
      description:
        "Im Museumsdorf Bayerischer Wald bei Tittling stehen auf 25 Hektar über 150 Gebäude aus der Zeit von 1580 bis 1850 – direkt am Dreiburgensee. Dazu kommt eine volkskundliche Sammlung mit 60.000 Objekten. Im Sommerhalbjahr sind von Mittwoch bis Sonntag Museumskasse und zusätzliche Häuser geöffnet; im Winterhalbjahr ist ein Spaziergang über das Gelände möglich.",
      schemaDescription:
        "Freilichtmuseum am Dreiburgensee bei Tittling: über 150 Gebäude aus der Zeit von 1580 bis 1850 auf 25 ha, volkskundliche Sammlung mit 60.000 Objekten.",
      highlights: [
        "Über 150 Gebäude aus der Zeit von 1580 bis 1850",
        "25 Hektar Gelände am Dreiburgensee",
        "Volkskundliche Sammlung mit 60.000 Objekten",
        "Kinder bis 6 Jahre in Begleitung frei",
      ],
      practicalInfo: [
        { label: "Saison", value: "Sommerhalbjahr Mi–So 10–17 Uhr, auch an Feiertagen; Mo/Di 10–17 Uhr Zugang über das Drehkreuz (ermäßigt 3 €, Münzen); Winterhalbjahr 1. November 2026 bis Ostern 2027 Spaziergang möglich, Drehkreuz 10–16 Uhr" },
        { label: "Eintritt", value: "Erwachsene 8 €, Kinder bis 6 J. in Begleitung frei (Stand 2026)" },
        { label: "Hinweis", value: "Das Gasthaus Mühlhiasl ist vorübergehend wegen Pächterwechsel geschlossen (Stand Herbst 2026)" },
      ],
    },
    {
      id: "glasmuseum-frauenau",
      tag: "Glas & Kunst",
      cardTags: ["Regenwetter", "Kinder"],
      name: "Glasmuseum Frauenau",
      schemaName: "Glasmuseum Frauenau mit den Gläsernen Gärten",
      subtitle: "Eine Reise mit dem Glas von der Antike bis zur Gegenwart",
      distance: `${ca(m.glasmuseumFrauenau.schoenblick)} von Haus Schönblick · ${ca(m.glasmuseumFrauenau.haus28)} von HAUS28`,
      fromHaus28: ca(m.glasmuseumFrauenau.haus28),
      fromSchoenblick: ca(m.glasmuseumFrauenau.schoenblick),
      description:
        "Das Glasmuseum Frauenau nimmt dich mit auf eine Reise mit dem Glas von der Antike bis zur Gegenwart. Vor dem Museum, mit Blick auf die Pfarrkirche, liegen die Gläsernen Gärten: Mittelpunkt ist die Glasarche, insgesamt stehen dort über 30 Großskulpturen aus Glas, und die Gärten setzen sich bei der Glashütte Eisch und im Atelierviertel Moosau fort. Zur Parkanlage gehört ein großer Abenteuerspielplatz – drinnen Museum, draußen Spielplatz.",
      schemaDescription:
        "Museum zur Glasgeschichte von der Antike bis zur Gegenwart mit den Gläsernen Gärten (über 30 Großskulpturen aus Glas) und großem Abenteuerspielplatz.",
      highlights: [
        "Glasgeschichte von der Antike bis zur Gegenwart",
        "Gläserne Gärten mit über 30 Großskulpturen aus Glas",
        "Glasarche als Mittelpunkt der Gärten",
        "Großer Abenteuerspielplatz in der Parkanlage",
      ],
      practicalInfo: [
        { label: "Öffnung", value: "Di–So und an Feiertagen 9–17 Uhr, montags geschlossen" },
        { label: "Eintritt", value: "aktuelle Preise auf glasmuseum-frauenau.de" },
        { label: "Tipp", value: "Mit dem JOSKA Glasparadies in Bodenmais zu einem Glas-Tag verbinden" },
      ],
    },
  ],
  seasons: {
    eyebrow: "Wann fahren?",
    heading: "Bayerischer Wald – zu jeder Jahreszeit lohnenswert",
    items: [
      {
        season: "Frühling",
        months: "März – Mai",
        activities: ["Wandern auf tauenden Wegen", "Wildblumen & Vogelbeobachtung", "Ruhe vor dem Sommertrubel", "Ostermärkte in Grafenau"],
      },
      {
        season: "Sommer",
        months: "Juni – August",
        activities: ["Pullman City & Baumwipfelpfad", "Büchelstein-Wanderung", "Badeseen der Region", "Mountainbiken & Radfahren"],
      },
      {
        season: "Herbst",
        months: "September – November",
        activities: ["Herbstfarben im Wald", "Pilzesammeln (mit Erlaubnis)", "Ruhige Wanderungen", "Indoor Golf Rusel-Arena"],
      },
      {
        season: "Winter",
        months: "Dezember – Februar",
        activities: ["Skifahren am Steinberglift", "Skigebiet & Rodelbahnen am Großen Arber", "Rodeln & Langlaufen", "Weihnachtsmärkte", "Hallenbad & Sauna im elypso Deggendorf"],
      },
    ],
  },
  hike: {
    eyebrow: "Direkt ab HAUS28",
    heading: "Büchelstein-Rundwanderung",
    tableName: "Büchelstein-Rundwanderung",
    cardTags: ["Natur", "Wandern"],
    cardNote: "Start direkt an der Haustür von HAUS28",
    schemaName: "Büchelstein Wanderroute ab HAUS28",
    schemaDescription:
      "Rundwanderung direkt ab HAUS28 auf dem Rundweg Nr. 54 „Büchelsteiner-Runde“: Großer Büchelstein (831 m), Kleiner Büchelstein und Wallfahrtskapelle Rastbuche (18. Jh.) – ca. 7 km, mit Blicken ins Donautal.",
    intro:
      "Die schönste Wanderung ab HAUS28 führt auf den Großen Büchelstein (831 m) – über den Kleinen Büchelstein, vorbei an der historischen Wallfahrtskapelle Rastbuche und durch dichten Bayerwald-Forst. Der Rundweg Nr. 54 ist rot markiert, für geübte Familien geeignet und belohnt mit einem Panoramablick über den Bayerischen Wald bis ins Donautal.",
    stats: [
      { label: "Start", value: "direkt ab HAUS28, Büchelstein 28" },
      { label: "Strecke", value: "ca. 7 km · 2–2,5 h · ca. 300 Hm" },
      { label: "Gipfel", value: "831 m (Großer Büchelstein)" },
      { label: "Markierung", value: "Nr. 54 „Büchelsteiner-Runde“ (rot)" },
      { label: "Schwierigkeit", value: "Mittel – feste Wanderschuhe empfohlen" },
    ],
    waypoints: [
      {
        name: "Start: HAUS28",
        detail: "Du läufst direkt an der Haustür los, in den Wald und hinauf zum Büchelstein. Unterwegs zeigt die rote Markierung Nr. 54 den Weg.",
      },
      {
        name: "Großer Büchelstein (831 m)",
        detail:
          "Der Hauptgipfel und Höhepunkt der Tour. Von der Drachenschanze am Gipfel reicht das Panorama bei klarem Wetter über den Bayerischen Wald bis ins Donautal – bei Föhn sogar bis zu den Alpen. Moosige Felsplatten am Gipfel: feste Schuhe lohnen sich.",
      },
      {
        name: "Kleiner Büchelstein",
        detail: "Der zweite Gipfel der Runde, mit schönem Blick ins Tal und über die bewaldeten Hügel des Bayerischen Waldes.",
      },
      {
        name: "Wallfahrtskapelle Rastbuche",
        detail:
          "Die Wallfahrtskapelle Rastbuche bei Grattersdorf stammt aus dem 18. Jahrhundert und steht unter Denkmalschutz. Von hier geht der Blick bei klarer Sicht weit ins Donautal.",
      },
      {
        name: "Rückweg zu HAUS28",
        detail:
          "Über Kerschbaum geht es zurück zum Haus – als Schleife, ohne dieselbe Strecke zweimal zu gehen.",
      },
    ],
    routeSummary: "Route & Wegpunkte",
    mapStrong: "Wanderkarte & GPS:",
    mapText:
      " Die Runde findest du auf Outdooractive, Komoot und AllTrails unter „Büchelstein Grattersdorf“. Vor Ort einfach der roten Markierung Nr. 54 „Büchelsteiner-Runde“ folgen.",
    cta: "HAUS28 – direkt am Büchelstein buchen",
  },
  // Zweite Wanderung „Vor der Tür“ – Fakten: region-sonnenwald.de (Touristikverein Sonnenwald), Issue #6
  brotjacklriegel: {
    heading: "Brotjacklriegel (1.011\u00a0m)",
    cardTags: ["Natur", "Wandern"],
    cardNote: "Zu Fuß ab Haus Schönblick über den Turmweg Langfurth",
    schemaName: "Wanderung auf den Brotjacklriegel ab Haus Schönblick",
    schemaDescription:
      "Wanderung auf den Brotjacklriegel (1.011 m), den Hausberg der Region Sonnenwald: Turmweg Langfurth – Brotjacklriegel, 1,6 km, leicht, ca. 45 Minuten; Start ca. 400 m vom Haus Schönblick.",
    intro:
      "Der Brotjacklriegel (1.011 m) ist der markante Hausberg der Region Sonnenwald – und von Haus Schönblick aus zu Fuß erreichbar: Nach rund 400 m bist du in Langfurth, dort beginnt der Turmweg hinauf zum Gipfel, ein leichter Weg von 1,6 km. Oben stehen der Aussichtsturm des Bayerischen Waldvereins und das Turmstüberl.",
    notice: "Laut Touristikverein Sonnenwald ist die Aussichtsplattform des Turms derzeit aus Brandschutzgründen gesperrt.",
    stats: [
      { label: "Start", value: "Langfurth, ca. 400 m zu Fuß ab Haus Schönblick" },
      { label: "Turmweg Langfurth", value: "1,6 km · ca. 45 min · leicht" },
      { label: "Gipfel", value: "1.011 m" },
      { label: "Große Runde", value: "Brotjacklriegel-Rundweg, ca. 12 km · ca. 4,5 h · leicht" },
      { label: "Turmstüberl", value: "April–November täglich 10–18 Uhr, Do Ruhetag" },
      { label: "Ab HAUS28", value: "ca. 10 min mit dem Auto; Parken in Langfurth 55 (beim Feuerwehrhaus) oder am Wanderparkplatz Daxstein" },
    ],
    moreRoutesHeading: "Weitere Turmwege zum Gipfel",
    moreRoutes: [
      { name: "Ab Ölberg", detail: "1,6 km · ca. 1 h 10 min" },
      { name: "Ab Daxstein", detail: "1,8 km · ca. 55 min · schwierig" },
      { name: "Ab Mitterdorf/Schöfweg", detail: "4,4 km · ca. 1 h 30 min · leicht" },
    ],
    cta: "Haus Schönblick – zu Fuß zum Brotjacklriegel",
  },
  cta: {
    eyebrow: "Dein Ausgangspunkt",
    heading: "Alle Ausflugsziele direkt vor der Tür",
    text:
      "HAUS28 am Büchelstein und Haus Schönblick in Schöfweg liegen ideal im Herzen des Bayerischen Waldes – perfekt als Ausgangspunkt für alle Ausflüge auf dieser Seite. Buche direkt und spare bis zu 20 % gegenüber Buchungsplattformen.",
    haus28: "HAUS28 entdecken",
    schoenblick: "Haus Schönblick entdecken",
  },
  schemaListName: "Ausflugsziele Bayerischer Wald",
  schemaListDescription: "Die besten Ausflugsziele rund um HAUS28 und Haus Schönblick im Bayerischen Wald",
};

export default ausflugsziele;
