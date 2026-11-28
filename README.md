# Mahadev Overseas — website

Next.js (App Router, JavaScript) · Tailwind CSS v4 · GSAP ScrollTrigger · Lenis.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm test           # unit + browser tests (see docs/TESTING.md)
```

Testing — automated suites and the manual pre-launch checklist: [docs/TESTING.md](docs/TESTING.md).

Getting found on Google (Business Profile, reviews, citations, content plan): [docs/SEO-PLAYBOOK.md](docs/SEO-PLAYBOOK.md).

## Pages

`/` · `/countries` · `/countries/[id]` · `/journey` · `/services` · `/success-stories` · `/about` · `/eligibility` · `/contact` · `/admin`

## Admin panel (`/admin`)

- Log in with `ADMIN_PASSWORD` from `.env.local` (a random one was generated — change it before going live). `ADMIN_SECRET` signs the session cookie.
- Every section of every page is editable: text, numbers, lists (add / remove / reorder), images (upload), service icons, countries, stories, quiz questions and scoring, contact details, menu, footer.
- **Enquiries**: submissions from the contact form and eligibility checker, with status, search and CSV export.
- "Defaults" restores a section to the original content in `src/lib/site.js`.

### Where data lives

| What | Production | Local fallback (when not configured) |
| --- | --- | --- |
| Website content | MongoDB `content` collection | `content/site.json` |
| Enquiries | MongoDB `enquiries` collection | `content/enquiries.json` |
| Uploaded images | Cloudflare R2 `uploads/…` | `content/uploads/` (served at `/media/…`) |
| Video frames | Cloudflare R2 `frames/…` (optional) | `public/frames/` |

All settings go in `.env.local` (see `.env.example`). With MongoDB + R2 configured, nothing is written to disk, so the site can run on any host, including Vercel.

## Setup: MongoDB + Cloudflare

1. **MongoDB** — create a cluster (e.g. MongoDB Atlas), a database user, and allow your server's IP. Put the connection string in `MONGODB_URI`.
2. **Cloudflare R2** — create a bucket, turn on public access (connect a custom domain such as `media.yourdomain.com`, or enable the `r2.dev` URL), and create an R2 API token with *Object Read & Write* on that bucket. Fill in `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `R2_PUBLIC_URL`.
3. Move the current content, enquiries and any uploaded images:

   ```bash
   npm run db:migrate
   ```

4. *(Optional, recommended)* Serve the ~100 MB of video frames from Cloudflare's CDN:

   ```bash
   npm run frames:upload
   ```

   then set `NEXT_PUBLIC_FRAMES_BASE_URL` to the same value as `R2_PUBLIC_URL`.
5. Restart / rebuild the site (`npm run build && npm start`, or redeploy). Set the same environment variables on your host.

## Frame sequences

`videos/*.mp4` → `public/frames/{hero,burst,journey}` (1920w, 30fps WebP) and `*-mobile` (960w, every 2nd frame). After regenerating, bump `FRAMES_VERSION` in `src/lib/frames.js` and the matching `?v=` in `next.config.mjs`, and re-run `npm run frames:upload -- --force` if you use R2.

## Before launch

Search for `TODO` and placeholder values (`[CITY]`, phone, address, stats, stories, testimonials, partner universities) — most can now be changed from the admin. Never promise visa approval anywhere.
