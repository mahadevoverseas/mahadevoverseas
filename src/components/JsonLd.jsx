export default function JsonLd({ content }) {
  const { site, contact, countries } = content;
  const data = {
    "@context": "https://schema.org",
    "@type": ["EducationalOrganization", "LocalBusiness"],
    "@id": `${site.url}/#organization`,
    name: site.name,
    url: site.url,
    logo: `${site.url}/brand/logo-on-light.png`,
    image: `${site.url}/og-image.jpg`,
    description: site.description,
    slogan: site.tagline,
    foundingDate: String(site.foundedYear),
    telephone: contact.phone,
    email: contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.address.street,
      addressLocality: contact.address.locality,
      addressRegion: contact.address.region,
      postalCode: contact.address.postalCode,
      addressCountry: contact.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: contact.geo.lat, longitude: contact.geo.lng },
    openingHours: "Mo-Sa 10:00-19:00", // TODO: keep in sync with contact.hours
    priceRange: "Free counselling",
    areaServed: { "@type": "Country", name: "India" },
    knowsAbout: countries.map((c) => `Study in ${c.name}`),
    sameAs: contact.socials.map((s) => s.href),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
