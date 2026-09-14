import { DataModelBuilder } from "@platforma-sdk/model";
import { kind } from "@platforma-open/milaboratories.graph-maker.kind";
import type { GraphSeed } from "@platforma-open/milaboratories.graph-maker.kind";
import { optionsStateFromSeed } from "./seedOptions";
import type { BlockData, GraphPageState, LegacyBlockArgs, LegacyUiState } from "./types";

/**
 * Rebuild a page from its seed: what `MainPage.addSection` writes for a brand-new
 * page, plus the data mapping when the seed carries one. A page seeded without a
 * mapping is indistinguishable from one the reader just created.
 */
function pageFromSeed(seed: GraphSeed): GraphPageState {
  return {
    id: seed.id,
    label: seed.label,
    state: {
      template: seed.template,
      title: seed.label,
      ...(seed.optionsState ? { optionsState: optionsStateFromSeed(seed.optionsState) } : {}),
    },
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
