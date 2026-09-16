# @platforma-open/milaboratories.graph-maker.model

## 1.3.0

### Minor Changes

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

## 1.2.19

### Patch Changes

- e5ba24d: Add Selection Plot option

## 1.2.18

### Patch Changes

- 4266e6b: update dependencies and build tools

## 1.2.17

### Patch Changes

- 0733d15: dependencies update revert

## 1.2.16

### Patch Changes

- 1f936aa: update dependencies

## 1.2.15

### Patch Changes

- 1eb61c6: update dependencies

## 1.2.14

### Patch Changes

- 970eb94: fix loading

## 1.2.13

### Patch Changes

- 2faeee0: update graph-maker version

## 1.2.12

### Patch Changes

- e41f896: update graph-maker version

## 1.2.11

### Patch Changes

- 313688f: technical release
- b00944f: technical release
- 0d8ea0e: technical release

## 1.2.10

### Patch Changes

- 9088610: update dependencies
- 87d9457: Full SDK update

## 1.2.9

### Patch Changes

- d84334d: technical release

## 1.2.8

### Patch Changes

- a30e6b1: update dependencies

## 1.2.7

### Patch Changes

- 696f082: update dependencies

## 1.2.6

### Patch Changes

- 1243508: update dependencies

## 1.2.5

### Patch Changes

- 885ab92: update dependencies

## 1.2.4

### Patch Changes

- 626b44d: new graph button

## 1.2.3

### Patch Changes

- 4bb138d: add heatmap + dendro template

## 1.2.2

### Patch Changes

- db01bb7: update dependencies
- 54ba316: update graph-maker component interface

## 1.2.1

### Patch Changes

- 6503b4f: update new graph page styles, fix pframe import

## 1.2.0

### Minor Changes

- 4315b83: rename packages and clean up

## 1.1.1

### Patch Changes

- 645c3d1: minor update
- 2265cc9: minor update

## 1.1.0

### Minor Changes

- 6d9b91d: block publication
