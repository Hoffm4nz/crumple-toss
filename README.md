# Crumple Toss

A WebGL paper-toss game. Flick a crumpled ball of paper into a wire wastebasket while a desk fan changes the wind on every throw. Three rooms: Desk (3 m), Office (4.5 m) and Lobby (6 m).

Built with three.js r128, bundled into one file that mounts itself into any page.

## Use it on a page

```html
<div data-crumple-toss data-lock-scroll></div>
<script src="https://cdn.jsdelivr.net/gh/Hoffm4nz/crumple-toss@v1.0.1/dist/crumple-toss.min.js"
        integrity="sha384-…" crossorigin="anonymous" defer></script>
```

| Attribute | What it does |
| --- | --- |
| `data-crumple-toss` | Mounts the game into this element. It fills the full screen height by default. |
| `data-lock-scroll` | Stops the page from scrolling and from pull-to-refresh. Use it on a page that only holds the game. |
| `data-font="…"` | Font family the page already loads. Defaults to `Satoshi` (weights 500, 700 and 900). |
| `style="--ct-height: 600px"` | Sets a fixed height instead of the full screen. |

The game pauses when it is scrolled out of view or the tab is hidden. Scores (current streak and best, per room) are kept in the visitor's browser; thrown papers reset on every visit.

You can also mount it from script: `CrumpleToss.mount(element, { font: 'Satoshi', lockScroll: true })`. It returns `{ destroy() }`.

## Webflow

- `webflow/embed.html` goes in a Code Embed element on the game page.
- `webflow/page-head.html` goes in that page's custom code, inside `<head>`. It sets the page's own favicon and home-screen icon.
- Upload `assets/og-image.jpg` as the page's Open Graph image in Page settings.

## Release a new version

```bash
npm install
npm run build        # writes dist/crumple-toss.min.js
npm run hash         # prints the integrity value for the script tag
git commit -am "…" && git tag v1.0.2 && git push --follow-tags
```

Then update the version in the script URL and the `integrity` value in Webflow. Always point Webflow at a tag, never a branch: the integrity hash makes the browser refuse a file that differs from the one you approved.

## Assets

| File | Use |
| --- | --- |
| `assets/og-image.jpg` | 1200 × 630 share image |
| `assets/favicon.svg`, `assets/favicon-32.png` | Browser tab icon |
| `assets/apple-touch-icon.png` (180), `assets/webclip-256.png`, `assets/icon-512.png` | Home-screen and app icons |

## Third-party code

- three.js r128, © three.js authors, MIT License. Bundled into `dist/crumple-toss.min.js`.
- Lucide icons (`volume-2`, `volume-x`), © Lucide Contributors, ISC License.
