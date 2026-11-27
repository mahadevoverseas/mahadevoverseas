# Testing — Mahadev Overseas website

Two layers:

1. **Automated tests** — run in a minute or two, every time you change something.
2. **Manual checklist** — for what a machine can't judge: how animations feel, how it looks on real phones, whether the copy is right. Do it before every launch and after big changes.

---

## 1. Automated tests

```bash
npm test              # everything (unit, then browser tests)
npm run test:unit     # fast logic tests (Vitest) — under a second
npm run test:e2e      # browser tests (Playwright) — builds the site first, ~2 min
npm run test:e2e:ui   # browser tests in an interactive window, to watch them run
```

After a browser test run, open the HTML report (screenshots and traces of any failure):

```bash
npx playwright show-report
```

**Safe by design:** browser tests build into `.next-test` and use a throwaway copy of the content in `.test-content`. They never touch your live MongoDB, your Cloudflare R2 bucket, or your real `.next` build. The test admin password is `e2e-test-password` (test server only).

### What's covered

**Unit tests (`tests/unit`, 28 tests)**

| Area | Checks |
| --- | --- |
| Eligibility checker | Every one of the 256 answer combinations gives 2–3 distinct countries; sensible top picks (low budget + strong marks → Germany) |
| Admin login | Right/wrong password, no password configured, session tokens — tampered, expired or signed with another secret are rejected |
| Enquiry API | Valid enquiry saved; bad name/phone/email → 422; invalid JSON → 400; spam honeypot dropped; long fields trimmed |
| Content store | Defaults, save/read, unknown sections refused, enquiries add/update/delete; test mode can never reach MongoDB; placeholder `<db_username>` ignored |
| Media URLs | Cache-busting `?v=`, Cloudflare base URL, frame counts match the files on disk |
| Content rules | **No "100% visa" / "visa guarantee" wording** anywhere; every country has all fields; every menu link has a page; every gallery file exists |

**Browser tests (`tests/e2e`, 59 runs across desktop, mobile and reduced-motion)**

| Area | Checks |
| --- | --- |
| Every page (10) | Loads with 200, one `<h1>`, title + meta description, header/footer/WhatsApp button, **no sideways scroll**, every image has alt text, no banned visa wording, **no JavaScript errors** |
| 404 | Unknown URL → real 404; unknown country → branded page with `noindex` |
| Home | Loader leaves, scroll the whole page without errors, video canvas draws; reduced-motion shows the still image |
| Navigation | Desktop menu across pages (active link highlighted); mobile menu opens, navigates, closes; country pages link to each other |
| Contact form | Validation messages; valid enquiry saved with the right details |
| Eligibility checker | 4 answers → Germany first, disclaimer shown, lead saved with suggestions |
| Gallery | Filters, lightbox opens a video, arrow-key next, Escape closes |
| SEO | Open Graph tags, organisation JSON-LD, robots.txt hides `/admin`, sitemap lists all pages |
| Admin | Protected pages and upload API; wrong password rejected; login → edit content → live page updates → restore; enquiries inbox; image upload works, SVG refused; logout |

---

## 2. Manual checklist

Copy this list for each test round. Tick what passes; write down anything that doesn't (page, device, what you saw).

**Test on:** Chrome (Windows or Mac), Safari (Mac), **an iPhone (Safari)**, **an Android phone (Chrome)**, and one mid-range or older phone. Most visitors will be on phones.

