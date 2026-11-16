# Update — landing page, demo auth and user dashboard

**Date:** 16 November 2026  
**Branch:** `feat/landing-auth-dashboard`  
**Contributors:** Onyema Marvellous, Claude

## What changed

The home screen is now a public **landing page** instead of a service listing.
The marketplace lives behind authentication, and students get a routed
dashboard with a persistent activity log.

### 1. Landing page (`/`)

`src/pages/Landing.tsx` is a marketing page, not a service feed. It includes:

- branded sticky header with anchor navigation
- hero with product preview card and demo credentials
- campus stats strip
- six feature cards ("Why Folio")
- category showcase (counts only, no listings)
- three-step "How it works" section
- campus safety promise
- testimonial, closing CTA and footer
- responsive layouts down to mobile

The old service browser was moved into the authenticated dashboard.

### 2. Login and signup routes

| Route     | Behaviour                                                                 |
| --------- | ------------------------------------------------------------------------- |
| `/login`  | Prefilled demo credentials, show/hide password, error state, redirect back to the route that required auth |
| `/signup` | Prefilled demo student data, validation, password confirmation, terms checkbox, creates a working demo session |

Demo credentials:

```text
Email:    damilare@student.aul.edu.ng
Password: campus1234
```

Auth state is held in `src/auth.tsx`:

- session persisted at `campus-folio.session.v1`
- per-user activity persisted at `campus-folio.activity.v1:<email>`
- protected routes redirect signed-out visitors to `/login` with the intended
  path, then return them there after sign-in
- signed-in visitors to `/login` or `/signup` are redirected to `/dashboard`

### 3. User dashboard

`src/pages/DashboardLayout.tsx` provides the workspace shell: sidebar nav,
campus card, user card, sticky topbar and mobile sign-out.

| Route                 | Page                                                              |
| --------------------- | ----------------------------------------------------------------- |
| `/dashboard`          | Greeting, stats, upcoming sessions, recent activity, top-rated services |
| `/dashboard/explore`  | Searchable service marketplace with category filters and detail sheet |
| `/dashboard/saved`    | Saved-service shortlist with empty state                          |
| `/dashboard/offers`   | Publish an offer and manage live offers                           |
| `/dashboard/activity` | Full activity log with filters, grouped days and summary          |
| `/dashboard/profile`  | Editable student profile and demo reset                           |

### 4. Activity log

Actions are recorded automatically with timestamps:

- sign in and sign out
- session requests
- saving and removing services
- publishing offers
- profile changes

The dashboard shows the four most recent events. `/dashboard/activity` shows the
full trail grouped by day, filterable by **Bookings**, **Offers**, **Saved** and
**Account**, plus totals for today, bookings and last update.

### 5. Demo data and reset

- Demo login seeds a realistic student trail (bookings, saves, offer, sign-in,
  verification).
- Signup creates the account, seeds the same demo trail and starts with the
  portfolio review already saved.
- **Profile → Reset demo data** clears the session, per-user activity and
  workspace state, then returns to `/login` with fresh seed data on next login.

## Files

### New

```text
docs/README.md
docs/UPDATE.md
src/auth.tsx
src/demo.ts
src/marketplace.tsx
src/pages.css
src/pages/ActivityLog.tsx
src/pages/Auth.tsx
src/pages/DashboardLayout.tsx
src/pages/Explore.tsx
src/pages/Landing.tsx
src/pages/NotFound.tsx
src/pages/Offers.tsx
src/pages/Overview.tsx
src/pages/Profile.tsx
src/pages/Saved.tsx
src/components/ActivityFeed.tsx
src/components/Avatar.tsx
src/components/Brand.tsx
src/components/ServiceCard.tsx
src/components/ServiceDetail.tsx
```

### Updated

```text
src/App.tsx          → router shell, providers, protected route, page titles
src/icons.tsx        → auth, dashboard and activity icons
package.json         → react-router-dom, contributors, description
package-lock.json    → router dependencies
vercel.json          → SPA rewrites so direct route loads work on Vercel
README.md            → routes, demo account, docs link, contributors
```

### Unchanged

```text
src/data.ts          → service and category seed data
src/index.css        → shared design tokens
src/App.css          → shared primitives reused by new screens
index.html           → HTML shell and metadata
```

## Verification

Run the proof checks:

```bash
npx tsc -b
npm run lint
npm run build
```

Production build output is served from `dist/`. Vercel rewrites all routes to
`index.html` so `/login`, `/dashboard`, `/dashboard/activity` and the rest work on
a hard refresh.

Manual smoke tests:

1. Open `/` — landing page renders, no service grid.
2. Open `/dashboard` signed out — redirected to `/login`.
3. Log in with the demo credentials — arrives at `/dashboard`.
4. Save a service, request a session, publish an offer, save the profile — each
   appears in `/dashboard/activity`.
5. Reset demo data from Profile — signed out and activity cleared.
6. Refresh directly on `/dashboard/activity` — route resolves correctly.
