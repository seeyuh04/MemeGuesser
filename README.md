# Shadow Coin

A mobile-first browser game: identify animal memecoins from their silhouettes.

## 1. Add the meme images

Put PNG/JPG images in `public/memes/` using these filenames:

- `doge.png`
- `wif.png`
- `bonk.png`
- `pengu.png`
- `pepe.png`
- `floki.png`
- `mog.png`
- `pnut.png`
- `shib.png`

For the cleanest silhouette, use a PNG with the character isolated on a transparent background. The game applies a CSS brightness filter so the exact image becomes black during guessing and returns to full color on reveal.

Only use images you have permission to host.

## 2. Test locally

From the project folder:

```bash
python3 -m http.server 8000 -d public
```

Open `http://localhost:8000`.

## 3. Deploy to Vercel

Create a GitHub repository and upload this project. In Vercel, import the repository. This is a static site, so no build command is required. Set the output/public directory to `public` if Vercel asks.

Every push to the production branch can then update the live game.

## Customize

Edit `public/game.js` to add/remove coins, change hints, or change the number of rounds. Add matching image files to `public/memes/`.
