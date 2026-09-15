import { canonicalizeJson, parseJson } from "@platforma-sdk/model";
import type { CanonicalizedJson } from "@platforma-sdk/model";
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
 * Taking apart and rebuilding are inverses, and the rebuild must be canonical:
 * an identifier IS its canonical string, so an id reassembled with its keys in
 * another order is a different identifier for the same column and resolves to
 * nothing. `canonicalizeJson` is the same function pf-plots builds these ids
 * with, so the string handed back is the one graph-maker would have computed.
 *
 * The cast is only the SDK's brand meeting pf-plots' plain `ColumnOrAxisIdString`;
 * the kind checks every field of what comes out.
 */
export function convertOptionsStateToSeed(live: LiveOptionsState): SeedOptionsState {
  const components: Record<string, SeedComponent> = {};
  for (const [key, component] of Object.entries(live.components)) {
    components[key] = {
      ...component,
      selectorStates: component.selectorStates.map((s) => ({
        ...s,
        selectedSource: parseJson(s.selectedSource as CanonicalizedJson<SourceId>),
      })),
    } as SeedComponent;
  }
  return { type: live.type, components, dividedAxes: { ...live.dividedAxes } };
}

export function getOptionsStateFromSeed(seed: SeedOptionsState): LiveOptionsState {
  const components: Record<string, LiveComponent> = {};
  for (const [key, component] of Object.entries(seed.components)) {
    components[key] = {
      ...component,
      selectorStates: component.selectorStates.map((s) => ({
        ...s,
        selectedSource: canonicalizeJson(s.selectedSource),
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
export function convertDataBindAesToSeed(live: LiveDataBindAes): SeedAesMapping[] {
  return Object.entries(live).map(([source, mapping]) => ({
    source: parseJson(source as CanonicalizedJson<SourceId>),
    mapping: mapping as unknown as Record<string, unknown>,
  }));
}

export function getDataBindAesFromSeed(seed: SeedAesMapping[]): LiveDataBindAes {
  return Object.fromEntries(
    seed.map(({ source, mapping }) => [canonicalizeJson(source), mapping]),
  ) as unknown as LiveDataBindAes;
}
