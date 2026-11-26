/**
 * ============================================================
 *  MAHADEV OVERSEAS — SITE CONFIG
 *  Every piece of text, number, country, story and contact
 *  detail on the website lives in this file.
 *
 *  Search for "TODO" to find every placeholder that must be
 *  replaced with real information before launch.
 *
 *  COMPLIANCE: never write "100% visa guarantee" or promise
 *  visa approval anywhere. Visa decisions are made only by the
 *  immigration authority of each country.
 * ============================================================
 */

export const site = {
  name: "Mahadev Overseas",
  shortName: "MO",
  tagline: "We deal in study visas",
  // TODO: replace with the real city name everywhere it appears.
  city: "[CITY]",
  // TODO: replace with the production domain (used for SEO + Open Graph).
  url: "https://www.mahadevoverseas.com",
  description:
    "Mahadev Overseas is a study visa consultancy helping Indian students with admissions and student visas for Canada, UK, Australia, USA, Germany, Ireland and New Zealand — honest guidance from first counselling to boarding the flight.",
  foundedYear: 2016, // TODO: confirm founding year
};

export const contact = {
  // TODO: replace every contact detail below with real ones.
  phone: "+91 90000 00000",
  phoneHref: "+919000000000",
  whatsapp: "919000000000", // digits only, with country code, for wa.me
  whatsappMessage:
    "Hi Mahadev Overseas, I'd like free counselling for studying abroad.",
  email: "info@mahadevoverseas.com",
  address: {
    street: "[Office address line]", // TODO
    locality: "[CITY]", // TODO
    region: "[State]", // TODO
    postalCode: "[PIN]", // TODO
    country: "IN",
  },
  addressLines: ["[Office address line]", "[CITY], [State] [PIN]", "India"], // TODO
  hours: [
    { days: "Mon – Sat", time: "10:00 AM – 7:00 PM" }, // TODO: confirm
    { days: "Sunday", time: "By appointment" },
  ],
  // TODO: replace with your Google Maps search query or exact place name.
  mapQuery: "Mahadev Overseas [CITY]",
  geo: { lat: 17.385, lng: 78.4867 }, // TODO: office coordinates (used in JSON-LD)
  socials: [
    // TODO: replace with real profile links (remove any you don't use)
    { label: "Instagram", icon: "instagram", href: "https://instagram.com/" },
    { label: "Facebook", icon: "facebook", href: "https://facebook.com/" },
    { label: "YouTube", icon: "youtube", href: "https://youtube.com/" },
    { label: "LinkedIn", icon: "linkedin", href: "https://linkedin.com/" },
  ],
};

/** wa.me link with a prefilled message. Pass the (possibly admin-edited) contact object. */
export function whatsappLink(c = contact, message) {
  return `https://wa.me/${c.whatsapp}?text=${encodeURIComponent(message ?? c.whatsappMessage)}`;
}

