// Sprachneutrales Organization-Schema, von beiden Root-Layouts genutzt.
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SARFI Collection",
  url: "https://www.sarfi-collection.de",
  logo: "https://www.sarfi-collection.de/images/logo.svg",
  email: "hallo@sarfi-collection.de",
  address: {
    "@type": "PostalAddress",
    addressRegion: "Bayern",
    addressCountry: "DE",
  },
  sameAs: ["https://www.airbnb.de/users/show/582496095"],
};
