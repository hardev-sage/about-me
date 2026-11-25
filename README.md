# about-me

Personal website of **Saarth Gupta**: skills, hobbies, a roadmap towards studying in Japan in 2028, a portfolio (coming soon) and contact links.

Built with plain **HTML, CSS and JavaScript**. There is no build step and no dependencies.

## Pages

| File | Page |
|---|---|
| `index.html` | Home with a character card that switches between Build, Debug and Explore modes |
| `skills.html` | Skills, with a skill cone that stacks up to three skills and emails Saarth about them |
| `hobbies.html` | Hobbies with a random hobby roller |
| `next-arc.html` | Roadmap to Japan 2028 with a day countdown |
| `portfolio.html` | Portfolio (under construction) |
| `contact.html` | Contact links and copy-email button |
| `style.css` | All styles |
| `script.js` | Character modes, skill cone, hobby roller, countdown, copy-email button, easter egg |
| `favicon.svg` | Browser tab icon |
| `scoop-blueprint.svg` | Portfolio page illustration |

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

## Deploy

Push to GitHub, then go to **Settings > Pages**, choose the `main` branch and the `/ (root)` folder.

## Notes

- Works with the keyboard (skip link, visible focus, pressed states on toggles).
- Respects `prefers-reduced-motion`.
- Pages work without JavaScript; the interactive tools appear only when it is available.
- Hidden easter egg: type `manga` on any page.
