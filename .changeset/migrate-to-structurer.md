---
"@platforma-open/milaboratories.graph-maker": minor
"@platforma-open/milaboratories.graph-maker.model": minor
"@platforma-open/milaboratories.graph-maker.ui": minor
"@platforma-open/milaboratories.graph-maker.workflow": patch
---

Migrate to the block-tools structurer and to BlockModelV3.

- Adopt the tool-managed layout (oxlint/oxfmt, managed tsconfig/turbo/catalog) and
  complete the SDK upgrade (model/ui-vue 1.79, workflow-tengo 6, tengo-builder 4).
- Upgrade @milaboratories/graph-maker to 1.4.6.
- Migrate the model from the legacy V1 API to BlockModelV3. The multi-graph page
  list is unified UI-only state carried over by a one-time legacy upgrader; args
  project to an empty object. The graph-maker plugin is intentionally not adopted
  (the multi-graph plugin is not yet available).
- UI bindings move from app.model.ui to app.model.data; the app uses defineAppV3.
