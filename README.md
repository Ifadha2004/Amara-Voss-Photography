# Amara Voss Photography

A single-page portfolio website for a fictional portrait and landscape photographer, built with plain HTML5 and CSS3 (no frameworks).

**Live site:** [add your GitHub Pages link here, or delete this line]

## Features
- Sticky header with navigation and a "Book a shoot" button (shortened to "Book" on phones)
- Hero section with the page's single `<h1>`
- Image gallery in CSS Grid, every image cropped with `object-fit: cover`
  - 1 column on phones, 2 from 600px, 3 from 1024px
- Short about section (Flexbox)
- Booking form with name, email, shoot type and message (Flexbox)
- Footer with links and social links (Grid and Flexbox)
- Smooth scrolling, hover effects, visible keyboard focus and reduced-motion support

## Built with
- HTML5 (semantic landmarks: header, nav, main, section, footer)
- CSS3 (custom properties, Flexbox, Grid, media queries, mobile-first)
- Google Fonts: Playfair Display (headings) and Inter (body)

## Images
All images are stored locally in the `images/` folder (no external image links):

| File | Used for |
|---|---|
| `hero.jpg` | Hero background (set in `css/style.css`) |
| `about.jpg` | About section photo |
| `gallery-01.jpg` to `gallery-12.jpg` | Gallery grid |

Photos are free-to-use images from [Unsplash](https://unsplash.com) / [Pexels](https://pexels.com).
Photo credits: [add photographer names and links here]

Images were resized to about 1000-1600px wide to keep the page fast.

## Design
| Role | Colour |
|---|---|
| Background | `#111111` |
| Surface | `#1c1c1c` |
| Text | `#f2f2f2` |
| Muted text | `#9a9a9a` |
| Accent | `#d4a373` |

## Project structure
```
photography_portfolio/
├── index.html
├── css/
│   └── style.css
├── images/
│   ├── hero.jpg
│   ├── about.jpg
│   └── gallery-01.jpg ... gallery-12.jpg
└── README.md
```

## Run locally
1. Clone the repo: `git clone [your repo URL]`
2. Open `index.html` in a browser.

## Responsive testing
Checked for no horizontal scroll at 320px, 768px and 1280px.

## Notes
- The booking form is front-end only and does not send data.
- Based on feedback from the assessment session, images were moved from external URLs to a local `images/` folder.

## Author
Ifadha Imran, built as part of Group D3.