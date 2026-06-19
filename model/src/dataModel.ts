import { DataModelBuilder } from "@platforma-sdk/model";
import type { BlockData, LegacyBlockArgs, LegacyUiState } from "./types";

export const blockDataModel = new DataModelBuilder()
  .from<BlockData>("v1")
  // Legacy V1 stored the graph list under `uiState.graphs`; args was always empty.
  .upgradeLegacy<LegacyBlockArgs, LegacyUiState>(({ uiState }) => ({
    graphs: uiState?.graphs ?? [],
  }))
  .init(() => ({
    graphs: [],
  }));
