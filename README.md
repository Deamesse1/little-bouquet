# A little bouquet

A self-contained Three.js digital gift: five layered pink peonies and fourteen six-petal lilies (eight ivory and six pink), built entirely from solid 3D pixel geometry. No generated images, build tools, paid services, analytics or external runtime requests.

## Run locally

Open this folder in VS Code. In Terminal → New Terminal run:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Visit http://127.0.0.1:8000. Use an HTTP server rather than double-clicking index.html, because JavaScript modules require HTTP. Stop the server with Control+C.

The bouquet rotates indefinitely while the page is visible. Drag to explore, or use left/right arrows while the artwork is focused. Automatic rotation resumes when you release the bouquet.

## Personalise

Edit `config.js` to change the message and rotation duration. Flower arrangement and palette live in `flowers.js`; page styling is in `style.css`.

## Publish with GitHub Pages

1. Create a public GitHub repository named `little-bouquet`.
2. Upload all the contents of this folder to its root, including the entire `vendor` folder. `index.html` must be at the repository root.
3. In the repository choose Settings → Pages.
4. Under Build and deployment, choose Deploy from a branch, select `main` and `/ (root)`, then Save.
5. Once deployment finishes, GitHub displays your link: `https://YOUR-USERNAME.github.io/little-bouquet/`.

Official guide: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

All resource paths are relative, so repository subpaths work. Your published message and source are public.

## Implementation

Curved petal surfaces are sampled using fine, solid cubes and batched into a single instanced mesh. Six overlapping whorls create each peony; lilies have six individually curved petals, pink throat details and six stamens. Each flower is oriented independently in 3D, with stems converging at a ribbon tie. Lighting illuminates both front and back. A capped render resolution keeps GPU work bounded on phones.

Three.js r170 is vendored under its MIT licence in `vendor/THREE-LICENSE.txt`.
