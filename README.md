# Happy Birthday, Labdhi 🎂

A single-page birthday experience built with Flask + vanilla HTML/CSS/JS —
warm scrapbook / memory-book aesthetic: cream & peach paper tones, polaroid
photo frames, a fairy-light progress strand, floating hearts, and a
handwritten display font throughout.

## Run it

```bash
pip install flask
python app.py
```

Then open **http://localhost:5000** in your browser.

## Before you send it

The two photos are soft pastel placeholder cards so the site runs out of
the box. Replace them with the real ones, keeping the same filenames:

- `static/images/photo1.jpg` — used as the full-screen Hero background
  and in Exhibit A
- `static/images/photo2.jpg` — used in Exhibit B

Any JPG works — photo1 gets covered with a warm overlay as a hero
background, and both get cropped to a 4:5 portrait inside the polaroid
frames, so a reasonably high-res portrait photo looks best.

## Structure

```
app.py
templates/index.html
static/css/style.css
static/js/script.js
static/images/photo1.jpg
static/images/photo2.jpg
static/images/paper-texture.png   ← generated grain texture, used as a tiled background
```

## What's inside

13 scroll-snapped screens telling one continuous story: Welcome →
Verification (with the Maggi callout) → Gift → Hero → Exhibit A → Exhibit B
→ Investigation Report → Mystery → Things That Remind Me Of You → Gujarati
Playful → Breaking News → The Letter → Finale.

- A **fairy-light progress strand** down the right edge (a row of small dots
  along the top on mobile) — each "bulb" lights up as you reach that
  chapter, and you can click any bulb to jump there
- Typewriter intro, an animated verification checklist, an openable gift
  box that bursts into confetti *and* floating hearts together
- Polaroid-framed photos with handwritten captions, tilted slightly like a
  real photo album
- A stamped "100% Guilty" investigation verdict, a wax-sealed envelope you
  tap open, and a closing fireworks moment in the warm palette
- A subtle paper-grain texture tiled behind every screen, plus warm
  ambient floating hearts and sparkles
- Respects `prefers-reduced-motion` and is fully responsive down to mobile
