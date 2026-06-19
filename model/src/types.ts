import type { GraphMakerProps, GraphMakerState } from "@milaboratories/graph-maker";

/**
 * The graph-maker block has no workflow inputs — its workflow is a pass-through
 * and all of its state is UI-only view state (the user-created graph pages).
 * Args therefore project to an empty object and never gate the block.
 */
export type BlockArgs = Record<string, never>;

export type GraphPageState = {
  id: string;
  label: string;
  state: GraphMakerState;
  /** Only `chartType` is consumed; the live pFrame comes from the model output. */
  settings: Pick<GraphMakerProps, "chartType">;
};

/**
 * Unified V3 data. Everything here is pure UI/view state (the list of graph
 * pages) — nothing is projected into args/prerunArgs.
 */
export type BlockData = {
  graphs: GraphPageState[];
};

/** Legacy V1 on-disk shapes, consumed once by `.upgradeLegacy`. */
export type LegacyBlockArgs = Record<string, never>;
export type LegacyUiState = {
  graphs?: GraphPageState[];
};
