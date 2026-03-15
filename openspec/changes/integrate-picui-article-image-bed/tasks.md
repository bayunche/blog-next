## 1. Provider Foundation

- [x] 1.1 Extend runtime and example configuration to support PicUI API settings, provider defaults, and frontend public-image-host allowlisting across `.env` examples, Docker manifests, and Next.js build configuration.
- [x] 1.2 Implement a PicUI upload adapter and provider-agnostic response normalization in the backend image-bed utility layer.

## 2. Secure Upload Boundaries

- [x] 2.1 Bring provider-backed article-media upload routes under authenticated admin management and ensure unauthenticated callers are rejected before any external upload is attempted.
- [x] 2.2 Preserve the protected local upload path as an explicit fallback option and return actionable upload failure/fallback messages for editorial workflows.

## 3. Article Editor Integration

- [x] 3.1 Update `cover` and `cardCover` upload flows in the admin article editor to use the protected PicUI-backed upload helper and clearly report provider-vs-local outcomes.
- [x] 3.2 Add managed inline Markdown image upload/insertion support in the admin article editor using the same normalized upload helper.

## 4. Public Rendering And Validation

- [x] 4.1 Update public image-host handling so externally hosted article cover media renders correctly on list/detail pages while Markdown inline images continue to render through standard HTML image tags.
- [x] 4.2 Run targeted validation for admin authoring uploads and public article rendering, and document residual risk from the repository's known `lint` and `build` blockers plus any unresolved provider-host assumptions.

## Validation Notes

- Targeted validation completed with `npx eslint src/app/admin/components/ArticleEditor.tsx next.config.ts`; the remaining warnings are three existing admin preview `<img>` usages covered by `@next/next/no-img-element`, with no errors.
- Backend syntax validation completed with `node --check` for `server/utils/imageBed.js`, `server/controllers/upload.js`, `server/config/index.js`, and `server/middlewares/authHandler.js`.
- Local runtime configuration was verified from `server/.env`; the resolved provider is `picui`, public host is `https://free.picui.cn`, strategy ID is `9`, and the PicUI token is present.
- Residual repository risk remains unchanged: full `npm run build` is still expected to fail in this environment because the repo is missing the Windows-native `lightningcss` binary required by the existing toolchain.
