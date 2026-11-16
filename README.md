# Campus Folio

The student services marketplace for **Anchor University Lagos**. Students can
offer and book tutoring, design, tech help, writing, errands and music lessons
across campus.

The app now has a public **landing page**, a demo **login / signup** flow and a
routed **student dashboard** with an activity log.

## Routes

| Route                 | What it does                                                |
| --------------------- | ----------------------------------------------------------- |
| `/`                   | Marketing landing page — not a service listing              |
| `/login`              | Demo login with prefilled credentials                       |
| `/signup`             | Signup form prefilled with demo student data                |
| `/dashboard`          | Overview: stats, upcoming sessions, recent activity         |
| `/dashboard/explore`  | Service marketplace with search and category filters        |
| `/dashboard/saved`    | Saved services shortlist                                    |
| `/dashboard/offers`   | Publish and manage your own offers                          |
| `/dashboard/activity` | Full activity log with filters and summary                  |
| `/dashboard/profile`  | Editable student profile and demo reset                     |

Dashboard routes are protected: visiting one while signed out redirects to
`/login` and returns you to the requested route after sign-in.

## Demo account

```text
Email:    damilare@student.aul.edu.ng
Password: campus1234
```

The login form is prefilled with these details. Signup is prefilled with a
separate demo identity, so submitting the form creates a working account
immediately. Demo state (session, saves, offers and activity) is stored in
`localStorage` and can be cleared from **Profile → Reset demo data**.

## Activity log

These actions are recorded with a timestamp and shown on the dashboard overview
and the full activity page:

- sign in / sign out
- session requests and bookings
- saving or removing a service
- publishing an offer
- profile and account updates

## Run it

```bash
npm install
npm run dev
```

```bash
npm run build    # type-check + production build
npm run lint     # oxlint
```

## Safety and trust

Providers are shown as verified Anchor students. First meetups are expected in
public campus spaces, prices are confirmed in chat before a session, and the
dashboard keeps a private trail of every action for the demo account.

## Design system

The palette follows Anchor University Lagos' official brand colours:

| Token         | Value     | Use                        |
| ------------- | --------- | -------------------------- |
| `--plum-950`  | `#260d25` | Headlines, deep surfaces   |
| `--plum-800`  | `#40173e` | Primary buttons, logo      |
| `--plum-700`  | `#5a2058` | Emphasised display type    |
| `--sky-700`   | `#136894` | Labels, links, verified    |
| `--sky-500`   | `#1b93d0` | Live indicators            |
| `--sky-100`   | `#e8f4fa` | Tags and safety notes      |
| `--paper`     | `#fbf9fb` | Page background            |
| `--line`      | `#ebe4eb` | Dividers and card borders  |

Type is set in **Inter Tight** for UI and **Instrument Serif** for editorial
display accents. All icons are custom inline SVGs; the UI intentionally uses no
emoji.

## PWA

`public/manifest.webmanifest`, `public/sw.js` and the app icons make the app
installable and offline-capable. The service worker is registered in production
only, so development keeps Vite's normal HMR behaviour.

## Contributors

- Onyema Marvellous
- Claude
