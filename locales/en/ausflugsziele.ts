import type de from "../de/ausflugsziele";
import { ca as caRaw, driveMinutes as m } from "@/data/surroundings";

// Keep "~30 min" on one line (non-breaking space between number and unit)
const ca = (minutes: number) => caRaw(minutes).replace(/ /g, " ");

// Things to do page (components/pages/AusflugszielePageContent.tsx).
const ausflugsziele: typeof de = {
  breadcrumbHome: "Home",
  breadcrumbCurrent: "Things to do",
  hero: {
    eyebrow: "Bavarian Forest region",
    h1: "Things to Do in the Bavarian Forest",
    intro:
      "From the hiking trail at the front door to a day trip into the national park – sorted by driving time from HAUS28 and Haus Schönblick. Tap a destination for all the details.",
    pillHaus28: "HAUS28 · Grattersdorf",
    pillSchoenblick: "Haus Schönblick · Schöfweg",
  },
  overview: {
    heading: "More to experience in the Bavarian Forest",
  },
  filter: {
    legend: "Filter things to do",
    alle: "All",
    kinder: "With kids",
    regen: "Rainy day",
    winter: "In winter",
    essen: "Eating out",
  },
  // {von}/{bis} are filled in by the component from data/surroundings.ts
  groups: {
    naehe: { heading: "On the doorstep", note: "on foot or up to 10 min", hint: "" },
    nah: { heading: "Close by", note: "{von}–{bis} min by car", hint: "" },
    weiter: {
      heading: "A little further",
      note: "{von}–{bis} min by car",
      hint: "The Treetop Walk and the animal enclosure are both at the Lusen national park centre – easy to combine in one day. For a day all about glass, pair the Frauenau Glass Museum with JOSKA.",
    },
  },
  restaurants: {
    heading: "Inns and restaurants nearby",
    intro:
      "After a day out or just for dinner: our tips for Bavarian and regional food, all only a few minutes from the houses.",
    websiteLabel: "Website",
  },
  distanceTable: {
    heading: "Driving distances",
    summary: "All driving times as a table",
    colDestination: "Destination",
    colHaus28: "from HAUS28",
    colSchoenblick: "from Haus Schönblick",
  },
  leiste: {
    zuFuss: "on foot",
    min: "min",
  },
  gutZuWissen: "Good to know",
  highlightsLabel: "Highlights",
  practicalLabel: "Good to know",
  photoLabel: "Photo",
  officialWebsiteLabel: "Official website",
  newTabHint: "(opens in a new tab)",
  webcam: {
    caption: "Live webcam at the Steinberglift",
    linkLabel: "Webcam: Steinberglift – open the webcam page",
    fallback: "Webcam currently unavailable – see the live image at steinberglift.de",
  },
  attractions: [
    {
      id: "pullman-city",
      tag: "Family & fun",
      cardTags: ["Kids", "Family"],
      name: "Pullman City",
      schemaName: "Pullman City – Western town in Eging am See",
      subtitle: "Western town in Eging am See – since 1997",
      distance: `${ca(m.pullmanCity.haus28)} from HAUS28 & Haus Schönblick`,
      fromHaus28: ca(m.pullmanCity.haus28),
      fromSchoenblick: ca(m.pullmanCity.schoenblick),
      description:
        "On the southern edge of the Bavarian Forest, the Western town of Pullman City in Eging am See has been open since 1997 and covers around 200,000 m². There are Western shows, pony rides, gold panning, the El Dorado water playground with a slide, a small-animal enclosure and Western food. A real highlight for families and anyone who wants to experience the Wild West without leaving Europe.",
      schemaDescription:
        "Western town of around 200,000 m² with Western shows, pony rides, gold panning and a water playground.",
      highlights: [
        "Changing show programme",
        "El Dorado water playground with slide",
        "Horse show & pony rides",
        "Gold panning for kids",
        "Overnight stays in hotels, log cabins or tipis",
      ],
      practicalInfo: [
        { label: "Season", value: "from March, Christmas programme in winter – not open every day, see the calendar at pullmancity.de" },
        { label: "Address", value: "Ruberting 30, 94535 Eging am See" },
        { label: "Tip", value: "Plan a whole day and check the show times in the daily programme" },
      ],
    },
    {
      id: "baumwipfelpfad",
      tag: "Nature & adventure",
      cardTags: ["Nature", "Kids", "Step-free"],
      name: "Treetop Walk Neuschönau",
      schemaName: "Treetop Walk Neuschönau (Baumwipfelpfad)",
      subtitle: "One of the longest treetop walks in Europe",
      distance: `${ca(m.nationalparkLusen.schoenblick)} from Haus Schönblick · ${ca(m.nationalparkLusen.haus28)} from HAUS28`,
      fromHaus28: ca(m.nationalparkLusen.haus28),
      fromSchoenblick: ca(m.nationalparkLusen.schoenblick),
      description:
        "At 1,300 m, the Treetop Walk in Neuschönau, inside the Bavarian Forest National Park, is one of the longest in Europe. The low-barrier wooden boardwalk (max. 6% gradient) runs 8 to 25 m above the ground through the treetops. The highlight is the 44 m observation tower, the \"Baumei\" (tree egg), with all-round views across the national park. Along the way, children will find adventure stations.",
      schemaDescription:
        "One of the longest treetop walks in Europe: a 1,300 m boardwalk 8–25 m above the ground and a 44 m observation tower in the Bavarian Forest National Park.",
      highlights: [
        "1,300 m boardwalk, 8–25 m above the ground",
        "44 m \"Baumei\" observation tower",
        "Low-barrier, suitable for prams & wheelchairs",
        "Adventure stations for kids",
        "Right next to the national park animal enclosure",
      ],
      practicalInfo: [
        { label: "Opening", value: "all year round, not every day in winter – times at treetop-walks.com" },
        { label: "Admission", value: "adults €13, children 6–14 €11, under 6 free, family €31 (2026)" },
        { label: "Tip", value: "Combine with the animal enclosure (next door, free)" },
      ],
    },
    {
      id: "nationalpark",
      tag: "Nature & hiking",
      cardTags: ["Nature", "Kids"],
      name: "Bavarian Forest National Park",
      schemaName: "Bavarian Forest National Park",
      subtitle: "Germany's oldest national park",
      distance: `${ca(m.nationalparkLusen.schoenblick)} from Haus Schönblick · ${ca(m.nationalparkLusen.haus28)} from HAUS28 (Lusen National Park Centre)`,
      fromHaus28: ca(m.nationalparkLusen.haus28),
      fromSchoenblick: ca(m.nationalparkLusen.schoenblick),
      description:
        "Since 1970, the Bavarian Forest has been Germany's first national park – today 24,945 hectares where nature is left to its own devices. The Hans-Eisenmann-Haus visitor centre in Neuschönau and the Haus zur Wildnis in Ludwigsthal offer fascinating exhibitions. In the animal enclosure, lynx, wolves, bears, European bison and otters live in near-natural surroundings – admission is free.",
      schemaDescription:
        "Germany's oldest national park – 24,945 ha of wilderness with an animal enclosure, visitor centres and around 350 km of hiking trails.",
      highlights: [
        "Animal enclosure: lynx, wolf, bear, European bison (free)",
        "Around 350 km of marked hiking trails",
        "Ranger tours & nature programmes",
        "Visitor centre with interactive exhibitions",
        "Primeval forest – nature without human intervention",
      ],
      practicalInfo: [
        { label: "Admission", value: "animal enclosure free, paid parking" },
        { label: "Season", value: "open all year; the visitor centre closes for a few weeks in late autumn" },
        { label: "Tip", value: "Early-morning hikes for spotting wildlife" },
      ],
    },
    {
      id: "skigebiet-sonnenwald",
      tag: "Winter & sport",
      cardTags: ["Winter", "Kids"],
      name: "Steinberglift Langfurth",
      schemaName: "Steinberglift Langfurth (Schöfweg)",
      subtitle: "Family ski lift right by Haus Schönblick",
      distance: `right at Haus Schönblick in Langfurth · ${ca(m.steinberglift.haus28)} from HAUS28`,
      fromHaus28: ca(m.steinberglift.haus28),
      fromSchoenblick: "on foot (approx. 600 m)",
      description:
        "The Steinberglift in Langfurth near Schöfweg is literally on Haus Schönblick's doorstep: a 400 m main slope plus a kids' area with a beginner lift, a magic carpet and a practice slope, and a toboggan hill. There are more lifts on the nearby Brotjacklriegel (1,011 m) – seven lift facilities in Schöfweg altogether – and around 23 km of groomed cross-country trails in and around Schöfweg. The live webcam shows the current snow conditions – perfect for planning your day from the apartment.",
      schemaDescription:
        "Family-friendly ski lift in Langfurth near Schöfweg with a 400 m slope, kids' area, toboggan hill and live webcam.",
      highlights: [
        "400 m main slope & kids' area",
        "Toboggan hill",
        "Around 23 km of cross-country trails nearby",
        "Live webcam to check the snow",
        "Great for families & beginners",
      ],
      practicalInfo: [
        { label: "Season", value: "winter, snow permitting (with snowmaking)" },
        { label: "Food", value: "Stoaberg Alm right at the lift (new since September 2026)" },
        { label: "Tip", value: "Ice skating in Grafenau as an alternative" },
      ],
    },
    {
      id: "indoor-golf",
      tag: "Sport & fun",
      cardTags: ["Rainy days"],
      name: "Rusel-Arena indoor golf",
      schemaName: "Rusel-Arena indoor golf",
      subtitle: "6 TrackMan simulators at Rusel golf course",
      distance: `${ca(m.ruselArena.haus28)} from HAUS28 & Haus Schönblick`,
      fromHaus28: ca(m.ruselArena.haus28),
      fromSchoenblick: ca(m.ruselArena.schoenblick),
      description:
        "Since late 2024, the Rusel-Arena at the Deggendorf-Rusel golf course has offered six TrackMan simulator bays across 370 m², with precise shot analysis and more than 200 international courses to choose from. Beginners, improvers and pros are all welcome – whatever the weather, all year round.",
      schemaDescription: "370 m² indoor golf simulator with 6 TrackMan bays at the Rusel golf course near Deggendorf.",
      highlights: [
        "6 TrackMan simulator bays",
        "370 m² indoor facility",
        "More than 200 international courses",
        "Precise shot analysis",
        "All year round, whatever the weather",
      ],
      practicalInfo: [
        { label: "Price", value: "from €44 / 55 min / bay" },
        { label: "Booking", value: "online at arena.deggendorfer-golfclub.de" },
        { label: "Tip", value: "A great group activity for non-golfers too" },
      ],
    },
    {
      id: "elypso",
      tag: "Pools & wellness",
      cardTags: ["Rainy days", "Kids", "Winter"],
      name: "elypso Deggendorf",
      schemaName: "elypso leisure pool Deggendorf",
      subtitle: "Leisure pool and sauna world in Deggendorf",
      distance: `${ca(m.elypso.haus28)} from HAUS28 & Haus Schönblick`,
      fromHaus28: ca(m.elypso.haus28),
      fromSchoenblick: ca(m.elypso.schoenblick),
      description:
        "The elypso in Deggendorf is the region's big leisure and adventure pool: the indoor pool world offers a sports pool, a multi-pool with a current channel, the wellness lagoon with pool bar and whirlpool, plus a kids' area with slides. The sauna world has several themed saunas with infusions, a sauna garden and a natural bathing pond. In summer the outdoor pool with its sandy beach opens too. The reliable plan for rainy days – and the perfect warm-up after a day on the slopes.",
      schemaDescription:
        "Leisure and adventure pool in Deggendorf with pool world, themed sauna world and a summer outdoor pool.",
      highlights: [
        "Sports pool & multi-pool with current channel",
        "Wellness lagoon with pool bar & whirlpool",
        "Sauna world with themed saunas & natural bathing pond",
        "Kids' area & slides",
        "Outdoor pool with sandy beach in summer",
      ],
      practicalInfo: [
        { label: "Opening", value: "pool and sauna world all year round, outdoor pool mid-May to mid-September – times at elypso.de" },
        { label: "Admission", value: "current prices at elypso.de · sauna world without an accompanying adult from age 16" },
        { label: "Address", value: "Sandnerhofweg 4–6, 94469 Deggendorf" },
      ],
    },
    {
      id: "joska",
      tag: "Glass & craft",
      cardTags: ["Rainy days", "Kids"],
      name: "JOSKA Glasparadies",
      schemaName: "JOSKA Glasparadies Bodenmais",
      subtitle: "Hands-on glassmaking tradition in Bodenmais",
      distance: `${ca(m.joska.schoenblick)} from Haus Schönblick · ${ca(m.joska.haus28)} from HAUS28`,
      fromHaus28: ca(m.joska.haus28),
      fromSchoenblick: ca(m.joska.schoenblick),
      description:
        "At the JOSKA Glasparadies in Bodenmais you can experience the Bavarian Forest's glassmaking tradition up close: in the glassworks you watch the glassmakers at work – visiting is free and needs no booking – and can even blow your own piece of glass under guidance. There's also the large glass and decoration world with a shop, the crystal gardens and a big adventure playground, plus the Erlebnisrestaurant, the JOSKA beer garden and Café Kristallino. Ideal as a half-day trip, rain or shine.",
      schemaDescription:
        "Glass experience world in Bodenmais with a glassworks (free to visit, no booking needed), hands-on glassblowing, shop and restaurants.",
      highlights: [
        "Glassworks: watch the glassmakers live – free, no booking needed",
        "Hands-on glassblowing – make your own piece",
        "Crystal gardens & big adventure playground",
        "Large glass & decoration world with shop",
        "Erlebnisrestaurant, JOSKA beer garden & Café Kristallino",
      ],
      practicalInfo: [
        { label: "Opening", value: "all year round, including Sundays & holidays – times at joska.com" },
        { label: "Admission", value: "glassworks free to visit, no booking needed; visitor glassblowing see joska.com" },
        { label: "Address", value: "Am Moosbach 1, 94249 Bodenmais" },
      ],
    },
    {
      id: "arber",
      tag: "Mountain & winter",
      cardTags: ["Winter", "Nature", "Step-free"],
      name: "Großer Arber",
      schemaName: "Großer Arber with the Arber cable car and the Großer Arbersee lake",
      subtitle: "1,456 m – the \"King of the Bavarian Forest\"",
      distance: `${ca(m.arber.haus28)} from HAUS28 & Haus Schönblick`,
      fromHaus28: ca(m.arber.haus28),
      fromSchoenblick: ca(m.arber.schoenblick),
      description:
        "At 1,456 metres, the Großer Arber is the highest mountain of the Bavarian-Bohemian massif – no wonder it's called the \"King of the Bavarian Forest\". The gondola takes you comfortably and step-free to the summit, where the paths are wide enough for wheelchairs and walking aids. In winter the Arber becomes a ski area with toboggan runs, ski touring and winter hiking. The Arber also includes the Großer Arbersee lake with the step-free Arberseehaus, pedal-boat hire and a forest marble run.",
      schemaDescription:
        "Highest mountain of the Bavarian-Bohemian massif (1,456 m) with a step-free gondola, a ski area in winter and the Großer Arbersee lake.",
      highlights: [
        "Gondola comfortably & step-free to the summit",
        "Summit paths wide enough for wheelchairs & walking aids",
        "Winter: ski area, toboggan runs, ski touring, winter hiking",
        "Ski & snowboard hire",
        "Großer Arbersee: pedal boats, forest marble run, step-free Arberseehaus",
      ],
      practicalInfo: [
        { label: "Season", value: "Summer: gondola & hiking · winter: skiing & tobogganing – operating times and prices at arber.de" },
        { label: "Getting there", value: "to the valley station of the Arber cable car" },
        { label: "Tip", value: "Combine the summit and the Arbersee in one day" },
      ],
    },
    {
      id: "passau",
      tag: "City & culture",
      cardTags: ["Rainy days", "Culture"],
      name: "Passau",
      schemaName: "Passau – city of three rivers with St. Stephen's Cathedral",
      subtitle: "City of three rivers on the Danube, Inn and Ilz",
      distance: `${ca(m.passau.haus28)} from HAUS28 · ${ca(m.passau.schoenblick)} from Haus Schönblick`,
      fromHaus28: ca(m.passau.haus28),
      fromSchoenblick: ca(m.passau.schoenblick),
      description:
        "In Passau, three rivers from three directions meet at the Dreiflüsseeck: the Danube, the Inn and the Ilz. St. Stephen's Cathedral, with its white towers and blue-green domes, was designed after the town fire of 1662 by Carlo Lurago and Giovanni Battista Carlone. The city calls its organ the largest cathedral organ in the world – with 17,974 pipes and 233 stops; from May to October there is a midday concert at 12 noon on weekdays. Add the Veste Oberhaus fortress with the Oberhausmuseum and boat trips on the rivers. A city day that works in the rain too.",
      schemaDescription:
        "City of three rivers on the Danube, Inn and Ilz with St. Stephen's Cathedral (organ with 17,974 pipes and 233 stops), the Veste Oberhaus fortress and the Oberhausmuseum.",
      highlights: [
        "Dreiflüsseeck: Danube, Inn & Ilz",
        "St. Stephen's Cathedral – designed after the town fire of 1662",
        "Cathedral organ with 17,974 pipes & 233 stops",
        "Veste Oberhaus fortress with the Oberhausmuseum",
        "Boat trips on the rivers",
      ],
      practicalInfo: [
        { label: "Organ concerts", value: "May–October weekdays at 12 noon (midday concert adults €6, 2026), plus once a month on Thursdays at 7.30 p.m.; in Advent Wed–Sat at 12 noon" },
        { label: "Driving time", value: "calculated to the old town (Rathausplatz)" },
        { label: "Tip", value: "Cathedral and Oberhausmuseum when it rains, a boat trip when the sun's out" },
      ],
    },
    {
      id: "museumsdorf",
      tag: "Open-air museum",
      cardTags: ["Kids", "Culture"],
      name: "Bavarian Forest Museum Village",
      schemaName: "Museumsdorf Bayerischer Wald – Bavarian Forest Museum Village (Tittling)",
      subtitle: "Open-air museum on the Dreiburgensee near Tittling",
      distance: `${ca(m.museumsdorf.schoenblick)} from Haus Schönblick · ${ca(m.museumsdorf.haus28)} from HAUS28`,
      fromHaus28: ca(m.museumsdorf.haus28),
      fromSchoenblick: ca(m.museumsdorf.schoenblick),
      description:
        "At the Museumsdorf Bayerischer Wald near Tittling, more than 150 buildings dating from 1580 to 1850 stand on 25 hectares – right on the Dreiburgensee lake. There's also a folklore collection of 60,000 objects. In the summer half of the year the ticket office and additional houses are open Wednesday to Sunday; in the winter half you can still take a walk around the grounds.",
      schemaDescription:
        "Open-air museum on the Dreiburgensee near Tittling: more than 150 buildings from 1580 to 1850 on 25 ha, folklore collection of 60,000 objects.",
      highlights: [
        "More than 150 buildings dating from 1580 to 1850",
        "25 hectares of grounds on the Dreiburgensee",
        "Folklore collection of 60,000 objects",
        "Children up to 6 free when accompanied",
      ],
      practicalInfo: [
        { label: "Season", value: "Summer half-year Wed–Sun 10 a.m.–5 p.m., public holidays too; Mon/Tue 10 a.m.–5 p.m. entry via turnstile (reduced €3, coins); winter half-year 1 November 2026 to Easter 2027 walks possible, turnstile 10 a.m.–4 p.m." },
        { label: "Admission", value: "adults €8, children up to 6 free when accompanied (2026)" },
        { label: "Note", value: "The Mühlhiasl inn is temporarily closed due to a change of tenant (autumn 2026)" },
      ],
    },
    {
      id: "glasmuseum-frauenau",
      tag: "Glass & art",
      cardTags: ["Rainy days", "Kids"],
      name: "Frauenau Glass Museum",
      schemaName: "Glasmuseum Frauenau (Frauenau Glass Museum) with the Glass Gardens",
      subtitle: "A journey with glass from antiquity to the present",
      distance: `${ca(m.glasmuseumFrauenau.schoenblick)} from Haus Schönblick · ${ca(m.glasmuseumFrauenau.haus28)} from HAUS28`,
      fromHaus28: ca(m.glasmuseumFrauenau.haus28),
      fromSchoenblick: ca(m.glasmuseumFrauenau.schoenblick),
      description:
        "The Glasmuseum Frauenau takes you on a journey with glass from antiquity to the present day. In front of the museum, looking out onto the parish church, lie the Glass Gardens: their centrepiece is the Glass Ark, more than 30 large glass sculptures stand there in total, and the gardens continue at the Eisch glassworks and in the Moosau artists' quarter. The park also has a large adventure playground – museum inside, playground outside.",
      schemaDescription:
        "Museum of glass history from antiquity to the present with the Glass Gardens (more than 30 large glass sculptures) and a large adventure playground.",
      highlights: [
        "Glass history from antiquity to the present",
        "Glass Gardens with more than 30 large glass sculptures",
        "The Glass Ark at the heart of the gardens",
        "Large adventure playground in the park",
      ],
      practicalInfo: [
        { label: "Opening", value: "Tue–Sun and public holidays 9 a.m.–5 p.m., closed on Mondays" },
        { label: "Admission", value: "current prices at glasmuseum-frauenau.de" },
        { label: "Tip", value: "Combine with the JOSKA Glasparadies in Bodenmais for a day all about glass" },
      ],
    },
  ],
  seasons: {
    eyebrow: "When to go?",
    heading: "The Bavarian Forest – worth a trip in every season",
    items: [
      {
        season: "Spring",
        months: "March – May",
        activities: ["Hiking as the trails thaw", "Wildflowers & birdwatching", "Peace before the summer rush", "Easter markets in Grafenau"],
      },
      {
        season: "Summer",
        months: "June – August",
        activities: ["Pullman City & the Treetop Walk", "Büchelstein hike", "Swimming lakes in the region", "Mountain biking & cycling"],
      },
      {
        season: "Autumn",
        months: "September – November",
        activities: ["Autumn colours in the forest", "Mushroom picking (where permitted)", "Quiet hikes", "Indoor golf at the Rusel-Arena"],
      },
      {
        season: "Winter",
        months: "December – February",
        activities: ["Skiing at the Steinberglift", "Ski area & toboggan runs at the Großer Arber", "Tobogganing & cross-country skiing", "Christmas markets", "Indoor pool & sauna at elypso Deggendorf"],
      },
    ],
  },
  hike: {
    eyebrow: "Straight from HAUS28",
    heading: "Büchelstein circular hike",
    tableName: "Büchelstein circular hike",
    cardTags: ["Nature", "Hiking", "Kids"],
    cardNote: "Starts right at HAUS28's front door",
    schemaName: "Büchelstein hiking route from HAUS28",
    schemaDescription:
      "Circular hike straight from HAUS28 on trail no. 54 \"Büchelsteiner-Runde\": Großer Büchelstein (831 m), Kleiner Büchelstein and the 18th-century Rastbuche pilgrimage chapel – approx. 7 km, with views into the Danube valley.",
    intro:
      "The most beautiful hike from HAUS28 leads up to the Großer Büchelstein (831 m) – over the Kleiner Büchelstein, past the historic Rastbuche pilgrimage chapel and through dense Bavarian forest. Circular trail no. 54 is waymarked in red, suitable for active families and rewards you with sweeping views over the Bavarian Forest all the way to the Danube valley.",
    stats: [
      { label: "Start", value: "straight from HAUS28, Büchelstein 28" },
      { label: "Route", value: "approx. 7 km · 2–2.5 h · approx. 300 m ascent" },
      { label: "Summit", value: "831 m (Großer Büchelstein)" },
      { label: "Waymark", value: "No. 54 \"Büchelsteiner-Runde\" (red)" },
      { label: "Difficulty", value: "Moderate – sturdy hiking boots recommended" },
    ],
    waypoints: [
      {
        name: "Start: HAUS28",
        detail: "You set off right from the front door, into the forest and up towards the Büchelstein. Along the way, the red waymark no. 54 shows you the route.",
      },
      {
        name: "Großer Büchelstein (831 m)",
        detail:
          "The main summit and highlight of the hike. From the hang-glider ramp at the top, on a clear day the panorama stretches across the Bavarian Forest to the Danube valley – and when the föhn blows, all the way to the Alps. The rock slabs at the top can be mossy, so sturdy shoes are worth it.",
      },
      {
        name: "Kleiner Büchelstein",
        detail: "The second summit of the loop, with lovely views into the valley and across the wooded hills of the Bavarian Forest.",
      },
      {
        name: "Rastbuche pilgrimage chapel",
        detail:
          "The Rastbuche pilgrimage chapel near Grattersdorf dates from the 18th century and is a listed monument. On clear days the view reaches far into the Danube valley.",
      },
      {
        name: "Back to HAUS28",
        detail:
          "The loop returns via Kerschbaum to the house – no stretch walked twice.",
      },
    ],
    routeSummary: "Route & waypoints",
    mapStrong: "Map & GPS:",
    mapText:
      " You'll find the loop on Outdooractive, Komoot and AllTrails by searching for \"Büchelstein Grattersdorf\". On the ground, simply follow the red waymark no. 54 \"Büchelsteiner-Runde\".",
    cta: "Book HAUS28 – right at the Büchelstein",
  },
  brotjacklriegel: {
    heading: "Brotjacklriegel (1,011\u00a0m)",
    cardTags: ["Nature", "Hiking", "Kids"],
    cardNote: "On foot from Haus Schönblick via the Langfurth tower trail",
    schemaName: "Hike up the Brotjacklriegel from Haus Schönblick",
    schemaDescription:
      "Hike up the Brotjacklriegel (1,011 m), the local mountain of the Sonnenwald region: Langfurth – Brotjacklriegel tower trail, 1.6 km, easy, approx. 45 minutes; start approx. 400 m from Haus Schönblick.",
    intro:
      "The Brotjacklriegel (1,011 m) is the distinctive local mountain of the Sonnenwald region – and you can walk there from Haus Schönblick: after about 400 m you reach Langfurth, where the tower trail up to the summit begins, an easy 1.6 km path. The trail leads along the Sonnenwald nature trail, a forest experience with ten stations – especially for children and families. At the top are the observation tower of the Bayerischer Waldverein and the Turmstüberl inn.",
    notice: "According to the Sonnenwald tourist association, the tower's viewing platform is currently closed for fire-safety reasons; work on reopening it is under way (as of October 2026).",
    stats: [
      { label: "Start", value: "Langfurth, approx. 400 m on foot from Haus Schönblick" },
      { label: "Langfurth tower trail", value: "1.6 km · approx. 45 min · easy" },
      { label: "Summit", value: "1,011 m" },
      { label: "Long loop", value: "Brotjacklriegel circular trail, approx. 12 km · approx. 4.5 h · easy" },
      { label: "Nature trail", value: "Sonnenwald nature trail: ten stations, especially for children & families – the tower trails from Langfurth and from Mitterdorf / Schöfweg lead along it" },
      { label: "Turmstüberl", value: "in good hiking weather daily until 8 November 2026 (closed Thursdays) · 24 Dec 2026 – 10 Jan 2027 daily 10 a.m.–5 p.m. · from 16 Jan 2027 Sat & Sun" },
      { label: "From HAUS28", value: "approx. 10 min by car; parking at Langfurth 55 (by the fire station) or the Daxstein hikers' car park" },
    ],
    moreRoutesHeading: "Other tower trails to the summit",
    moreRoutes: [
      { name: "From Ölberg", detail: "1.6 km · approx. 1 h 10 min" },
      { name: "From Daxstein", detail: "1.8 km · approx. 55 min · difficult" },
      { name: "From Mitterdorf/Schöfweg", detail: "4.4 km · approx. 1 h 30 min · easy" },
    ],
    cta: "Haus Schönblick – walk to the Brotjacklriegel",
  },
  cta: {
    eyebrow: "Your base",
    heading: "Every destination right on your doorstep",
    text:
      "HAUS28 at the Büchelstein and Haus Schönblick in Schöfweg sit in the heart of the Bavarian Forest – the perfect base for every trip on this page. Book direct and save up to 20% compared with booking platforms.",
    haus28: "Discover HAUS28",
    schoenblick: "Discover Haus Schönblick",
  },
  schemaListName: "Things to do in the Bavarian Forest",
  schemaListDescription: "The best things to do around HAUS28 and Haus Schönblick in the Bavarian Forest",
};

export default ausflugsziele;
