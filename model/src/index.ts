import { BlockModelV3, createPFrameForGraphs, type InferOutputsType } from "@platforma-sdk/model";
import { kind } from "@platforma-open/milaboratories.graph-maker.kind";
import { blockDataModel } from "./dataModel";
import { dataBindAesToSeed, optionsStateToSeed } from "./seedOptions";
import type { BlockArgs } from "./types";

export { blockDataModel } from "./dataModel";
export * from "./types";

export const platforma = BlockModelV3.create({ dataModel: blockDataModel, kind })
  .args<BlockArgs>(() => ({}))
  // Inverse of `init`'s seed expansion: the fields a page can be re-created from —
  // the chart, and the data mapping, with every source id taken apart so the SDK
  // can repoint its references at the new project's blocks. The rest of
  // `GraphMakerState` is per-view bookkeeping and does not travel; see `GraphSeed`
  // and `SourceId` in the kind.
  .templateParams((data) => ({
    graphs: data.graphs.map((g) => ({
      id: g.id,
      label: g.label,
      chartType: g.settings.chartType,
      template: g.state.template,
      optionsState: g.state.optionsState && optionsStateToSeed(g.state.optionsState),
      // Carried whole; see `GraphSeed` in the kind for why not as a difference from the
      // defaults. What is left behind is per-view bookkeeping — the open tab, the zoom, the
      // lasso, whether the tooltip hint was shown — and `usedDefaultOptions`, which records
      // which defaults were already applied and would stop the new project's from being.
      axesSettings: g.state.axesSettings,
      layersSettings: g.state.layersSettings,
      statisticsSettings: g.state.statisticsSettings,
      dataBindAes: g.state.dataBindAes && dataBindAesToSeed(g.state.dataBindAes),
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
