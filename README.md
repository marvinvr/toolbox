# toolbox

Simple browser-based tools and games. All projects run entirely in the browser with no backend required.

## About

Hey, I'm Marvin, a developer who likes building small, practical things. Sometimes it's just easier to whip something up in JavaScript than to download an entire app or deal with complicated software. So here's a bunch of browser tools I made for myself that you might find useful too.

Learn more about me at [marvinvr.ch](https://marvinvr.ch).

## Tools

### Thumbnail Generator
Create YouTube thumbnails with custom backgrounds and text overlays. Upload an image, add your text, and export as PNG.

**Path:** `/thumbnail-generator/`

### VS Image Generator
Create side-by-side comparison images with a stylish VS divider. Upload two images and export the comparison.

**Path:** `/vs-image-generator/`

### Rocket Game
3D space exploration game powered by Three.js. Pilot a rocket through the solar system, manage fuel, and land on planets.

**Path:** `/rocket-game/`

## Running Locally

Just serve the directory with any static file server:

```bash
python -m http.server 8000
# or
npx serve
```

Then visit `http://localhost:8000` and navigate to the tool you want.

## Deployment

### Docker

Build and run the entire toolbox:

```bash
docker build -t toolbox .
docker run -p 8080:80 toolbox
```

### Static Hosting

All projects are static and can be deployed to any hosting service (GitHub Pages, Netlify, Vercel, etc.).

## License

MIT
