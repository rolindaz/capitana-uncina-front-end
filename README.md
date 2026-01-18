# Capitana Uncina — Frontend

Simple React (Vite) frontend for a textile projects showcase.

## Setup

1) Install deps

`npm install`

2) Configure the API base URL

Copy `.env.example` to `.env` and adjust as needed:

`VITE_API_BASE_URL=http://127.0.0.1:8000`

This app expects these endpoints:

- `/api/projects`
- `/api/yarns`
- `/api/crafts`
- `/api/categories`

Each list item should contain an `id` (or `pk`/`uuid`) field.

3) Run

`npm run dev`

## Header mascot image

Place the mascot image at `public/brand-mascot.png` to show it next to the site title in the navbar.
