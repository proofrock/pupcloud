## Change port of `run dev`

In `package.json`:

```json
"scripts": {
  [...]
  "start": "sirv public --no-clear --port 17178 --host",
```

## Rollup: avoid typescript map warning

https://stackoverflow.com/questions/63128597/how-to-get-rid-of-the-rollup-plugin-typescript-rollup-sourcemap-option-must

Change to `rollup.config.js`:

```
- output: {
- 		sourcemap: true,
+ output: {
+ 		sourcemap: !production,
```

**NOTE**: this disables source maps in production. Not what you want?

## Include css framework

https://stackoverflow.com/questions/56483209/import-css-in-node-modules-to-svelte

In `App.svelte`:

```
import "../node_modules/axentix/dist/axentix.min.css";
```

Where js module is needed:

```
import { Dropdown, destroy } from "axentix";
```
