import { assertParamsObject, defineBlockKind } from "@platforma-sdk/block-kind";
import type { GraphMakerProps, GraphMakerState } from "@milaboratories/graph-maker";
import { name, version } from "../package.json" with { type: "json" };

type ChartType = GraphMakerProps["chartType"];
type LayersTemplate = GraphMakerState["template"];
type OptionsState = NonNullable<GraphMakerState["optionsState"]>;
type ComponentState = OptionsState["components"][string];
type SimpleSelector = Extract<ComponentState, { type: "simple" }>["selectorStates"][number];
type FilterSelector = Extract<ComponentState, { type: "filter" }>["selectorStates"][number];

/** Fails to compile if `T` is anything but `never` — see the two exhaustiveness checks below. */
type AssertNever<T extends never> = T;

/**
 * The chart types a seed may name. Listed rather than derived because a runtime
 * check needs values, not a type — but the list is held to the type by the
 * compiler (`satisfies` rejects a stale entry, `AssertNever` rejects a missing
 * one), so a graph-maker release that adds or drops a chart type breaks this
 * build instead of silently letting a template through with a chart the editor
 * cannot open.
 */
const CHART_TYPES = [
  "discrete",
  "scatterplot",
  "scatterplot-umap",
  "heatmap",
  "dendro",
  "histogram",
  "bubble",
  "selection",
] as const satisfies readonly ChartType[];
type _ChartTypesExhaustive = AssertNever<Exclude<ChartType, (typeof CHART_TYPES)[number]>>;

/** The layer templates a seed may name. Held to `LayersTemplate` the same way. */
const LAYERS_TEMPLATES = [
  "box",
  "binnedDots",
  "jitteredDots",
  "violin",
  "bar",
  "stackedBar",
  "stackedArea",
  "line",
  "errorbar",
  "sina",
  "logo",
  "box_binnedDots",
  "box_jitteredDots",
  "violin_binnedDots",
  "violin_jitteredDots",
  "line_jitteredDots",
  "line_binnedDots",
  "line_errorbar",
  "bar_line",
  "bar_errorbar",
  "dots",
  "curve",
  "curve_dots",
  "heatmap",
  "heatmapClustered",
  "dendro",
  "bins",
  "bubble",
  "selection",
] as const satisfies readonly LayersTemplate[];
type _LayersTemplatesExhaustive = AssertNever<
  Exclude<LayersTemplate, (typeof LAYERS_TEMPLATES)[number]>
>;

/**
 * One graph page, reduced to what re-creating it actually takes.
 *
 * `template` and `chartType` choose the chart; `optionsState` is the data
 * mapping — which column or axis feeds each input, and the filters on them.
 * The mapping travels because it is not tied to the project it was built in:
 * a selected source is stored as the canonical string of
 * `{ kind, name, type, domain }`, a spec identity that resolves in any project
 * whose pFrame exposes a column with the same spec.
 *
 * `chartType` is kept alongside `template` because it is not derivable from it:
 * the UMAP scatterplot shares template `dots` with the ordinary one.
 *
 * What stays behind is per-view bookkeeping — zoom, the open tab, lasso
 * polygons, whether the tooltip hint was shown — and the cosmetic layers.
 * A seeded page therefore opens on the right chart, already bound to its data,
 * at the chart type's default styling.
 */
export type GraphSeed = {
  id: string;
  label: string;
  chartType: ChartType;
  template: LayersTemplate;
  /** Absent for a page whose data mapping the reader never touched. */
  optionsState?: OptionsState;
};

/**
 * This block's init-params contract — the graph pages a project template seeds a
 * new graph-maker with. Each page arrives on its chart, bound to whatever of its
 * mapping the new project can resolve.
 */
