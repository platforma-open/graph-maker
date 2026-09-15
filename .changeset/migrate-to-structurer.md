---
"@platforma-open/milaboratories.graph-maker": minor
"@platforma-open/milaboratories.graph-maker.model": minor
"@platforma-open/milaboratories.graph-maker.ui": minor
"@platforma-open/milaboratories.graph-maker.workflow": patch
---

Migrate to the block-tools structurer and to BlockModelV3.

- Adopt the tool-managed layout (oxlint/oxfmt, managed tsconfig/turbo/catalog) and
  complete the SDK upgrade (model/ui-vue 1.83, workflow-tengo 6, tengo-builder 4,
  block-tools 2.15).
- Upgrade @milaboratories/graph-maker to 1.8.0.
- Migrate the model from the legacy V1 API to BlockModelV3. The multi-graph page
  list is unified UI-only state carried over by a one-time legacy upgrader; args
  project to an empty object. The graph-maker plugin is intentionally not adopted
  (the multi-graph plugin is not yet available).
- UI bindings move from app.model.ui to app.model.data; the app uses defineAppV3.
- Adopt structure v2: the block package becomes a slim facade (block/src/index.ts,
  from-pack-v2 pointer) and the block declares its mandatory kind.
- Declare the block kind's init-params contract: a project template seeds graph
  pages by id, label, chart type, layer template and data mapping. Source ids
  travel taken apart rather than as canonical strings, so the SDK can repoint the
  references inside column ids at the new project's blocks; init rebuilds them
  canonically. The rest of GraphMakerState is per-view bookkeeping and does not
  travel, and neither does per-view bookkeeping — the open tab, the zoom, the lasso,
  or `usedDefaultOptions`, which would stop the new project's defaults being applied.
  The reader's chart settings (axes, layers, statistics, palettes) travel whole rather
  than as a difference from the chart type's defaults: those defaults come from a
  graph-maker module a block model cannot bundle, so a seeded page keeps the defaults
  of the day it was exported.
