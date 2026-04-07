// Guest reviews – sourced from Airbnb.
// TODO: Replace with real reviews from actual guests.

export type Review = {
  id: string;
  propertyId: "haus28" | "schoenblick";
  apartmentId?: string;
  author: string;
  location: string;
  date: string;
  rating: number;
  text: string;
  avatarInitials: string;
};

export const reviews: Review[] = [
  // HAUS28 Reviews
  {
    id: "h28-1",
    propertyId: "haus28",
    author: "Sarah M.",
    location: "München",
    date: "März 2025",
    rating: 5,
    text: "Absolut traumhaft! Das A-Frame ist noch schöner als auf den Fotos. Die Ruhe im Wald, der Kamin am Abend – wir kommen definitiv wieder. Perfekter Rückzugsort!",
    avatarInitials: "SM",
  },
  {
    id: "h28-2",
    propertyId: "haus28",
    author: "Thomas K.",
    location: "Frankfurt",
    date: "Februar 2025",
    rating: 5,
    text: "Einzigartige Architektur, top ausgestattet und perfekte Lage für Wanderungen. Das Panoramafenster und der Waldblick sind einfach unglaublich. Sehr zu empfehlen!",
    avatarInitials: "TK",
  },
  {
    id: "h28-3",
    propertyId: "haus28",
    author: "Julia & Markus",
    location: "Hamburg",
    date: "Januar 2025",
    rating: 5,
    text: "Unser romantischster Kurzurlaub ever. HAUS28 hat alles was man braucht – und das mitten in der Natur. Der Gastgeber war super hilfsbereit. 10/10!",
    avatarInitials: "JM",
  },
  {
    id: "h28-4",
    propertyId: "haus28",
    author: "Familie Weber",
    location: "Nürnberg",
    date: "Dezember 2024",
    rating: 5,
    text: "Wir haben Weihnachten im HAUS28 verbracht – unvergesslich! Schnee im Wald, Kamin an, gemütliche Einrichtung. Die Kinder waren begeistert. Vielen Dank!",
    avatarInitials: "FW",
  },
  {
    id: "h28-5",
    propertyId: "haus28",
    author: "Anna P.",
    location: "Berlin",
    date: "November 2024",
    rating: 5,
    text: "Endlich mal ein Ferienhaus das hält was es verspricht. Hochwertige Ausstattung, liebevolle Details, absolute Stille. Genau das was man für einen echten Digital Detox braucht.",
    avatarInitials: "AP",
  },
  // Schönblick Reviews
  {
    id: "sb-1",
    propertyId: "schoenblick",
    apartmentId: "b6",
    author: "Christine L.",
    location: "Augsburg",
    date: "März 2025",
    rating: 5,
    text: "Der Ausblick vom Balkon ist einfach atemberaubend! Morgens Kaffee mit Panorama – so fängt ein perfekter Urlaub an. Sauber, gut ausgestattet, toller Gastgeber.",
    avatarInitials: "CL",
  },
  {
    id: "sb-2",
    propertyId: "schoenblick",
    apartmentId: "b8",
    author: "Familie Müller",
    location: "Regensburg",
    date: "Februar 2025",
    rating: 5,
    text: "Mit zwei Apartments für die ganze Familie war das perfekt! B8 ist sehr geräumig, Kinder hatten Platz, Eltern hatten Ruhe. Wir haben sofort für den Sommer wieder gebucht.",
    avatarInitials: "FM",
  },
  {
    id: "sb-3",
    propertyId: "schoenblick",
    apartmentId: "a2",
    author: "Lena & David",
    location: "Stuttgart",
    date: "Januar 2025",
    rating: 5,
    text: "Romantisches kleines Apartment in traumhafter Lage. Schöfweg ist ein echtes Geheimtipp! Wir haben super Wanderungen gemacht und abends gemütlich zu Hause gekocht.",
    avatarInitials: "LD",
  },
  {
    id: "sb-4",
    propertyId: "schoenblick",
    apartmentId: "b5",
    author: "Petra H.",
    location: "Passau",
    date: "Dezember 2024",
    rating: 5,
    text: "Bereits zum dritten Mal bei SARFI zu Gast – immer wieder gerne! Das Haus Schönblick ist wie ein zweites Zuhause. Herzlichen Dank für die tolle Betreuung.",
    avatarInitials: "PH",
  },
  {
    id: "sb-5",
    propertyId: "schoenblick",
    apartmentId: "b6",
    author: "Michael R.",
    location: "Wien",
    date: "November 2024",
    rating: 5,
    text: "Perfekte Lage für Wanderungen, super sauber, freundlicher Gastgeber und dieser Ausblick! Schöfweg ist ein wunderschöner Flecken – wir kommen wieder.",
    avatarInitials: "MR",
  },
];

export const haus28Reviews = reviews.filter((r) => r.propertyId === "haus28");
export const schoenblickReviews = reviews.filter((r) => r.propertyId === "schoenblick");
