# PRD: Testimonial Collection Platform

**Version:** 1.0 — MVP
**Date:** 2026-02-23
**Build target:** 60 minutes

---

## 1. Problem

Developers and Indie Hackers who build products need social proof (testimonials) on their websites. The current workflow is manual: ask users, copy-paste text, maintain it yourself. There's no clean, developer-first way to collect, manage, and serve testimonials via API.

---

## 2. Goal

A platform where:

- **App owners (developers)** collect testimonials from their users and serve them via a REST API
- **End users** submit testimonials via a simple, friendly public form
- Media (photos) can be attached to testimonials
- App owners approve testimonials before they go live

---

## 3. Users

| User Type        | Description                                                               |
| ---------------- | ------------------------------------------------------------------------- |
| **App Owner**    | Developer who signs up, creates a project, manages testimonials           |
| **End User**     | Customer of the app owner who submits a testimonial — no account required |
| **API Consumer** | The app owner's website or app, fetching testimonials via REST API        |

---

## 4. Core Features (MVP)

### 4.1 Authentication

- Email + password sign up / sign in (NextAuth.js Credentials provider)
- Session persisted via Supabase Postgres (NextAuth Prisma adapter)
- Passwords hashed with `bcryptjs`

### 4.2 Projects

- App owner can create multiple **projects** (one per product/app)
- Each project gets:
  - A unique **project slug** (used in the collection URL)
  - A unique **API key** (used to authenticate API requests)
- App owner can view and copy their API key from the dashboard
- App owner can regenerate their API key

### 4.3 Testimonial Collection (Public)

- Public URL: `/collect/[projectSlug]`
- No auth required for end users
- Form fields:
  - **Name** (required)
  - **Role / Company** (optional, e.g. "CEO at Acme")
  - **Testimonial text** (required, max 500 chars)
  - **Rating** (optional, 1–5 stars)
  - **Photo upload** (optional — stored in Supabase Storage)
- On submit: testimonial saved with `status: PENDING`
- Success screen shown after submission

### 4.4 Approval Workflow

- All testimonials start as `PENDING`
- App owner sees a dashboard with three tabs: **Pending / Approved / Rejected**
- App owner can **Approve** or **Reject** testimonials
- Only `APPROVED` testimonials are returned by the public API
- Bulk approve/reject not required for MVP

### 4.5 Media Uploads

- End users can optionally upload a photo (avatar/headshot) with their testimonial
- Uploaded to **Supabase Storage** bucket (`testimonial-media`)
- Public URL stored on the `Testimonial` record
- Accepted formats: `image/jpeg`, `image/png`, `image/webp`
- Max size: 2MB
- If no photo uploaded, `avatarUrl` is null

### 4.6 Testimonials Dashboard

- Per-project view with tabs: Pending / Approved / Rejected
- Each testimonial card shows: avatar, name, role, text, rating, submitted date
- Approve / Reject action buttons
- Empty states for each tab

### 4.7 Public REST API

- Endpoint: `GET /api/v1/testimonials/[projectSlug]`
- Auth: `Authorization: Bearer <apiKey>` header
- Returns only `APPROVED` testimonials
- Response shape:

```json
{
  "project": "my-app",
  "count": 3,
  "testimonials": [
    {
      "id": "cuid",
      "authorName": "Jane Doe",
      "role": "CEO at Acme",
      "text": "This product changed my life.",
      "rating": 5,
      "avatarUrl": "https://...supabase.co/storage/...",
      "createdAt": "2026-02-23T10:00:00Z"
    }
  ]
}
```

- Error responses: `401 Unauthorized`, `404 Project not found`
- No pagination for MVP (add later)

---

## 5. Data Model

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  password      String    // bcrypt hash
  image         String?
  sessions      Session[]
  projects      Project[]
  createdAt     DateTime  @default(now())
}

model Project {
  id           String        @id @default(cuid())
  name         String
  slug         String        @unique
  apiKey       String        @unique @default(cuid())
  userId       String
  user         User          @relation(fields: [userId], references: [id])
  testimonials Testimonial[]
  createdAt    DateTime      @default(now())
}

model Testimonial {
  id          String            @id @default(cuid())
  projectId   String
  project     Project           @relation(fields: [projectId], references: [id])
  authorName  String
  role        String?
  text        String
  rating      Int?              // 1–5
  avatarUrl   String?           // Supabase Storage public URL
  status      TestimonialStatus @default(PENDING)
  createdAt   DateTime          @default(now())
}

enum TestimonialStatus {
  PENDING
  APPROVED
  REJECTED
}

// NextAuth required models
model Account { ... }
model Session { ... }
model VerificationToken { ... }
```

---

## 6. Routes

| Route                                    | Auth    | Description                                                |
| ---------------------------------------- | ------- | ---------------------------------------------------------- |
| `/`                                      | No      | Landing page                                               |
| `/dashboard`                             | Yes     | List user's projects                                       |
| `/dashboard/new`                         | Yes     | Create a new project                                       |
| `/dashboard/[projectSlug]`               | Yes     | Project detail — testimonials with approval tabs + API key |
| `/collect/[projectSlug]`                 | No      | Public testimonial submission form                         |
| `GET /api/v1/testimonials/[projectSlug]` | API Key | Public testimonials API                                    |
| `POST /api/collect/[projectSlug]`        | No      | Internal — handles form submission + file upload           |
| `PATCH /api/testimonials/[id]`           | Yes     | Approve / Reject a testimonial                             |
| `POST /api/projects`                     | Yes     | Create a project                                           |
| `POST /api/projects/[id]/regenerate-key` | Yes     | Regenerate API key                                         |

---

## 7. Tech Stack

| Layer        | Choice                                          |
| ------------ | ----------------------------------------------- |
| Framework    | Next.js 14 (App Router)                         |
| Styling      | Tailwind CSS                                    |
| Components   | shadcn/ui                                       |
| Auth         | NextAuth.js v5 (Credentials — email + password) |
| ORM          | Prisma                                          |
| Database     | Supabase (Postgres)                             |
| File Storage | Supabase Storage                                |
| Deployment   | Vercel (later)                                  |

---

## 8. Out of Scope (MVP)

- Email notifications (approval, new submission)
- Custom form branding / theming
- Embeddable widgets
- Video testimonials
- Multiple team members per project
- Analytics / charts
- Pagination on API
- Custom domains for collection URLs
- Import testimonials from Twitter/G2/etc.

---

## 9. Success Criteria

- App owner can sign in, create a project, and get a shareable collection link in < 2 minutes
- End user can submit a testimonial (with optional photo) in < 1 minute
- App owner can approve testimonials from the dashboard
- Developer can `curl /api/v1/testimonials/:slug -H "Authorization: Bearer <key>"` and get approved testimonials
