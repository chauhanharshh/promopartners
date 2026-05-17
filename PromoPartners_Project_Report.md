# Project Report: PromoPartners

**Date:** May 16, 2026  
**Project Name:** PromoPartners  
**Platform:** Web (Landing Page)  
**Type:** Premium Brand Promotions & PR Agency Site  

---

## 1. Executive Summary
PromoPartners is a high-end, editorial-style landing page designed for a premium brand promotions and PR agency. The primary goal of the site is to exude luxury, professionalism, and modern design aesthetics. Recently, the website underwent a complete UI/UX overhaul transitioning from a standard corporate look to a visually striking, photography-centric editorial layout with advanced micro-interactions and cinematic media handling.

## 2. Technical Stack
The project is built emphasizing performance, rich aesthetics, and minimalism without relying on heavy frontend frameworks for the static UI.

* **Core Structure:** HTML5
* **Styling:** Vanilla CSS3 (Custom properties for theming, Flexbox/Grid for layout, Backdrop-filter blur, CSS Keyframe animations)
* **Interactivity & Animations:** Vanilla JavaScript & **GSAP (GreenSock Animation Platform)**
* **Media Optimization:** Cloudinary Dynamic Video & Image Transformations (`q_auto,f_auto`)
* **Version Control:** Git & GitHub

*(Note: While initial scaffolding included Next.js, the project has successfully transitioned into a highly optimized static site architecture).*

## 3. Design System

### 3.1. Typography
Typography is a crucial element of the editorial feel, relying on premium fonts:
* **Headings:** `Bebas Neue` & `Barlow Condensed` (Bold, tall, and impactful for titles).
* **Editorial Serif:** `DM Serif Display` (Elegant serif used for magazine-style quotes and media logos).
* **Body Text:** `Inter` (Clean, highly readable, and modern).

### 3.2. Color Palette
The color scheme revolves around a "Modern Minimalist" aesthetic:
* **Deep Charcoal (`#2D3436`):** Primary background for maximum contrast.
* **Beige (`#F5F0E8`):** Used for intro sections to give a magazine paper feel.
* **Accent Gold (`#C9A227`):** Primary highlight color used for buttons, cursors, borders, and text accents.
* **Soft Grey (`#DFE6E9`):** Secondary structural backgrounds.
* **Pure White (`#FFFFFF`):** Text on dark backgrounds.

## 4. Key UI/UX Features

### Interactive "Origami" Custom Cursor
* Replaced the standard system cursor with a custom GSAP-powered SVG cursor shaped like an origami arrow.
* Features a dual-tone cyan/blue design that dynamically turns **Gold** and scales up (`1.4x`) when hovering over interactive elements (buttons, links, images).

### Editorial 3x5 Magazine Grid
* **Asymmetric Layout:** A 3-row by 5-column edge-to-edge grid with zero gutters (`gap: 0`), creating an authentic high-fashion magazine aesthetic.
* **Visual Filtering:** Alternates between vibrant color campaign photography and high-contrast black-and-white images (`filter: grayscale(100%)`).
* **Typographic Center Cell:** Features an elegant beige typographic cell in the exact center (`Row 2, Column 3`) highlighting the agency's "ICONIC" campaign moments in `DM Serif Display`.

### Advanced Video Interaction Logic ("Work That Speaks")
* **Default State:** All 4 portrait video cards play simultaneously on loop, muted, at equal brightness (`0.85`).
* **Hover State:** When hovering over any card, only that card's video continues playing while the other 3 pause and dim to `0.35` brightness. The hovered card scales up (`1.03x`), gains full brightness, and displays a glowing gold border.
* **Fullscreen Modal:** Clicking any card opens a custom dark-mode (`rgba(0,0,0,0.92)`) modal displaying the video centered in 9:16 portrait mode with native controls on hover, dismissible via clicking outside, clicking the close button, or pressing the `Escape` key.

### Comprehensive Global Animations
* **Cinematic Hero Video:** Autoplaying background video optimized with Cloudinary transformations and poster placeholders.
* **Typewriter Subtitle:** A looped typewriter effect cycling smoothly through core competencies ("BRAND PROMOTIONS", "INFLUENCER MARKETING", "PR & MEDIA").
* **Scroll Progress Bar:** A fixed 4px gold progress bar at the top of the viewport dynamically tracking the user's scroll depth.
* **Smooth Scroll & Page Fade-In:** Implements native `scroll-behavior: smooth`, navbar backdrop blur on scroll, and a global page fade-in animation on initial load.
* **Stats Counter Animation:** Utilizes `IntersectionObserver` to animate stat counters smoothly when scrolled into the viewport.

## 5. Recent Milestones & Refactoring
1. **Editorial Grid Redesign:** Successfully migrated the photo grid section into an exact 3x5 magazine collage layout with zero gutters and a central serif typographic cell.
2. **Media Logic & Modal Overhaul:** Developed custom group-hover video pausing/dimming logic and a dedicated custom fullscreen video modal replacing native fullscreen behavior.
3. **Global Animation Polish:** Integrated a global scroll progress bar, smooth scrolling navigation, pulsing button glow animations, and polished typography spacing across all sections.

## 6. Future Recommendations
* **Modularization:** Extract the inline CSS and JavaScript from `index.html` into dedicated `style.css` and `main.js` files to improve long-term maintainability.
* **Backend Integration:** Connect the Web3Forms modal to a production backend or CRM to capture client lead data automatically.
* **Asset Optimization:** Download the currently hotlinked Unsplash images and serve them locally (or via a CDN) in WebP format for improved load speeds and SEO ranking.
