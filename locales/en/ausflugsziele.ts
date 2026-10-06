import type de from "../de/ausflugsziele";
import { ca, driveMinutes as m } from "@/data/surroundings";

// Things to do page (components/pages/AusflugszielePageContent.tsx).
const ausflugsziele: typeof de = {
  breadcrumbHome: "Home",
  breadcrumbCurrent: "Things to do",
  hero: {
    eyebrow: "Bavarian Forest region",
    h1: "Things to Do in the Bavarian Forest",
    intro:
      "Around HAUS28 and Haus Schönblick, the Bavarian Forest is full of things to experience – from wild nature and Wild West flair to golf simulators for rainy days. Here are our personal recommendations for your stay.",
    pillHaus28: "HAUS28 · Grattersdorf",
    pillSchoenblick: "Haus Schönblick · Schöfweg",
  },
  quickLinks: {
    "pullman-city": "Pullman City",
    baumwipfelpfad: "Treetop Walk",
    nationalpark: "National Park",
    "skigebiet-sonnenwald": "Ski area",
    "indoor-golf": "Indoor golf",
    "buechelstein-wanderung": "Büchelstein hike",
  },
  overview: {
    ariaLabel: "Overview of things to do",
    eyebrow: "All seasons",
    heading: "More to experience in the Bavarian Forest",
    intro: "From Wild West flair to skiing and indoor golf – there's something for every weather and every group.",
  },
  distanceTable: {
    heading: "Driving distances",
    colDestination: "Destination",
    colHaus28: "from HAUS28",
    colSchoenblick: "from Haus Schönblick",
  },
  audiences: {
    heading: "Which trip suits whom?",
    groups: [
      {
        title: "With children",
        items: [
          { text: "Pullman City: shows, pony rides, gold panning", anchor: "pullman-city" },
          { text: "Treetop Walk with adventure stations", anchor: "baumwipfelpfad" },
          { text: "National park animal enclosure – free", anchor: "nationalpark" },
          { text: "Toboggan run and beginner slopes at the Steinberglift", anchor: "skigebiet-sonnenwald" },
        ],
      },
      {
        title: "For seniors & step-free",
        items: [
          { text: "Treetop Walk: low-barrier boardwalk, pram-friendly", anchor: "baumwipfelpfad" },
          { text: "National park visitor centres with exhibitions", anchor: "nationalpark" },
          { text: "Indoor pool & sauna world at elypso in Deggendorf" },
        ],
      },
      {
        title: "On rainy days",
        items: [
          { text: "Indoor golf at the Rusel-Arena", anchor: "indoor-golf" },
          { text: "Exhibitions at the Hans-Eisenmann-Haus", anchor: "nationalpark" },
          { text: "elypso leisure pool in Deggendorf" },
        ],
      },
      {
        title: "In winter",
        items: [
          { text: "Skiing at the Steinberglift", anchor: "skigebiet-sonnenwald" },
          { text: "Tobogganing and cross-country skiing", anchor: "skigebiet-sonnenwald" },
          { text: "Christmas markets in the region" },
        ],
      },
    ],
  },
  highlightsLabel: "Highlights",
  practicalLabel: "Good to know",
  attractions: [
    {
      id: "pullman-city",
      tag: "Family & fun",
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
      name: "Steinberglift Langfurth",
      schemaName: "Steinberglift Langfurth (Schöfweg)",
      subtitle: "Family ski lift right by Haus Schönblick",
      distance: `right at Haus Schönblick in Langfurth · ${ca(m.steinberglift.haus28)} from HAUS28`,
      fromHaus28: ca(m.steinberglift.haus28),
      fromSchoenblick: "right on site",
      description:
        "The Steinberglift in Langfurth near Schöfweg is literally on Haus Schönblick's doorstep: a 400 m main slope plus a kids' area with a beginner lift, a magic carpet and a practice slope, and a toboggan hill. There are more lifts on the nearby Brotjacklriegel (1,011 m) – seven lift facilities in Schöfweg altogether – and around 23 km of groomed cross-country trails in and around Schöfweg. A live webcam shows the current snow conditions – perfect for planning your day from the apartment.",
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
        { label: "Live cam", value: "steinberglift.de" },
        { label: "Food", value: "Stoaberg Alm right at the lift (new since September 2026)" },
        { label: "Tip", value: "Ice skating in Grafenau as an alternative" },
      ],
    },
    {
      id: "indoor-golf",
      tag: "Sport & fun",
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
        activities: ["Skiing at the Steinberglift", "Tobogganing & cross-country skiing", "Christmas markets", "Indoor pool & sauna at elypso Deggendorf"],
      },
    ],
  },
  hike: {
    eyebrow: "Straight from HAUS28",
    heading: "Büchelstein circular hike",
    tableName: "Büchelstein circular hike",
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
          "The main summit and highlight of the hike. On a clear day the panorama stretches across the Bavarian Forest to the Danube valley – and when the föhn blows, all the way to the Alps. The rock slabs at the top can be mossy, so sturdy shoes are worth it.",
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
    mapStrong: "Map & GPS:",
    mapText:
      " You'll find the loop on Outdooractive, Komoot and AllTrails by searching for \"Büchelstein Grattersdorf\". On the ground, simply follow the red waymark no. 54 \"Büchelsteiner-Runde\".",
    cta: "Book HAUS28 – right at the Büchelstein",
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
