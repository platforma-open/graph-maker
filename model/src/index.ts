import { BlockModelV3, createPFrameForGraphs, type InferOutputsType } from "@platforma-sdk/model";
import { blockDataModel } from "./dataModel";
import type { BlockArgs } from "./types";

export { blockDataModel } from "./dataModel";
export * from "./types";

export const platforma = BlockModelV3.create(blockDataModel)
  .args<BlockArgs>(() => ({}))
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
