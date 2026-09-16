# @platforma-open/milaboratories.graph-maker.workflow

## 1.2.5

### Patch Changes

- 374a0a9: Migrate to the block-tools structurer and to BlockModelV3.

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
    The reader's chart settings (axes, layers, statistics) travel whole rather
    than as a difference from the chart type's defaults: those defaults come from a
    graph-maker module a block model cannot bundle, so a seeded page keeps the defaults
    of the day it was exported. Colour mappings travel as a list keyed by the source
    taken apart, not by the id string graph-maker keys them with, so the column or axis
    each colour was chosen for is repointed at the new project rather than naming a block
    that is not there.

## 1.2.4

### Patch Changes

- e5ba24d: Add Selection Plot option

## 1.2.3

### Patch Changes

- 313688f: technical release
- b00944f: technical release
- 0d8ea0e: technical release

## 1.2.2

### Patch Changes

- d84334d: technical release

## 1.2.1

### Patch Changes

- b41cab6: add loading to main page

## 1.2.0

### Minor Changes

- 4315b83: rename packages and clean up

## 1.1.0

### Minor Changes

- 6d9b91d: block publication
