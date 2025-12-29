# Screenshots & Ilustrace pro SocialMat Landing Page

Tento adresář obsahuje screenshoty a ilustrace použité na landing page.

## Hlavní Accent Barva

**Cyan/Teal (#22d3ee / #14b8a6)** - používá se konzistentně napříč celým webem:
- Hero nadpis underline
- Live badge indicators
- AI Brainstorm karta accent
- Pricing highlight plán
- Stats metriky
- Dekorativní elementy

## Required Screenshots

### 1. Hero Section
- **Soubor:** `dashboard-main.png`
- **Rozměry:** 4:3 aspect ratio (např. 1600x1200px)
- **Popis:** Hlavní screenshot SocialMat dashboardu
- **Umístění:** Hero sekce, pravá strana jako hlavní vizuál
- **Poznámka:** S Live badge overlay (cyan dot) a floating cyan/teal gradient orb
- **Styl:** Clean dashboard overview zobrazující hlavní workspace

### 2. Features Section - Video Editor
- **Soubor:** `video-editor.png`
- **Rozměry:** 16:10 aspect ratio (např. 1920x1200px)
- **Popis:** Video editor interface s titulky
- **Umístění:** Features grid - Video Editor karta (s gradient overlay)
- **Styl:** Ukázka video editoru s timeline, titulky, player

### 3. Features Section - Analytics Preview
- **Soubor:** `analytics-preview.png`
- **Rozměry:** 16:10 aspect ratio (např. 1920x1200px)
- **Popis:** Analytics dashboard preview
- **Umístění:** Features grid - Analytics karta (s gradient overlay)
- **Styl:** Grafy, metriky, charts preview

### 4. Automation Section
- **Soubor:** `chatbot-flow.png`
- **Rozměry:** 16:9 aspect ratio (např. 1920x1080px)
- **Popis:** Chatbot automation flow a pravidel
- **Umístění:** Automation sekce, vlevo pod benefit kartami
- **Styl:** Flow diagram, response templates, automation rules
- **Fallback:** Green/teal gradient s chatbot ikonami

### 5. Insights Section
- **Soubor:** `analytics-dashboard.png`
- **Rozměry:** 16:9 aspect ratio (např. 1920x1080px)
- **Popis:** Full analytics dashboard s metrikami a insights
- **Umístění:** Insights sekce, nad Command room widgety
- **Styl:** Komplexní grafy, metriky, AI recommendations, live data
- **Fallback:** Blue/purple gradient s analytics ikonami

### 6. Testimonials Section
- **Soubor:** `testimonials-grid.png`
- **Rozměry:** 21:9 aspect ratio (ultra-wide, např. 2520x1080px)
- **Popis:** Grid testimonials nebo social proof elements
- **Umístění:** Testimonials sekce, nad testimonial kartami
- **Styl:** Kolekce user reviews, screenshots z sociálních sítí, ratings
- **Fallback:** Gradient placeholder

## Features Section - Card Grid

Features section používá 6 modulních karet:

1. **AI Brainstorm** - Cyan accent (icon background + border)
   - Brain ikona v cyan bordered boxu
   
2. **Video Editor & Titulky** - S embedded screenshotem
   - Screenshot preview nahoře (16:10 aspect)
   - Gradient overlay zdola
   
3. **Analytics** - S embedded screenshotem
   - Screenshot preview nahoře (16:10 aspect)
   - Gradient overlay zdola
   
4. **Auto-reply** - Standardní karta
   - MessageSquare ikona
   
5. **Plánování** - Standardní karta
   - Calendar ikona
   
6. **Stories & Reels** - Standardní karta
   - Image ikona

## Design System - Ilustrativní Elementy

### Dekorativní Shapes
Použity geometrické tvary v cyan/teal barvách:

**Hero:**
- Floating gradient orb (cyan-to-teal, blur-3xl)
- Rotated square border (16x16, border-2, border-cyan-400/20, rotate-12)
- Circle shape (12x12, bg-cyan-400/10)

**Automation:**
- Large circle border (20x20, border-2, border-cyan-400/10)
- Rotated square (16x16, bg-cyan-400/5, rotate-45)
- Radial gradient background (cyan/teal)

### Accent Applications
- **Live indicators:** Cyan-400 animated pulse dots
- **Underlines:** Cyan-300 decoration na hero headline
- **Icon backgrounds:** Cyan-500/10 (dark) nebo cyan-50 (light) s cyan border
- **Highlight cards:** Cyan gradient backgrounds
- **Stats:** Cyan-300 text color pro key metrics

## Technické požadavky

- **Formát:** PNG nebo WebP (pro lepší kompresi)
- **Kvalita:** High-DPI ready (2x rozlišení pro retina displays)
- **Optimalizace:** Komprimované pro web (použij TinyPNG nebo podobný nástroj)
- **Dark mode:** Screenshoty by měly dobře vypadat na tmavém i světlém pozadí
- **Focus:** Screenshoty by měly ukazovat horní část UI (object-cover, object-top)

## Fallback Behavior

Pokud screenshot není k dispozici, komponenta automaticky zobrazí:
- Gradient pozadí v brand barvách (specifické pro sekci)
- Placeholder text s názvem sekce
- Grid placeholder boxes simulující UI elementy

## Struktura

```
/public/screenshots/
  ├── README.md (tento soubor)
  ├── dashboard-main.png (4:3)
  ├── video-editor.png (16:10)
  ├── analytics-preview.png (16:10)
  ├── chatbot-flow.png (16:9)
  ├── analytics-dashboard.png (16:9)
  └── testimonials-grid.png (21:9)
```

## Barevná Paleta

**Hlavní accent:** Cyan/Teal
- cyan-300: #67e8f9
- cyan-400: #22d3ee (primární)
- cyan-500: #06b6d4
- teal-400: #2dd4bf
- teal-500: #14b8a6
- teal-700: #0f766e

Používá se pro všechny accent elementy, hover states, highlights a key visual points napříč webem.
