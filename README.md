# Amara Voss Photography

A single-page photography portfolio for a fictional portrait and landscape photographer. Rebuilt from a plain HTML/CSS site (Assignment 1) using React, Vite and Tailwind CSS.

## Features
- Sticky header with navigation and a "Book a shoot" button
- Hero section with the page's single `<h1>`
- Gallery of 12 photos in a responsive grid (1 column on phones, 2 from `sm`, 3 from `lg`), every image cropped with `object-cover`
- **Category filter** (All / Portrait / Landscape) built with `useState`
- **Favourite button** on every photo, a controlled component whose state lives in `Gallery`
- **"Saved only" toggle**, saved counter and clear button
- **Lightbox**: click a photo to view it larger
- Short about section
- Booking form with controlled inputs and a thank-you message after sending

## Built with
- React (Vite)
- Tailwind CSS, with theme colours and fonts defined in `src/index.css`
- Google Fonts: Playfair Display and Inter
- Plain JavaScript (no TypeScript, no extra libraries)

## How state works
| State | Where | Purpose |
|---|---|---|
| `category` | `Gallery.jsx` | Which category filter is active |
| `favourites` | `Gallery.jsx` | Ids of saved photos, passed down to each `FavouriteButton` |
| `showSavedOnly` | `Gallery.jsx` | Whether to show only saved photos |
| `selectedPhoto` | `Gallery.jsx` | The photo open in the lightbox (`null` = closed) |
| `form`, `submitted` | `Contact.jsx` | Form field values and the thank-you state |

## Project structure
```
src/
├── App.jsx
├── main.jsx
├── index.css
├── data/photos.js        (single source of truth for the gallery)
└── components/
    ├── Header.jsx  Hero.jsx  Gallery.jsx  PhotoCard.jsx
    ├── CategoryFilter.jsx  FavouriteButton.jsx  Lightbox.jsx
    └── About.jsx  Contact.jsx  Footer.jsx
public/images/            (local photos)
```

## Run locally
```bash
git clone [your repo URL]
cd [repo folder]
npm install
npm run dev
```

## Notes
- The booking form is front-end only and does not send data. A backend comes later.
- State is held in memory, so saved favourites reset when the page reloads.
- Photos are free-to-use images from [Unsplash / Pexels]. Credits: [add photographer names].
- The original HTML/CSS version is preserved under the `assignment-1` tag.

## Author
Ifadha Imran