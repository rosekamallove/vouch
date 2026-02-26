# Vouch — Product Roadmap & Monetisation Strategy

## Where we stand vs the competition

| Feature | Vouch (now) | Senja | Testimonial.to |
|---|---|---|---|
| Text testimonials | ✅ | ✅ | ✅ |
| Photo upload | ✅ | ✅ | ✅ |
| Approval workflow | ✅ | ✅ | ✅ |
| REST API | ✅ | ❌ | ❌ (widget-only) |
| Video testimonials | ❌ | ✅ | ✅ |
| Embeddable widgets | ❌ | ✅ | ✅ |
| Social imports | ❌ | ✅ | ✅ |
| Email requests | ❌ | ✅ | ✅ |
| Analytics | ❌ | ✅ | ✅ |
| Custom domain | ❌ | ✅ | ✅ |
| Developer API | ✅ | ❌ | ❌ |
| Webhooks | ❌ | ❌ | ❌ |

**Our moat:** Developer-first. Senja and Testimonial.to are widget companies.
Vouch is an API. That's a real differentiator — lean into it hard.

---

## Phase 1 — "Make it complete" (Weeks 1–6)

Close the obvious gaps. These are table-stakes features people expect.

### Auth & Onboarding
- [ ] Google OAuth (alongside email/password)
- [ ] Magic link login option
- [ ] Onboarding checklist on first login (create project → share link → approve first testimonial)

### Collection
- [ ] Custom collection page: logo, brand colour, headline copy (per project)
- [ ] Custom questions — let owners add up to 3 extra fields (e.g. "What's your role?" "What did you use before?")
- [ ] Video testimonials — record in-browser (up to 2 min) or upload an MP4, stored in Supabase Storage
- [ ] Spam honeypot + basic rate limiting on `/api/collect`

### Dashboard
- [ ] Email notification when a new testimonial comes in
- [ ] Bulk approve / bulk reject
- [ ] Search & filter testimonials (by rating, date, keyword)
- [ ] Testimonial tagging (e.g. "pricing", "onboarding", "speed")

### API
- [ ] Pagination (`?page=1&limit=20`)
- [ ] Filtering (`?rating_min=4`, `?tag=onboarding`)
- [ ] Video URL in response payload
- [ ] Webhook on testimonial approved (POST to user-defined URL)

---

## Phase 2 — "Close the gap" (Month 2–3)

Start pulling in users who currently choose Senja/Testimonial.to.

### Import
- [ ] Import from Twitter/X (paste a tweet URL → creates a testimonial)
- [ ] Import from CSV (bulk import from Google reviews, etc.)
- [ ] Import from G2, Capterra, Product Hunt (scrape or manual paste)

### Widgets (for non-devs)
- [ ] Wall of Love — `/widgets/wall/[slug]` iframe embed
- [ ] Carousel — single rotating quote widget
- [ ] Single quote — static embed
- [ ] Floating badge — "X happy customers" badge

> Keep the API as the hero. Widgets are a fallback for non-devs, not the core product.

### Integrations
- [ ] Zapier native app (trigger: new testimonial submitted / approved)
- [ ] Make (Integromat) native app
- [ ] Slack notification on new submission
- [ ] Framer plugin
- [ ] Webflow app

### Sending testimonial requests
- [ ] "Request a testimonial" — send a branded email directly from dashboard
- [ ] Bulk email via CSV upload
- [ ] Automated follow-up after N days

### Custom domain
- [ ] `testimonials.yourbrand.com` for collection pages (CNAME setup)

---

## Phase 3 — "Become the platform" (Month 4–6)

Expand the addressable market. Target agencies and larger teams.

### Teams
- [ ] Invite team members to a project (role: admin / reviewer)
- [ ] Multiple workspaces (for agencies managing multiple clients)
- [ ] Activity log

### AI layer
- [ ] AI-generated summary of all testimonials ("What do customers love most?")
- [ ] Auto-suggest which testimonials are highest quality (based on length, rating, specificity)
- [ ] Auto-tag testimonials by theme (pricing, support, UX, etc.)

### Analytics
- [ ] Collection page views, submission rate, drop-off
- [ ] Which testimonials get the most API calls
- [ ] Conversion tracking (embed click → sign-up, with JS snippet)

### White-label (Agency tier)
- [ ] Remove all Vouch branding
- [ ] Custom email sender domain
- [ ] Custom dashboard domain (`reviews.agency.com`)
- [ ] Resell to clients

---

## Monetisation Plan

### Model: Subscription (monthly + annual discount)

Subscription wins over one-time for this product because:
- Storage costs grow with usage (videos, images)
- API calls are ongoing infrastructure cost
- Users get ongoing value (new testimonials, new features)
- Predictable MRR is better for a bootstrapped product

Annual pricing = ~20% discount (standard SaaS).

---

### Tiers

#### Free — $0
**Target:** Indie hackers, side projects, trying it out.
- 1 project
- 50 testimonials max
- Text + photo only
- API access (100 req/day)
- Vouch branding on collection page
- No custom domain

#### Builder — $19/mo ($190/yr)
**Target:** Solo founders, small SaaS, early startups.
- 3 projects
- 500 testimonials
- Video testimonials (up to 2 min)
- Custom collection page branding (logo + colour)
- Email notifications
- API (5,000 req/day)
- Remove Vouch branding
- Webhooks
- Basic analytics

#### Pro — $49/mo ($490/yr)
**Target:** Growing SaaS, marketing teams.
- Unlimited projects
- Unlimited testimonials
- Everything in Builder
- Testimonial request emails (bulk send)
- Custom domain
- Zapier + Make integrations
- Widget embeds
- CSV import
- AI summary + auto-tagging
- Full analytics
- Priority support

#### Agency — $149/mo
**Target:** Agencies managing multiple clients.
- Everything in Pro
- White-label (your brand, not Vouch's)
- 10 team seats per workspace
- Multiple workspaces
- Custom email sender domain
- Dedicated support

---

### Revenue targets (realistic)

| Month | Free users | Paid users | MRR |
|---|---|---|---|
| 3 | 200 | 20 | ~$500 |
| 6 | 800 | 80 | ~$2,500 |
| 12 | 3,000 | 300 | ~$10,000 |

Conversion benchmark: 5–8% free-to-paid is healthy for developer tools.

---

### Growth levers

1. **API as a distribution channel** — every site using Vouch's API has implicit attribution. Add an optional "Powered by Vouch" link on collection pages (free tier) that drives traffic.

2. **Testimonial wall as a backlink machine** — wall-of-love embeds on customer sites → people ask "how did you do that?" → referral.

3. **Developer community** — write the REST API docs properly. Post on Hacker News, dev.to, indie hackers. Devs share tools they actually use.

4. **Appsumo / LTD launch** — once the product is stable (Phase 2 done), consider a lifetime deal to get initial MRR and user feedback. Cap it at 500 codes.

5. **Integrations as SEO** — "Vouch + Webflow", "Vouch + Framer", "Vouch + Next.js" landing pages. Integration pages rank well.

---

### What NOT to do

- Don't compete on widgets — Senja is already winning that. Win on API quality, DX, and documentation.
- Don't add AI gimmicks before the core product is solid.
- Don't build a mobile app — not needed yet.
- Don't go freemium-heavy early. Charge sooner than you think you should.