export const nav = [
  { label: "Countries", href: "/countries" },
  { label: "Services", href: "/services" },
  { label: "Journey", href: "/journey" },
  { label: "Success Stories", href: "/success-stories" },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const cta = { label: "Book free counselling", href: "/contact" };

/* Small intro banners for the inner pages. */
export const pages = {
  countries: { eyebrow: "Study destinations", title: "Pick your destination", text: "Seven countries, each with its own intakes, costs and post-study options. Explore them one by one." },
  services: { eyebrow: "Services", title: "Every step, handled", text: "Admissions, visas, tests, loans and landing — one team for the whole road." },
  journey: { eyebrow: "How it works", title: "Your journey", text: "From the first conversation at our office to your first day on campus." },
  stories: { eyebrow: "Success stories", title: "They flew. You're next.", text: "Real students, real routes. (Replace the sample entries in the admin panel.)" }, // TODO
  about: { eyebrow: "About us", title: "Honest guidance, all the way", text: "Who we are, how we work and why families trust us with the biggest move of their child's life." },
  eligibility: { eyebrow: "Eligibility checker", title: "Find your best-fit country", text: "Answer four quick questions for a first idea of countries that may suit you." },
  gallery: { eyebrow: "Gallery", title: "Moments that fly", text: "Videos and photos from campuses, celebrations and journeys. (Add your own office, event and student photos from the admin panel.)" }, // TODO
  contact: { eyebrow: "Contact", title: "Let's plan your move", text: "Visit, call, WhatsApp or send an enquiry — counselling is free." },
};

export const ctaBand = {
  title: "Your flight path starts with one conversation",
  text: "Free, honest counselling — no pressure, no promises we can't keep.",
  primary: { label: "Book free counselling", href: "/contact" },
  secondary: { label: "Check your eligibility", href: "/eligibility" },
};

export const whatsappFloat = {
  enabled: true,
  label: "Chat with us",
};

/* ---------------- HERO ---------------- */
export const hero = {
  eyebrow: "We deal in study visas",
  lineOne: "Your future",
  lineTwo: "has a flight path",
  countries: ["Canada", "UK", "Australia", "USA", "Germany"],
  scrollLabel: "Scroll to explore",
};

/* ---------------- STATS ---------------- */
// TODO: PLACEHOLDER NUMBERS — replace with your real, verifiable figures.
export const stats = {
  eyebrow: "The numbers so far",
  title: "Caps in the air, every intake",
  items: [
    { value: 500, suffix: "+", label: "Students abroad" }, // TODO
    { value: 98, suffix: "%", label: "Visa success rate*" }, // TODO
    { value: 150, suffix: "+", label: "Partner universities" }, // TODO
    { value: 10, suffix: "", label: "Years of experience" }, // TODO
  ],
  footnote:
    "*Based on files we have prepared in past intakes. Past results do not guarantee future visa outcomes — every decision is made by the respective embassy.",
};

/* ---------------- ABOUT ---------------- */
export const about = {
  eyebrow: "About Mahadev Overseas",
  // TODO: refine this paragraph with your own story if you'd like.
  paragraph:
    "We are a study visa consultancy built on one simple promise: honest guidance. We tell you what fits your marks, your budget and your goals — not what sounds good. From your first free counselling session to the university shortlist, the application, the visa file and the morning you board your flight, one team walks the whole road with you.",
  signature: "— Team Mahadev Overseas",
};

/* ---------------- COUNTRIES ---------------- */
// TODO: verify every figure below against official sources before launch —
// tuition and post-study work rules change often.
export const origin = { name: "India", lat: 28.6139, lng: 77.209 };

export const countries = [
  {
    id: "canada",
    overview: "Welcoming immigration pathways, a large Indian community and strong college-to-career programs make Canada a favourite for diploma and PG students.",
    name: "Canada",
    flag: "ca",
    city: "Toronto",
    lat: 43.6532,
    lng: -79.3832,
    intakes: ["September", "January", "May"],
    tuition: "CAD 20,000 – 45,000 / year",
    work: "Post-Graduation Work Permit of up to 3 years (program dependent)",
    courses: ["Business & Management", "Computer Science", "Data Analytics", "Healthcare", "Engineering"],
  },
  {
    id: "uk",
    overview: "One-year master's degrees, world-ranked universities and a post-study work route make the UK a fast, prestigious option.",
    name: "United Kingdom",
    flag: "gb",
    city: "London",
    lat: 51.5072,
    lng: -0.1276,
    intakes: ["September", "January"],
    tuition: "£12,000 – 30,000 / year",
    work: "Graduate Route work visa after graduation (duration as per current rules)",
    courses: ["MBA", "Finance", "Computer Science", "Public Health", "Law"],
  },
  {
    id: "australia",
    overview: "High quality of life, part-time work rights during study and globally recognised degrees across IT, health and engineering.",
    name: "Australia",
    flag: "au",
    city: "Sydney",
    lat: -33.8688,
    lng: 151.2093,
    intakes: ["February", "July", "November"],
    tuition: "AUD 30,000 – 50,000 / year",
    work: "Temporary Graduate visa, typically 2 – 3 years",
    courses: ["IT", "Nursing", "Engineering", "Accounting", "Hospitality"],
  },
  {
    id: "usa",
    overview: "The widest choice of universities and courses in the world, with strong STEM programs and OPT work experience after graduation.",
    name: "United States",
    flag: "us",
    city: "New York",
    lat: 40.7128,
    lng: -74.006,
    intakes: ["Fall (Aug/Sep)", "Spring (Jan)"],
    tuition: "USD 25,000 – 55,000 / year",
    work: "OPT of 12 months, plus a 24-month extension for eligible STEM degrees",
    courses: ["Computer Science", "Data Science", "MBA", "Engineering Management", "Biotech"],
  },
  {
    id: "germany",
    overview: "Tuition-free or low-cost public universities and a strong engineering industry — ideal for students with good academics.",
    name: "Germany",
    flag: "de",
    city: "Berlin",
    lat: 52.52,
    lng: 13.405,
    intakes: ["Winter (October)", "Summer (April)"],
    tuition: "Public: low / no tuition + semester fee · Private: €10,000 – 25,000 / year",
    work: "18-month residence permit to look for work after graduation",
    courses: ["Mechanical Engineering", "Automotive", "Computer Science", "Renewable Energy", "MBA"],
  },
  {
    id: "ireland",
    overview: "Europe's tech and pharma hub, English-speaking, with one-year master's programs and a post-study stay-back option.",
    name: "Ireland",
    flag: "ie",
    city: "Dublin",
    lat: 53.3498,
    lng: -6.2603,
    intakes: ["September", "January"],
    tuition: "€10,000 – 25,000 / year",
    work: "Stamp 1G: 1 year (Level 8) or 2 years (Level 9)",
    courses: ["Data Analytics", "Pharma & Biotech", "Cloud Computing", "Finance", "Marketing"],
  },
  {
    id: "new-zealand",
    overview: "Safe, friendly and scenic, with practical programs and clear post-study work options.",
    name: "New Zealand",
    flag: "nz",
    city: "Auckland",
    lat: -36.8485,
    lng: 174.7633,
    intakes: ["February", "July"],
    tuition: "NZD 22,000 – 40,000 / year",
    work: "Post-study work visa of up to 3 years (qualification dependent)",
    courses: ["IT", "Agriculture", "Engineering", "Healthcare", "Tourism"],
  },
];

export const countriesSection = {
  eyebrow: "Where will you land?",
  title: "Seven countries. One flight path.",
  note: "Figures are indicative and change often. We confirm the latest numbers in your counselling session.",
};

/* ---------------- JOURNEY ---------------- */
export const journey = {
  eyebrow: "Your journey",
  title: "From your home to your campus",
  intro: "Six clear steps. One team with you at every one of them.",
  steps: [
    { title: "Free counselling", text: "A one-on-one session to understand your profile, goals and budget — no pressure, no fees." },
    { title: "University shortlist", text: "A realistic shortlist across countries that matches your marks, scores and career plans." },
    { title: "IELTS / PTE prep", text: "Focused coaching and mock tests so your score opens doors, not closes them." },
    { title: "Application & offer letter", text: "Polished applications, SOPs and documents — tracked until the offer letter arrives." },
    { title: "Visa file & interview prep", text: "A carefully checked visa file, financial documents and mock interviews before your appointment." },
    { title: "Pre-departure & fly", text: "Accommodation, forex, travel and a pre-departure briefing — then you board your flight." },
  ],
  // Closing "take-off" scene on the Journey page
  finale: {"eyebrow":"Step 06 · Pre-departure & fly","title":"Wheels up","text":"Bags packed, visa stamped, briefing done. This is the moment the whole journey was for."},
};

/* ---------------- SERVICES ---------------- */
// icon = any lucide-react icon name (https://lucide.dev/icons)
export const services = {
  eyebrow: "What we do",
  title: "Everything between you and your campus",
  items: [
    { icon: "GraduationCap", title: "Admissions", text: "Course and university selection, applications and offer-letter follow-up." },
    { icon: "Stamp", title: "Student Visa", text: "End-to-end visa filing, document checks and embassy appointment support." },
    { icon: "PenLine", title: "SOP & LOR", text: "Statements of purpose and recommendation letters that sound like you — only sharper." },
    { icon: "BookOpenCheck", title: "IELTS / PTE Coaching", text: "Small batches, mock tests and personal feedback for the score you need." },
    { icon: "Landmark", title: "Education Loans", text: "Guidance on secured and unsecured loans with partner banks and NBFCs." },
    { icon: "BedDouble", title: "Accommodation", text: "Help finding safe, affordable student housing before you land." },
    { icon: "Luggage", title: "Pre-departure Briefing", text: "What to pack, forex, SIM cards, first-week checklists and more." },
    { icon: "Users", title: "Dependent Visas", text: "Guidance for spouse and dependent visas where the country allows it." },
  ],
};

/* ---------------- SUCCESS STORIES ---------------- */
// TODO: PLACEHOLDER STORIES — replace with REAL students (with their written
// consent) and real photos in /public/images/stories/. Do not publish these
// sample entries as genuine.
export const stories = {
  eyebrow: "Success stories",
  title: "Boarding passes we've helped print",
  items: [
    { name: "Aarav S.", photo: "/images/stories/story-1.svg", from: "Hyderabad", fromCode: "HYD", to: "Toronto", toCode: "YYZ", university: "Partner University, Canada", course: "PG Diploma, Data Analytics", intake: "Sep 2025" },
    { name: "Priya R.", photo: "/images/stories/story-2.svg", from: "Vijayawada", fromCode: "VGA", to: "London", toCode: "LHR", university: "Partner University, UK", course: "MSc Public Health", intake: "Jan 2026" },
    { name: "Rahul K.", photo: "/images/stories/story-3.svg", from: "Chennai", fromCode: "MAA", to: "Sydney", toCode: "SYD", university: "Partner University, Australia", course: "Master of IT", intake: "Feb 2026" },
    { name: "Sneha M.", photo: "/images/stories/story-4.svg", from: "Bengaluru", fromCode: "BLR", to: "Berlin", toCode: "BER", university: "Partner University, Germany", course: "MSc Mechanical Engg.", intake: "Oct 2025" },
    { name: "Karthik V.", photo: "/images/stories/story-5.svg", from: "Mumbai", fromCode: "BOM", to: "Dublin", toCode: "DUB", university: "Partner University, Ireland", course: "MSc Cloud Computing", intake: "Sep 2025" },
    { name: "Ananya P.", photo: "/images/stories/story-6.svg", from: "Delhi", fromCode: "DEL", to: "Auckland", toCode: "AKL", university: "Partner University, NZ", course: "Master of Engineering", intake: "Jul 2025" },
  ],
};

/* ---------------- UNIVERSITIES ---------------- */
// TODO: list ONLY institutions you genuinely work with. Add a `logo` path
// (e.g. "/images/universities/name.png") to show a logo instead of the name.
export const universities = {
  eyebrow: "Our university network",
  title: "Campuses our students call home",
  rowOne: [
    { name: "Partner University 01", country: "Canada" },
    { name: "Partner University 02", country: "UK" },
    { name: "Partner University 03", country: "Australia" },
    { name: "Partner University 04", country: "USA" },
    { name: "Partner University 05", country: "Germany" },
    { name: "Partner University 06", country: "Ireland" },
    { name: "Partner University 07", country: "New Zealand" },
  ],
  rowTwo: [
    { name: "Partner College 08", country: "Canada" },
    { name: "Partner University 09", country: "UK" },
    { name: "Partner Institute 10", country: "Australia" },
    { name: "Partner University 11", country: "USA" },
    { name: "Partner University 12", country: "Germany" },
    { name: "Partner College 13", country: "Ireland" },
    { name: "Partner Institute 14", country: "New Zealand" },
  ],
};

/* ---------------- ELIGIBILITY CHECKER ---------------- */
// Each option carries simple scores used to suggest countries. This is a
// rough guide only — tweak the numbers to match your counselling experience.
export const eligibility = {
  eyebrow: "Eligibility checker",
  title: "Where could you study?",
  intro: "Four quick questions. We'll suggest countries that may suit your profile.",
  disclaimer:
    "This checker offers general guidance only. It is not an assessment of admission or visa eligibility and is not a guarantee of any outcome. A counsellor will review your full profile.",
  steps: [
    {
      id: "qualification",
      question: "What is your highest qualification?",
      options: [
        { label: "12th / Intermediate", value: "12th" },
        { label: "Diploma", value: "diploma" },
        { label: "Bachelor's degree", value: "bachelors" },
        { label: "Master's degree", value: "masters" },
      ],
    },
    {
      id: "marks",
      question: "What were your marks in it?",
      options: [
        { label: "Below 55%", value: "low" },
        { label: "55% – 65%", value: "mid" },
        { label: "65% – 75%", value: "good" },
        { label: "Above 75%", value: "high" },
      ],
    },
    {
      id: "english",
      question: "Your IELTS / PTE score (or expected)?",
      options: [
        { label: "Not taken yet", value: "none" },
        { label: "IELTS 5.5 – 6.0 / PTE 43 – 50", value: "low" },
        { label: "IELTS 6.5 / PTE 58 – 64", value: "mid" },
        { label: "IELTS 7.0+ / PTE 65+", value: "high" },
      ],
    },
    {
      id: "budget",
      question: "Total budget for your first year (tuition + living)?",
      options: [
        { label: "Under ₹12 lakh", value: "low" },
        { label: "₹12 – 20 lakh", value: "mid" },
        { label: "₹20 – 35 lakh", value: "good" },
        { label: "Above ₹35 lakh", value: "high" },
      ],
    },
  ],
  // Higher number = better fit for that answer.
  weights: {
    budget: {
      low: { germany: 3, ireland: 1, "new-zealand": 1 },
      mid: { germany: 3, ireland: 2, canada: 2, "new-zealand": 2, uk: 1 },
      good: { canada: 3, uk: 3, ireland: 2, australia: 2, "new-zealand": 2, germany: 1 },
      high: { usa: 3, australia: 3, uk: 2, canada: 2 },
    },
    english: {
      none: { germany: 2, canada: 1 },
      low: { germany: 2, ireland: 1, uk: 1 },
      mid: { canada: 2, uk: 2, ireland: 2, "new-zealand": 2, australia: 1 },
      high: { usa: 2, australia: 2, canada: 2, uk: 2 },
    },
    marks: {
      low: { uk: 1, canada: 1, ireland: 1 },
      mid: { canada: 2, uk: 2, ireland: 2, australia: 1, "new-zealand": 1 },
      good: { australia: 2, "new-zealand": 2, uk: 2, germany: 1, usa: 1 },
      high: { germany: 3, usa: 2, australia: 2 },
    },
    qualification: {
      "12th": { canada: 2, australia: 1, uk: 1 },
      diploma: { canada: 2, australia: 2, "new-zealand": 1 },
      bachelors: { germany: 2, usa: 2, uk: 2, ireland: 2 },
      masters: { germany: 2, ireland: 1, australia: 1 },
    },
  },
};

/* ---------------- TESTIMONIALS ---------------- */
// TODO: PLACEHOLDER QUOTES — replace with real, consented testimonials.
export const testimonials = {
  eyebrow: "In their words",
  title: "Students and parents on the journey",
  items: [
    { quote: "They never over-promised. Every step was explained clearly, and my documents were checked three times before the visa filing.", name: "Student", role: "MSc, United Kingdom" },
    { quote: "As parents we were worried about everything. The team answered every call and every doubt — even after our son landed.", name: "Parent", role: "Father of a student in Canada" },
    { quote: "The IELTS coaching and mock interviews made the real thing feel easy. I went in confident.", name: "Student", role: "Master of IT, Australia" },
    { quote: "Honest advice on which countries fit our budget saved us from a very expensive mistake.", name: "Parent", role: "Mother of a student in Germany" },
  ],
};

/* ---------------- GALLERY ---------------- */
// TODO: add real photos/videos of your office, events and students from the admin
// panel (Gallery). An item with a `video` plays it; otherwise `image` is shown.
export const gallery = {
  "eyebrow": "Gallery",
  "title": "Moments from the journey",
  "intro": "Campuses, celebrations and the flights in between. Tap any tile to view it full screen.",
  "items": [
    {
      "title": "Visa approved",
      "category": "Visas",
      "image": "/gallery/visa-poster.webp",
      "video": "/gallery/visa.mp4",
      "caption": "The stamp every student waits for."
    },
    {
      "title": "Wheels up",
      "category": "Journeys",
      "image": "/gallery/takeoff-poster.webp",
      "video": "/gallery/takeoff.mp4",
      "caption": "Take-off at blue hour — next stop, campus."
    },
    {
      "title": "Seven destinations, one origin",
      "category": "Journeys",
      "image": "/gallery/destinations-poster.webp",
      "video": "/gallery/destinations.mp4",
      "caption": "Routes from India to Canada, the UK, Ireland, Germany, the USA, Australia and New Zealand."
    },
    {
      "title": "Paper planes to the world",
      "category": "Preparation",
      "image": "/gallery/planes-poster.webp",
      "video": "/gallery/planes.mp4",
      "caption": "Late-night study sessions that take you places."
    },
    {
      "title": "Packed and ready",
      "category": "Preparation",
      "image": "/gallery/luggage-poster.webp",
      "video": "/gallery/luggage.mp4",
      "caption": "Pre-departure checklist: done."
    },
    {
      "title": "First snow on campus",
      "category": "Campus life",
      "image": "/gallery/campus-snow-poster.webp",
      "video": "/gallery/campus-snow.mp4",
      "caption": "Winter intake in Europe."
    },
    {
      "title": "Every route starts here",
      "category": "Journeys",
      "image": "/gallery/hero-poster.webp",
      "video": "/gallery/hero.mp4",
      "caption": "Flight paths from India to seven study destinations."
    },
    {
      "title": "Caps in the air",
      "category": "Celebrations",
      "image": "/gallery/burst-poster.webp",
      "video": "/gallery/burst.mp4",
      "caption": "Graduation day — the moment the whole journey is for."
    },
    {
      "title": "Above the clouds, onto campus",
      "category": "Campus life",
      "image": "/gallery/journey-poster.webp",
      "video": "/gallery/journey.mp4",
      "caption": "From the window seat to the university quad."
    },
    {
      "title": "Autumn on campus",
      "category": "Campus life",
      "image": "/gallery/photo-1.webp",
      "video": "",
      "caption": ""
    },
    {
      "title": "The clock tower",
      "category": "Campus life",
      "image": "/gallery/photo-2.webp",
      "video": "",
      "caption": ""
    },
    {
      "title": "City and campus",
      "category": "Campus life",
      "image": "/gallery/photo-3.webp",
      "video": "",
      "caption": ""
    },
    {
      "title": "Graduation day",
      "category": "Celebrations",
      "image": "/gallery/photo-4.webp",
      "video": "",
      "caption": ""
    },
    {
      "title": "Confetti moment",
      "category": "Celebrations",
      "image": "/gallery/photo-5.webp",
      "video": "",
      "caption": ""
    },
    {
      "title": "Hats off",
      "category": "Celebrations",
      "image": "/gallery/photo-6.webp",
      "video": "",
      "caption": ""
    },
    {
      "title": "A world of options",
      "category": "Journeys",
      "image": "/gallery/photo-7.webp",
      "video": "",
      "caption": ""
    },
    {
      "title": "Taking off",
      "category": "Journeys",
      "image": "/gallery/photo-8.webp",
      "video": "",
      "caption": ""
    },
    {
      "title": "Around the globe",
      "category": "Journeys",
      "image": "/gallery/photo-9.webp",
      "video": "",
      "caption": ""
    }
  ]
};

/* ---------------- CONTACT ---------------- */
export const contactSection = {
  eyebrow: "Start here",
  title: "Book your free counselling",
  intro: "Tell us a little about your plans. A counsellor will call you back within one working day.", // TODO: confirm response time
  intakes: ["January 2027", "May 2027", "September 2027", "January 2028", "Not sure yet"], // TODO: update yearly
  successMessage: "Thank you! Your enquiry has reached us — a counsellor will contact you soon.",
};

export const footer = {
  blurb: "Study visa consultancy for Canada, UK, Australia, USA, Germany, Ireland and New Zealand. Honest guidance, from first counselling to boarding the flight.",
  legal: "Mahadev Overseas provides admission and visa guidance. Visa decisions rest solely with the respective immigration authorities.",
};

/**
 * Everything above, bundled. The admin panel saves an edited copy of this
 * object to /content/site.json; any section missing there falls back to
 * these defaults.
 */
export const defaultContent = {
  site,
  contact,
  nav,
  cta,
  whatsappFloat,
  pages,
  ctaBand,
  hero,
  stats,
  about,
  origin,
  countriesSection,
  countries,
  journey,
  services,
  stories,
  universities,
  eligibility,
  testimonials,
  gallery,
  contactSection,
  footer,
};