export type BlockParams = {
  graphs: GraphSeed[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseSimpleSelector(value: unknown, at: string): SimpleSelector {
  if (!isRecord(value)) {
    throw new Error(`'${at}' must be an object.`);
  }
  const { selectedSource } = value;
  if (typeof selectedSource !== "string") {
    throw new Error(`'${at}.selectedSource' must be a string.`);
  }
  return { selectedSource };
}

const FILTER_TYPES = [
  "equals",
  "range",
  "subset",
] as const satisfies readonly FilterSelector["type"][];
type _FilterTypesExhaustive = AssertNever<
  Exclude<FilterSelector["type"], (typeof FILTER_TYPES)[number]>
>;

function parseFilterSelector(value: unknown, at: string): FilterSelector {
  const { selectedSource } = parseSimpleSelector(value, at);
  const { type, selectedFilterRange, selectedFilterValues } = value as Record<string, unknown>;

  if (!isOneOf(type, FILTER_TYPES)) {
    throw new Error(`'${at}.type' must be one of: ${FILTER_TYPES.join(", ")}.`);
  }

  const parsed: FilterSelector = { selectedSource, type };

  if (selectedFilterRange !== undefined) {
    if (
      !isRecord(selectedFilterRange) ||
      typeof selectedFilterRange.min !== "number" ||
      typeof selectedFilterRange.max !== "number"
    ) {
      throw new Error(
        `'${at}.selectedFilterRange' must be an object with numeric 'min' and 'max'.`,
      );
    }
    parsed.selectedFilterRange = {
      min: selectedFilterRange.min,
      max: selectedFilterRange.max,
    };
  }

  if (selectedFilterValues !== undefined) {
    if (
      !Array.isArray(selectedFilterValues) ||
      selectedFilterValues.some((v) => typeof v !== "string")
    ) {
      throw new Error(`'${at}.selectedFilterValues' must be an array of strings.`);
    }
    parsed.selectedFilterValues = selectedFilterValues as string[];
  }

  return parsed;
}

function parseComponentState(value: unknown, at: string): ComponentState {
  if (!isRecord(value)) {
    throw new Error(`'${at}' must be an object.`);
  }
  const { type, selectorStates } = value;
  if (!Array.isArray(selectorStates)) {
    throw new Error(`'${at}.selectorStates' must be an array.`);
  }

  if (type === "simple") {
    return {
      type,
      selectorStates: selectorStates.map((s, i) =>
        parseSimpleSelector(s, `${at}.selectorStates[${i}]`),
      ),
    };
  }
  if (type === "filter") {
    return {
      type,
      selectorStates: selectorStates.map((s, i) =>
        parseFilterSelector(s, `${at}.selectorStates[${i}]`),
      ),
    };
  }
  throw new Error(`'${at}.type' must be either "simple" or "filter".`);
}

/**
 * The data mapping. Read as an envelope, not as a judgement on the chart: a
 * component with no source chosen yet is an ordinary state the editor can be
 * left in, so a half-bound page exports and re-applies unchanged.
 */
function parseOptionsState(value: unknown, at: string): OptionsState {
  if (!isRecord(value)) {
    throw new Error(`'${at}' must be an object.`);
  }
  const { type, components, dividedAxes } = value;

  if (!isOneOf(type, CHART_TYPES)) {
    throw new Error(`'${at}.type' must be one of: ${CHART_TYPES.join(", ")}.`);
  }
  if (!isRecord(components)) {
    throw new Error(`'${at}.components' must be an object keyed by input name.`);
  }
  if (!isRecord(dividedAxes)) {
    throw new Error(`'${at}.dividedAxes' must be an object keyed by axis id.`);
  }

  const parsedComponents: OptionsState["components"] = {};
  for (const [key, component] of Object.entries(components)) {
    parsedComponents[key] = parseComponentState(component, `${at}.components.${key}`);
  }

  const parsedDividedAxes: Record<string, boolean> = {};
  for (const [key, divided] of Object.entries(dividedAxes)) {
    if (typeof divided !== "boolean") {
      throw new Error(`'${at}.dividedAxes.${key}' must be a boolean.`);
    }
    parsedDividedAxes[key] = divided;
  }

  return { type, components: parsedComponents, dividedAxes: parsedDividedAxes };
}

function parseGraphSeed(value: unknown, index: number): GraphSeed {
  const at = `graphs[${index}]`;
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`'${at}' must be an object describing one graph page.`);
  }
  const { id, label, chartType, template } = value as Record<string, unknown>;

  if (typeof id !== "string" || id === "") {
    throw new Error(`'${at}.id' must be a non-empty string.`);
  }
  if (typeof label !== "string") {
    throw new Error(`'${at}.label' must be a string.`);
  }
  if (!isOneOf(chartType, CHART_TYPES)) {
    throw new Error(`'${at}.chartType' must be one of: ${CHART_TYPES.join(", ")}.`);
  }
  if (!isOneOf(template, LAYERS_TEMPLATES)) {
    throw new Error(`'${at}.template' must be one of: ${LAYERS_TEMPLATES.join(", ")}.`);
  }

  const { optionsState } = value as Record<string, unknown>;
  if (optionsState === undefined) {
    return { id, label, chartType, template };
  }

  return {
    id,
    label,
    chartType,
    template,
    optionsState: parseOptionsState(optionsState, `${at}.optionsState`),
  };
}

function isOneOf<const T extends readonly string[]>(
  value: unknown,
  allowed: T,
): value is T[number] {
  return typeof value === "string" && (allowed as readonly string[]).includes(value);
}

/**
 * The same contract at runtime, for params that arrive from a template file rather than
 * from typed code — the only point that can catch a hand-written entry being wrong.
 *
 * `graphs` is optional so a template may seed the block empty, which is also what a
 * block created by hand gets.
 */
function parseInitializationParams(value: unknown): BlockParams {
  assertParamsObject(value);

  const { graphs } = value;
  if (graphs === undefined) {
    return { graphs: [] };
  }
  if (!Array.isArray(graphs)) {
    throw new Error("'graphs' must be an array of graph pages.");
  }

  return { graphs: graphs.map(parseGraphSeed) };
}

// Identity (`name`/`version`) comes from this package's own `package.json`, so
// the on-wire `{name}@{version}` reference can never drift from what npm
// publishes; the bundler inlines the JSON import.
export const kind = defineBlockKind<BlockParams>({
  name,
  version,
  parseInitializationParams,
});
