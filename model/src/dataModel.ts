import { DataModelBuilder } from "@platforma-sdk/model";
import { kind } from "@platforma-open/milaboratories.graph-maker.kind";
import type { BlockData, GraphPageState, LegacyBlockArgs, LegacyUiState } from "./types";
import type { GraphSeed } from "@platforma-open/milaboratories.graph-maker.kind";

/**
 * Rebuild a page from its seed. Deliberately identical to what `MainPage.addSection`
 * writes for a brand-new page, so a seeded page and a hand-created one are the same
 * thing: at the chart type's default state, with defaults still to be applied.
 */
function pageFromSeed(seed: GraphSeed): GraphPageState {
  return {
    id: seed.id,
    label: seed.label,
    state: { template: seed.template, title: seed.label },
    settings: { chartType: seed.chartType },
  };
}

export const blockDataModel = new DataModelBuilder({ kind })
  .from<BlockData>("v1")
  // Legacy V1 stored the graph list under `uiState.graphs`; args was always empty.
  .upgradeLegacy<LegacyBlockArgs, LegacyUiState>(({ uiState }) => ({
    graphs: uiState?.graphs ?? [],
  }))
  // `params` is absent for a block created by hand, present when a project template
  // seeds one; both start from the same empty list.
  .init(({ params }) => ({
    graphs: (params?.graphs ?? []).map(pageFromSeed),
  }));
