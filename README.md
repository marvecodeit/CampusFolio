# Campus Folio

The student services marketplace for **Anchor University Lagos**. Students can
offer and book tutoring, design, tech help, writing, errands and music lessons
across campus.

This repository contains the responsive home screen, including search, category
filtering, saved services, a service detail sheet and an offer composer.

## Run it

```bash
npm install
npm run dev
```

```bash
npm run build    # type-check + production build
npm run lint     # oxlint
```

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

Type is set in **Inter Tight** for UI and **Instrument Serif** for the editorial
hero accent. All icons are custom inline SVGs; the UI intentionally uses no
emoji.

## PWA

`public/manifest.webmanifest`, `public/sw.js` and the app icons make the home
screen installable and offline-capable. The service worker is registered in
production only, so development keeps Vite's normal HMR behaviour.