### Look and feel
- [ ] Intro loader shows the MO logo and the red line fills, then slides away (first visit)
- [ ] Home hero: "YOUR FUTURE / HAS A FLIGHT PATH" splits apart smoothly as you scroll into the globe
- [ ] Scroll scenes play smoothly forwards *and* backwards — Home (globe, caps), Services (passport stamp), Countries (arcs globe), Journey (campus, take-off). No freezing, no white flashes
- [ ] Stats count up over the caps; numbers are correct
- [ ] Red flight path with the small plane draws itself between sections
- [ ] Desktop: red dot cursor with cyan ring follows the mouse; buttons gently pull toward the cursor
- [ ] Colours match the brand (red `#F32832`, cyan `#35C0EB`, charcoal background); logos are never stretched or recoloured
- [ ] Text is readable over every video (especially Journey's "Wheels up" over the bright plane)

### Every page (desktop and phone)
- [ ] Home · Countries · each country page · Services · Journey · Success Stories · Gallery · About · Eligibility · Contact
- [ ] Nothing overlaps or is cut off; no sideways scrolling on phones
- [ ] Menu: links work, current page underlined; on phones the full-screen menu opens/closes and links work
- [ ] Header hides when scrolling down and comes back when scrolling up
- [ ] Footer links, phone, email and social icons go to the right places
- [ ] Browser Back/Forward work and land at sensible scroll positions

### Countries
- [ ] Desktop: the 3D globe rotates and a red arc flies from India to each country as you scroll; the card changes
- [ ] Phone: country cards swipe left/right
- [ ] Every country page shows correct intakes, tuition, work rights and courses (**check figures against official sources**)

### Forms and contact
- [ ] Contact form: empty submit shows errors; real submit shows "Thank you"; the enquiry appears in **Admin → Enquiries**
- [ ] Eligibility checker: try several profiles; suggestions make sense; the "guidance, not a guarantee" text is visible; lead appears in Admin
- [ ] WhatsApp floating button (and the one in the header/contact) opens WhatsApp with the pre-filled message **to the right number**
- [ ] Phone link starts a call on a phone; email link opens the mail app
- [ ] Google Map shows the correct office location

### Gallery
- [ ] Videos play silently in their tiles while on screen and pause when scrolled away
- [ ] Filters work; tapping a tile opens it full screen; swipe (phone) / arrows (desktop) move between items; videos have sound controls
- [ ] Videos play on iPhone Safari

### Admin panel (`/admin`)
- [ ] Wrong password is refused; right password logs in; "Log out" works
- [ ] Edit something in each section you care about → **Save** → open the website → change is live
- [ ] Upload an image (JPG/PNG) and a short video in Gallery → they appear on the site (from your Cloudflare URL)
- [ ] Add, reorder and remove a list item (e.g. a testimonial) → site updates
- [ ] "Defaults" restores a section (try on something unimportant)
- [ ] Enquiries: status changes stick after reloading; **Export CSV** opens correctly in Excel/Sheets
- [ ] Leaving the editor with unsaved changes warns you

### Content and compliance
- [ ] **No placeholders left**: search the site for `[CITY]`, `[State]`, `[PIN]`, `+91 90000 00000`, "Partner University", "sample"
- [ ] Stats, success stories, testimonials and partner universities are **real** (with students' written consent for names/photos)
- [ ] **Nowhere promises visa approval** — no "100% visa guarantee", "guaranteed visa" or similar
- [ ] Spelling and grammar on every page

### Accessibility (quick checks)
- [ ] Use only the keyboard (Tab / Shift+Tab / Enter / Escape): every link, button, form field and the gallery lightbox can be reached and used; focus outline is visible
- [ ] Turn on "Reduce motion" (iPhone: Settings → Accessibility → Motion; Mac: System Settings → Accessibility → Display): the site still works and shows still images instead of scroll videos
- [ ] Zoom the browser to 200%: content still readable, nothing broken

### Speed
- [ ] Run **Lighthouse** in Chrome DevTools on the *live* site (Mobile + Desktop): aim for Performance 85+, Accessibility 90+, SEO 90+
- [ ] First load on 4G (Chrome DevTools → Network → "Fast 4G"): loader finishes in a few seconds; scroll scenes don't stutter after loading
- [ ] Before launch, move images/frames from the `pub-…r2.dev` address to an R2 **custom domain** (the r2.dev address is rate-limited)

### Sharing and SEO
- [ ] Paste the site link into WhatsApp: preview shows the title and the globe image
- [ ] `/robots.txt` and `/sitemap.xml` open and list the right pages
- [ ] Google Search Console: submit the sitemap after launch

---

## When something fails

1. Note the page, device/browser, and exact steps.
2. For automated tests: `npx playwright show-report` shows a screenshot and step-by-step trace of the failure.
3. Fix, then re-run `npm test` before publishing.
