import { canonicalizeJson } from "@platforma-sdk/model";
import type {
  SeedAesMapping,
  SeedComponent,
  SeedOptionsState,
  SourceId,
} from "@platforma-open/milaboratories.graph-maker.kind";
import type { GraphMakerState } from "@milaboratories/graph-maker";

type LiveOptionsState = NonNullable<GraphMakerState["optionsState"]>;
type LiveComponent = LiveOptionsState["components"][string];

/**
 * Translation between how graph-maker holds a data mapping and how a template
 * seed carries it. The two differ in one leaf: live, a selected source is the
 * canonical string of its identifier; in a seed it is that identifier taken
 * apart, so the SDK's reference relocator can reach the `PlRef` inside a column
 * id on the way in. See `SourceId` in the kind for why.
 *
 * The split and the rebuild are inverses, and the rebuild must be canonical:
 * an identifier IS its canonical string, so an id reassembled with its keys in
 * another order is a different identifier for the same column and resolves to
 * nothing. `canonicalizeJson` is the same function pf-plots builds these ids
 * with, so the string handed back is the one graph-maker would have computed.
 */
function splitSourceId(id: string): SourceId {
  return JSON.parse(id) as SourceId;
}

function joinSourceId(id: SourceId): string {
  return canonicalizeJson(id);
}

export function optionsStateToSeed(live: LiveOptionsState): SeedOptionsState {
  const components: Record<string, SeedComponent> = {};
  for (const [key, component] of Object.entries(live.components)) {
    components[key] = {
      ...component,
      selectorStates: component.selectorStates.map((s) => ({
        ...s,
        selectedSource: splitSourceId(s.selectedSource),
      })),
    } as SeedComponent;
  }
  return { type: live.type, components, dividedAxes: { ...live.dividedAxes } };
}

export function optionsStateFromSeed(seed: SeedOptionsState): LiveOptionsState {
  const components: Record<string, LiveComponent> = {};
  for (const [key, component] of Object.entries(seed.components)) {
    components[key] = {
      ...component,
      selectorStates: component.selectorStates.map((s) => ({
        ...s,
        selectedSource: joinSourceId(s.selectedSource),
      })),
    } as LiveComponent;
  }
  return { type: seed.type, components, dividedAxes: { ...seed.dividedAxes } };
}

type LiveDataBindAes = NonNullable<GraphMakerState["dataBindAes"]>;

/**
 * The colour mappings, re-keyed for travel.
 *
 * graph-maker holds them in a map keyed by the source id, and a key is a string — so the
 * reference inside it is past the reach of relocation. Each entry travels with its source taken
 * apart instead, and the key is rebuilt canonically on the way back so it matches the id
 * graph-maker looks the mapping up by.
 */
export function dataBindAesToSeed(live: LiveDataBindAes): SeedAesMapping[] {
  return Object.entries(live).map(([source, mapping]) => ({
    source: splitSourceId(source),
    mapping: mapping as unknown as Record<string, unknown>,
  }));
}

export function dataBindAesFromSeed(seed: SeedAesMapping[]): LiveDataBindAes {
  return Object.fromEntries(
    seed.map(({ source, mapping }) => [joinSourceId(source), mapping]),
  ) as unknown as LiveDataBindAes;
}
