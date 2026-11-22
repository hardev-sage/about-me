# about-me

Personal website of **Saarth Gupta**: skills, hobbies, a roadmap towards studying in Japan in 2028, a portfolio (coming soon) and contact links.

Built with plain **HTML, CSS and JavaScript**. There is no build step and no dependencies.

## Pages

| File | Page |
|---|---|
| `index.html` | Home |
| `skills.html` | Skills |
| `hobbies.html` | Hobbies |
| `next-arc.html` | Roadmap to Japan 2028 |
| `portfolio.html` | Portfolio (under construction) |
| `contact.html` | Contact links |
| `style.css` | Global and home-page styles |
| `inner-pages.css` | Styles for the inner pages |
| `script.js` | Navigation, cursor glow, scroll reveal, copy-email button |

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

## Deploy

Push to GitHub, then go to **Settings > Pages**, choose the `main` branch and the `/ (root)` folder.

## Notes

- Works with the keyboard (skip link, visible focus, mobile menu closes with Escape).
- Respects `prefers-reduced-motion`.
- Hidden easter egg: type `manga` on any page.
