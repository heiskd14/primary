---
name: ESM build path resolution
description: How to correctly resolve paths to sibling workspace packages from the api-server after esbuild compilation.
---

When the api-server is compiled by esbuild into `dist/index.mjs`, `__dirname` resolves to the `dist/` directory inside the artifact, not the workspace root. Any relative path traversal like `../../../../../sibling-package` computes incorrectly (lands at `/home/` instead of `/home/runner/workspace/`).

**Rule:** Use `process.cwd()` (which is always `/home/runner/workspace` at runtime) to reference sibling artifacts:

```typescript
// WRONG
const dir = path.resolve(__dirname, "../../../../../artifacts/school-website/public/uploads");

// CORRECT
const dir = path.resolve(process.cwd(), "artifacts/school-website/public/uploads");
```

**Why:** esbuild bundles the source into a flat dist file; `__dirname` in ESM mode is the dir of that bundled file, not the original source. `process.cwd()` is stable regardless of where the bundle lives.

**How to apply:** Any time the api-server needs to reference a path outside `artifacts/api-server/` (e.g., static file uploads into the frontend's `public/` directory), use `process.cwd()`.
