import { BlockModelV3, createPFrameForGraphs, type InferOutputsType } from "@platforma-sdk/model";
import { kind } from "@platforma-open/milaboratories.graph-maker.kind";
import { blockDataModel } from "./dataModel";
import type { BlockArgs } from "./types";

export { blockDataModel } from "./dataModel";
export * from "./types";

export const platforma = BlockModelV3.create({ dataModel: blockDataModel, kind })
  .args<BlockArgs>(() => ({}))
  // Inverse of `init`'s seed expansion: the fields a page can be re-created from —
  // the chart, and the data mapping that resolves by column spec rather than by
  // anything project-local. The rest of `GraphMakerState` is per-view bookkeeping
  // and does not travel; see `GraphSeed` in the kind.
  .templateParams((data) => ({
    graphs: data.graphs.map((g) => ({
      id: g.id,
      label: g.label,
      chartType: g.settings.chartType,
      template: g.state.template,
      optionsState: g.state.optionsState,
    })),
  }))
  .sections((ctx) => {
    const graphRoutes = ctx.data.graphs.map((gs) => ({
      type: "link" as const,
      href: `/graph?id=${gs.id}` as const,
      label: gs.label,
    }));
    return [
      ...graphRoutes,
      {
        type: "link" as const,
        href: "/" as const,
        appearance: "add-section" as const,
        label: "New Graph",
      },
    ];
  })
  .outputWithStatus("pFrame", (ctx) => createPFrameForGraphs(ctx))
  .done();

export type Platforma = typeof platforma;
export type BlockOutputs = InferOutputsType<typeof platforma>;
