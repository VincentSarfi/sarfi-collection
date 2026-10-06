// Ausflugsziele-Seite (components/pages/AusflugszielePageContent.tsx).
// Nur Texte – Farben, Emojis und Links liegen in der Komponente.
// Fakten geprüft am 06.10.2026 (Betreiber-Websites, Nationalpark-Steckbrief,
// Tourenportal Landkreis Deggendorf); Fahrzeiten aus data/surroundings.ts.
import { ca, driveMinutes as m } from "@/data/surroundings";

const ausflugsziele = {
  breadcrumbHome: "Startseite",
  breadcrumbCurrent: "Ausflugsziele",
  hero: {
    eyebrow: "Region Bayerischer Wald",
    h1: "Ausflugsziele & Freizeitangebote",
    intro:
      "Rund um HAUS28 und Haus Schönblick wartet der Bayerische Wald mit einer Fülle an Erlebnissen – von wilder Natur über Westernflair bis zum Golfsimulator für Regentage. Hier findest du unsere persönlichen Empfehlungen für deinen Urlaub.",
    pillHaus28: "HAUS28 · Grattersdorf",
    pillSchoenblick: "Haus Schönblick · Schöfweg",
  },
  quickLinks: {
    "pullman-city": "Pullman City",
    baumwipfelpfad: "Baumwipfelpfad",
    nationalpark: "Nationalpark",
    "skigebiet-sonnenwald": "Skigebiet",
    "indoor-golf": "Indoor Golf",
    "buechelstein-wanderung": "Büchelstein-Tour",
  } as Record<string, string>,
  overview: {
    ariaLabel: "Ausflugsziele Übersicht",
    eyebrow: "Alle Jahreszeiten",
    heading: "Mehr erleben im Bayerischen Wald",
    intro: "Von Westernflair über Ski bis Indoor-Golf – hier ist für jedes Wetter und jede Reisegruppe etwas dabei.",
  },
  distanceTable: {
    heading: "Entfernungen mit dem Auto",
    colDestination: "Ausflugsziel",
    colHaus28: "ab HAUS28",
    colSchoenblick: "ab Haus Schönblick",
  },
  audiences: {
    heading: "Welcher Ausflug passt zu wem?",
    groups: [
      {
        title: "Mit Kindern",
        items: [
          { text: "Pullman City: Shows, Ponyreiten, Goldwaschen", anchor: "pullman-city" },
          { text: "Baumwipfelpfad mit Erlebnisstationen", anchor: "baumwipfelpfad" },
          { text: "Tierfreigehege im Nationalpark – kostenlos", anchor: "nationalpark" },
          { text: "Rodelhang und Anfängerpisten am Steinberglift", anchor: "skigebiet-sonnenwald" },
        ],
      },
      {
        title: "Für Senioren & barrierearm",
        items: [
          { text: "Baumwipfelpfad: barrierearmer Holzsteg, kinderwagentauglich", anchor: "baumwipfelpfad" },
          { text: "Nationalpark-Besucherzentren mit Ausstellungen", anchor: "nationalpark" },
          { text: "Hallenbad & Saunawelt im elypso Deggendorf" },
        ],
      },
      {
        title: "Bei Regenwetter",
        items: [
          { text: "Indoor-Golf in der Rusel-Arena", anchor: "indoor-golf" },
          { text: "Ausstellungen im Hans-Eisenmann-Haus", anchor: "nationalpark" },
          { text: "Erlebnisbad elypso in Deggendorf" },
        ],
      },
      {
        title: "Im Winter",
        items: [
          { text: "Skifahren am Steinberglift", anchor: "skigebiet-sonnenwald" },
          { text: "Rodeln und Langlaufen", anchor: "skigebiet-sonnenwald" },
          { text: "Weihnachtsmärkte in der Region" },
        ],
      },
    ],
  },
  highlightsLabel: "Highlights",
  practicalLabel: "Praktische Infos",
  attractions: [
    {
      id: "pullman-city",
      tag: "Familie & Unterhaltung",
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
      name: "Steinberglift Langfurth",
      schemaName: "Steinberglift Langfurth (Schöfweg)",
      subtitle: "Familien-Skilift direkt am Haus Schönblick",
      distance: `direkt bei Haus Schönblick in Langfurth · ${ca(m.steinberglift.haus28)} von HAUS28`,
      fromHaus28: ca(m.steinberglift.haus28),
      fromSchoenblick: "direkt vor Ort",
      description:
        "Der Steinberglift in Langfurth bei Schöfweg liegt buchstäblich vor der Haustür von Haus Schönblick: eine 400 m lange Hauptpiste, dazu ein Kinderland mit Anfängerlift, Förderband und Übungshang sowie ein Rodelhang. Weitere Lifte gibt es am nahen Brotjacklriegel (1.011 m) – in Schöfweg sind es insgesamt sieben Liftanlagen – und rund 23 km gespurte Loipen in Schöfweg und Umgebung. Eine Live-Webcam zeigt den aktuellen Schneezustand – ideal zur Planung direkt aus der Unterkunft.",
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
        { label: "Livecam", value: "steinberglift.de" },
        { label: "Einkehr", value: "Stoaberg Alm direkt am Lift (neu seit September 2026)" },
        { label: "Tipp", value: "Schlittschuhlaufen in Grafenau als Alternative" },
      ],
    },
    {
      id: "indoor-golf",
      tag: "Sport & Spaß",
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
        activities: ["Skifahren am Steinberglift", "Rodeln & Langlaufen", "Weihnachtsmärkte", "Hallenbad & Sauna im elypso Deggendorf"],
      },
    ],
  },
  hike: {
    eyebrow: "Direkt ab HAUS28",
    heading: "Büchelstein-Rundwanderung",
    tableName: "Büchelstein-Rundwanderung",
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
          "Der Hauptgipfel und Höhepunkt der Tour. Bei klarem Wetter reicht das Panorama über den Bayerischen Wald bis ins Donautal – bei Föhn sogar bis zu den Alpen. Moosige Felsplatten am Gipfel: feste Schuhe lohnen sich.",
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
    mapStrong: "Wanderkarte & GPS:",
    mapText:
      " Die Runde findest du auf Outdooractive, Komoot und AllTrails unter „Büchelstein Grattersdorf“. Vor Ort einfach der roten Markierung Nr. 54 „Büchelsteiner-Runde“ folgen.",
    cta: "HAUS28 – direkt am Büchelstein buchen",
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
