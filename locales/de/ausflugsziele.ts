// Ausflugsziele-Seite (components/pages/AusflugszielePageContent.tsx).
// Nur Texte – Farben, Emojis und Links liegen in der Komponente.
const ausflugsziele = {
  breadcrumbHome: "Startseite",
  breadcrumbCurrent: "Ausflugsziele",
  hero: {
    eyebrow: "Region Bayerischer Wald",
    h1: "Ausflugsziele & Freizeitangebote",
    intro:
      "Rund um HAUS28 und Haus Schönblick wartet der Bayerische Wald mit einer Fülle an Erlebnissen – von wilder Natur über Westernflair bis zu modernsten Golfsimulationen. Hier findest du unsere persönlichen Empfehlungen für deinen Urlaub.",
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
          { text: "Wellness im Thermalbad Regen" },
        ],
      },
      {
        title: "Bei Regenwetter",
        items: [
          { text: "Indoor-Golf in der Rusel-Arena", anchor: "indoor-golf" },
          { text: "Ausstellungen im Hans-Eisenmann-Haus", anchor: "nationalpark" },
          { text: "Thermalbad Regen" },
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
      subtitle: "Europas größte Westernstadt",
      distance: "~15 min von Haus Schönblick · ~20 min von HAUS28",
      fromHaus28: "~20 min",
      fromSchoenblick: "~15 min",
      description:
        "Mitten im Bayerischen Wald taucht die Westernstadt Pullman City in Eging am See auf – Europas größtes Western-Erlebnisdorf. Auf über 80.000 m² warten täglich mehr als 30 Live-Shows, Ponyreiten, Wildwasserbahn, Goldwaschen, Indianerlager und authentische Western-Gastronomie. Ein echtes Highlight für Familien und alle, die den Wilden Westen erleben wollen – ohne die USA zu verlassen.",
      schemaDescription:
        "Europas größtes Western-Erlebnisdorf mit über 30 Shows täglich, Ponyreiten, Wildwasserbahn und authentischem Western-Flair.",
      highlights: [
        "30+ Live-Shows täglich",
        "Wildwasserbahn & Saloon",
        "Pferdeshow & Ponyreiten",
        "Goldwaschen für Kinder",
        "Übernachtung im Western-Camp möglich",
      ],
      practicalInfo: [
        { label: "Saison", value: "Mai – Oktober" },
        { label: "Anfahrt", value: "B85 Richtung Eging am See" },
        { label: "Tipp", value: "Kombi mit Baumwipfelpfad (gleiche Region)" },
      ],
    },
    {
      id: "baumwipfelpfad",
      tag: "Natur & Erlebnis",
      name: "Baumwipfelpfad Neuschönau",
      schemaName: "Baumwipfelpfad Neuschönau",
      subtitle: "Europas längster Baumwipfelpfad",
      distance: "~25 min von Haus Schönblick · ~30 min von HAUS28",
      fromHaus28: "~30 min",
      fromSchoenblick: "~25 min",
      description:
        "Der Baumwipfelpfad Neuschönau im Nationalpark Bayerischer Wald ist der längste seiner Art in Europa. 1.300 m barrierearmer Holzsteg führt durch die Baumkronen des Urwalds – bis zu 44 m über dem Boden. Am Ende erwartet ein 44 m hoher Aussichtsturm mit 360°-Panoramablick über den Nationalpark. Für Kinder gibt es spannende Erlebnisinseln und interaktive Stationen entlang des Weges.",
      schemaDescription:
        "Europas längster Baumwipfelpfad mit 1.300 m Länge und atemberaubenden Blicken über den Nationalpark Bayerischer Wald.",
      highlights: [
        "1.300 m Holzsteg in den Baumkronen",
        "44 m hoher Aussichtsturm",
        "Barrierefrei & kinderwagentauglich",
        "Interaktive Erlebnisstationen",
        "Direkt am Nationalpark-Tierfreigehege",
      ],
      practicalInfo: [
        { label: "Öffnung", value: "täglich, ganzjährig" },
        { label: "Eintritt", value: "Erwachsene ca. 11 €, Kinder ca. 8 €" },
        { label: "Tipp", value: "Kombi mit Tierfreigehege (nebenan, kostenlos)" },
      ],
    },
    {
      id: "nationalpark",
      tag: "Natur & Wandern",
      name: "Nationalpark Bayerischer Wald",
      schemaName: "Nationalpark Bayerischer Wald",
      subtitle: "Deutschlands ältester Nationalpark",
      distance: "~20 km von Haus Schönblick · ~25 km von HAUS28",
      fromHaus28: "~25 km",
      fromSchoenblick: "~20 km",
      description:
        "Seit 1970 ist der Bayerische Wald Deutschlands erster Nationalpark – 24.250 ha wilder, unberührter Natur, in der die Natur sich selbst überlassen bleibt. Das Besucherzentrum Hans-Eisenmann-Haus in Neuschönau und das Haus zur Wildnis in Ludwigsthal bieten spannende Ausstellungen. Im großen Tierfreigehege leben Luchse, Wölfe, Bären, Wisente und Hirsche in naturnahen Gehegen – kostenloser Eintritt.",
      schemaDescription:
        "Deutschlands ältester Nationalpark – 24.250 ha unberührte Natur mit Tierfreigehegen, Besucherzentrum und 300 km Wanderwegen.",
      highlights: [
        "Tierfreigehege: Luchs, Wolf, Bär, Bison (kostenlos)",
        "300 km markierte Wanderwege",
        "Ranger-Führungen & Naturprogramme",
        "Besucherzentrum mit interaktiven Ausstellungen",
        "Urwald – Natur ohne menschliche Eingriffe",
      ],
      practicalInfo: [
        { label: "Eintritt", value: "Tierfreigehege kostenlos" },
        { label: "Saison", value: "ganzjährig geöffnet" },
        { label: "Tipp", value: "Morgendliche Wanderungen für Wildtierbeobachtung" },
      ],
    },
    {
      id: "skigebiet-sonnenwald",
      tag: "Winter & Sport",
      name: "Skigebiet Sonnenwald / Steinberglift",
      schemaName: "Skigebiet Sonnenwald / Steinberglift",
      subtitle: "Familienski am Brotjacklriegel (1.011 m)",
      distance: "direkt bei Haus Schönblick in Langfurth · ~10 min von HAUS28",
      fromHaus28: "~10 min",
      fromSchoenblick: "direkt vor Ort",
      description:
        "Das Skigebiet Sonnenwald rund um den Steinberglift in Langfurth / Schöfweg liegt buchstäblich vor der Haustür von Haus Schönblick. Der Brotjacklriegel mit 1.011 m bietet familienfreundliche Abfahrten, einen beleuchteten Naturrodelhang und gut präparierte Langlaufloipen. Eine Live-Webcam zeigt den aktuellen Schneezustand – ideal zur Planung direkt aus der Unterkunft.",
      schemaDescription:
        "Familienfreundliches Skigebiet mit 4 Liften am Brotjacklriegel (1.011 m), Langlaufloipen und Live-Webcam.",
      highlights: [
        "Steinberglift & Brotjacklriegellift",
        "Beleuchteter Naturrodelhang",
        "Langlaufloipen direkt nebenan",
        "Live-Webcam für Schneekontrolle",
        "Familien- & anfängerfreundlich",
      ],
      practicalInfo: [
        { label: "Saison", value: "Dezember – März (schneeabhängig)" },
        { label: "Livecam", value: "steinberglift.de" },
        { label: "Tipp", value: "Schlittschuhlaufen in Grafenau als Alternative" },
      ],
    },
    {
      id: "indoor-golf",
      tag: "Sport & Spaß",
      name: "Rusel-Arena Indoor Golf",
      schemaName: "Rusel-Arena Indoor Golf",
      subtitle: "6 TrackMan-Simulatoren am Golfplatz Rusel",
      distance: "~25 min von HAUS28 & Haus Schönblick",
      fromHaus28: "~25 min",
      fromSchoenblick: "~25 min",
      description:
        "Die brandneue Rusel-Arena am Golfplatz Deggendorf-Rusel ist das modernste Indoor-Golf-Erlebnis im Bayerischen Wald. Auf 370 m² stehen 6 TrackMan-Simulationsstationen bereit – mit präziser Schlaganalyse und virtuellen Golferlebnissen auf über 100 weltberühmten Plätzen. Anfänger, Fortgeschrittene und Profis sind gleichermaßen willkommen, witterungsunabhängig das ganze Jahr.",
      schemaDescription: "370 m² Indoor-Golfsimulator mit 6 TrackMan-Stationen am Golfplatz Rusel bei Deggendorf.",
      highlights: [
        "6 TrackMan-Simulationsstationen",
        "370 m² Indoor-Anlage",
        "Über 100 virtuelle Golfplätze weltweit",
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
        activities: ["Skifahren am Steinberglift", "Rodeln & Langlaufen", "Weihnachtsmärkte", "Wellness & Thermalbad Regen"],
      },
    ],
  },
  hike: {
    eyebrow: "Direkt ab HAUS28",
    heading: "Büchelstein-Rundwanderung",
    tableName: "Büchelstein-Rundwanderung",
    schemaName: "Büchelstein Wanderroute ab HAUS28",
    schemaDescription:
      "Rundwanderung vom HAUS28 über die Wallfahrtskapelle Rastbuche (18. Jh.) bei Grattersdorf, Kleiner Büchelstein zum Großen Büchelstein (831 m) und zurück – mit Blicken ins Donautal.",
    intro:
      "Die schönste Wanderung ab HAUS28 führt direkt vom Haus auf den Großen Büchelstein (831 m) – vorbei an der historischen Wallfahrtskapelle Rastbuche, dem Kleinen Büchelstein und durch dichten Bayerwald-Forst. Die Rundtour ist gut markiert, für geübte Familien geeignet und belohnt mit einem herrlichen Panoramablick über den Bayerischen Wald bis ins Donautal.",
    stats: [
      { label: "Startpunkt", value: "HAUS28, Büchelstein 28" },
      { label: "Gipfel", value: "831 m (Großer Büchelstein)" },
      { label: "Charakter", value: "Rundweg, gut markiert" },
      { label: "Schwierigkeit", value: "Mittel – Familien geeignet" },
    ],
    waypoints: [
      {
        name: "Start: HAUS28",
        detail: "Büchelstein 28, Grattersdorf – direkt am Haus beginnt der Wanderweg in den Wald.",
      },
      {
        name: "Wallfahrtskapelle Rastbuche",
        detail:
          "Die malerische Wallfahrtskapelle Rastbuche bei Grattersdorf stammt aus dem 18. Jahrhundert und liegt idyllisch nahe dem Büchelstein. Sie ist ein bekanntes Ziel auf regionalen Wanderwegen – darunter die \"Rastbuchen-Runde\" (Nr. 52) – und bietet bei klarer Sicht beeindruckende Ausblicke ins Donautal.",
      },
      {
        name: "Kleiner Büchelstein",
        detail: "Der erste Gipfelpunkt der Tour. Schöner Ausblick ins Tal und in die bewaldeten Hügel des Bayerischen Waldes.",
      },
      {
        name: "Großer Büchelstein (831 m)",
        detail:
          "Der Hauptgipfel und Höhepunkt der Tour. Auf 831 m Höhe erwartet dich bei klarem Wetter ein herrliches Panorama über den Bayerischen Wald – manchmal bis zu den Alpen.",
      },
      {
        name: "Rückweg zu HAUS28",
        detail:
          "Der Abstieg führt auf einem anderen Pfad zurück zum Ausgangspunkt – die Schleife macht die Tour abwechslungsreich ohne Streckenwiederholung.",
      },
    ],
    mapStrong: "Wanderkarte & GPS:",
    mapText:
      " Die Tour ist auf Komoot und AllTrails unter dem Suchbegriff „Büchelstein Grattersdorf\" verfügbar. Alternativ einfach der Wanderweg-Beschilderung ab HAUS28 folgen – oder die Rastbuchen-Runde (Nr. 52) nutzen.",
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
