# @amplydevteam/mapbuilder

Minimal Mapbuilder library scaffold.

## Development

```sh
pnpm install
pnpm dev
```

Open the playground Vite dev server and edit `src/index.js` or
`playground/main.js`.

## Build

```sh
pnpm build
```

Build output is `dist/index.js` (ESM-only).

## CDN (unpkg)

```html
<script type="module">
  import { createMapBuilder } from "https://unpkg.com/@amplydevteam/mapbuilder/dist/index.js";

  const mapBuilder = createMapBuilder({ title: "CDN Demo" });
  mapBuilder.mount("#app");
</script>
```

## Release and changelog

```sh
pnpm release
```

This uses `standard-version` to update `CHANGELOG.md` and create a git tag.
