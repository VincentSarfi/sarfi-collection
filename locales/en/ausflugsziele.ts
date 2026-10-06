import type de from "../de/ausflugsziele";

// Things to do page (components/pages/AusflugszielePageContent.tsx).
const ausflugsziele: typeof de = {
  breadcrumbHome: "Home",
  breadcrumbCurrent: "Things to do",
  hero: {
    eyebrow: "Bavarian Forest region",
    h1: "Things to Do in the Bavarian Forest",
    intro:
      "Around HAUS28 and Haus Schönblick, the Bavarian Forest is full of things to experience – from wild nature and Wild West flair to state-of-the-art golf simulators. Here are our personal recommendations for your stay.",
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
          { text: "Wellness at the thermal baths in Regen" },
        ],
      },
      {
        title: "On rainy days",
        items: [
          { text: "Indoor golf at the Rusel-Arena", anchor: "indoor-golf" },
          { text: "Exhibitions at the Hans-Eisenmann-Haus", anchor: "nationalpark" },
          { text: "Thermal baths in Regen" },
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
      subtitle: "Europe's largest Western town",
      distance: "~15 min from Haus Schönblick · ~20 min from HAUS28",
      fromHaus28: "~20 min",
      fromSchoenblick: "~15 min",
      description:
        "In the middle of the Bavarian Forest, the Western town of Pullman City in Eging am See awaits – Europe's largest Western theme village. Across more than 80,000 m² there are over 30 live shows every day, pony rides, a log flume, gold panning, a Native American camp and authentic Western food. A real highlight for families and anyone who wants to experience the Wild West without leaving Europe.",
      schemaDescription:
        "Europe's largest Western theme village with more than 30 shows a day, pony rides, a log flume and authentic Wild West flair.",
      highlights: [
        "30+ live shows every day",
        "Log flume & saloon",
        "Horse show & pony rides",
        "Gold panning for kids",
        "Overnight stays in the Western camp",
      ],
      practicalInfo: [
        { label: "Season", value: "May – October" },
        { label: "Getting there", value: "B85 towards Eging am See" },
        { label: "Tip", value: "Combine with the Treetop Walk (same area)" },
      ],
    },
    {
      id: "baumwipfelpfad",
      tag: "Nature & adventure",
      name: "Treetop Walk Neuschönau",
      schemaName: "Treetop Walk Neuschönau (Baumwipfelpfad)",
      subtitle: "Europe's longest treetop walk",
      distance: "~25 min from Haus Schönblick · ~30 min from HAUS28",
      fromHaus28: "~30 min",
      fromSchoenblick: "~25 min",
      description:
        "The Treetop Walk in Neuschönau, inside the Bavarian Forest National Park, is the longest of its kind in Europe. A 1,300 m low-barrier wooden boardwalk leads through the crowns of the ancient forest – up to 44 m above the ground. At the end, a 44 m observation tower offers 360° views across the national park. Along the way, children will find adventure stations and interactive exhibits.",
      schemaDescription:
        "Europe's longest treetop walk – 1,300 m long, with breathtaking views over the Bavarian Forest National Park.",
      highlights: [
        "1,300 m boardwalk through the treetops",
        "44 m observation tower",
        "Step-free & pram-friendly",
        "Interactive adventure stations",
        "Right next to the national park animal enclosure",
      ],
      practicalInfo: [
        { label: "Opening", value: "daily, all year round" },
        { label: "Admission", value: "adults approx. €11, children approx. €8" },
        { label: "Tip", value: "Combine with the animal enclosure (next door, free)" },
      ],
    },
    {
      id: "nationalpark",
      tag: "Nature & hiking",
      name: "Bavarian Forest National Park",
      schemaName: "Bavarian Forest National Park",
      subtitle: "Germany's oldest national park",
      distance: "~20 km from Haus Schönblick · ~25 km from HAUS28",
      fromHaus28: "~25 km",
      fromSchoenblick: "~20 km",
      description:
        "Since 1970, the Bavarian Forest has been Germany's first national park – 24,250 hectares of wild, untouched nature left to its own devices. The Hans-Eisenmann-Haus visitor centre in Neuschönau and the Haus zur Wildnis in Ludwigsthal offer fascinating exhibitions. In the large animal enclosure, lynx, wolves, bears, bison and deer live in near-natural surroundings – free admission.",
      schemaDescription:
        "Germany's oldest national park – 24,250 ha of untouched nature with animal enclosures, a visitor centre and 300 km of hiking trails.",
      highlights: [
        "Animal enclosure: lynx, wolf, bear, bison (free)",
        "300 km of marked hiking trails",
        "Ranger tours & nature programmes",
        "Visitor centre with interactive exhibitions",
        "Primeval forest – nature without human intervention",
      ],
      practicalInfo: [
        { label: "Admission", value: "animal enclosure free" },
        { label: "Season", value: "open all year round" },
        { label: "Tip", value: "Early-morning hikes for spotting wildlife" },
      ],
    },
    {
      id: "skigebiet-sonnenwald",
      tag: "Winter & sport",
      name: "Sonnenwald ski area / Steinberglift",
      schemaName: "Sonnenwald ski area / Steinberglift",
      subtitle: "Family skiing on the Brotjacklriegel (1,011 m)",
      distance: "right at Haus Schönblick in Langfurth · ~10 min from HAUS28",
      fromHaus28: "~10 min",
      fromSchoenblick: "right on site",
      description:
        "The Sonnenwald ski area around the Steinberglift in Langfurth / Schöfweg is literally on Haus Schönblick's doorstep. The Brotjacklriegel (1,011 m) offers family-friendly slopes, a floodlit natural toboggan run and well-groomed cross-country trails. A live webcam shows the current snow conditions – perfect for planning your day from the apartment.",
      schemaDescription:
        "Family-friendly ski area with 4 lifts on the Brotjacklriegel (1,011 m), cross-country trails and a live webcam.",
      highlights: [
        "Steinberglift & Brotjacklriegel lift",
        "Floodlit natural toboggan run",
        "Cross-country trails right next door",
        "Live webcam to check the snow",
        "Great for families & beginners",
      ],
      practicalInfo: [
        { label: "Season", value: "December – March (snow permitting)" },
        { label: "Live cam", value: "steinberglift.de" },
        { label: "Tip", value: "Ice skating in Grafenau as an alternative" },
      ],
    },
    {
      id: "indoor-golf",
      tag: "Sport & fun",
      name: "Rusel-Arena indoor golf",
      schemaName: "Rusel-Arena indoor golf",
      subtitle: "6 TrackMan simulators at Rusel golf course",
      distance: "~25 min from HAUS28 & Haus Schönblick",
      fromHaus28: "~25 min",
      fromSchoenblick: "~25 min",
      description:
        "The brand-new Rusel-Arena at the Deggendorf-Rusel golf course is the most modern indoor golf experience in the Bavarian Forest. Six TrackMan simulator bays across 370 m² offer precise shot analysis and virtual rounds on more than 100 world-famous courses. Beginners, improvers and pros are all welcome – whatever the weather, all year round.",
      schemaDescription: "370 m² indoor golf simulator with 6 TrackMan bays at the Rusel golf course near Deggendorf.",
      highlights: [
        "6 TrackMan simulator bays",
        "370 m² indoor facility",
        "More than 100 virtual courses worldwide",
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
        activities: ["Skiing at the Steinberglift", "Tobogganing & cross-country skiing", "Christmas markets", "Wellness & the thermal baths in Regen"],
      },
    ],
  },
  hike: {
    eyebrow: "Straight from HAUS28",
    heading: "Büchelstein circular hike",
    tableName: "Büchelstein circular hike",
    schemaName: "Büchelstein hiking route from HAUS28",
    schemaDescription:
      "Circular hike from HAUS28 via the 18th-century Rastbuche pilgrimage chapel near Grattersdorf and the Kleiner Büchelstein to the Großer Büchelstein (831 m) and back – with views into the Danube valley.",
    intro:
      "The most beautiful hike from HAUS28 leads straight from the house up to the Großer Büchelstein (831 m) – past the historic Rastbuche pilgrimage chapel, the Kleiner Büchelstein and through dense Bavarian forest. The circular route is well signposted, suitable for active families and rewards you with sweeping views over the Bavarian Forest all the way to the Danube valley.",
    stats: [
      { label: "Start", value: "HAUS28, Büchelstein 28" },
      { label: "Summit", value: "831 m (Großer Büchelstein)" },
      { label: "Type", value: "Circular route, well signposted" },
      { label: "Difficulty", value: "Moderate – suitable for families" },
    ],
    waypoints: [
      {
        name: "Start: HAUS28",
        detail: "Büchelstein 28, Grattersdorf – the trail into the forest starts right at the house.",
      },
      {
        name: "Rastbuche pilgrimage chapel",
        detail:
          "The picturesque Rastbuche pilgrimage chapel near Grattersdorf dates from the 18th century and sits idyllically close to the Büchelstein. It is a well-known stop on regional trails – including the \"Rastbuchen-Runde\" (no. 52) – and on clear days offers impressive views into the Danube valley.",
      },
      {
        name: "Kleiner Büchelstein",
        detail: "The first summit of the hike, with lovely views into the valley and across the wooded hills of the Bavarian Forest.",
      },
      {
        name: "Großer Büchelstein (831 m)",
        detail:
          "The main summit and highlight of the hike. At 831 m, on a clear day you'll enjoy a superb panorama over the Bavarian Forest – sometimes all the way to the Alps.",
      },
      {
        name: "Back to HAUS28",
        detail:
          "The descent follows a different path back to the start – the loop keeps the hike varied without retracing your steps.",
      },
    ],
    mapStrong: "Map & GPS:",
    mapText:
      " You'll find the route on Komoot and AllTrails by searching for \"Büchelstein Grattersdorf\". Alternatively, simply follow the trail signs from HAUS28 – or take the Rastbuchen-Runde (no. 52).",
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
