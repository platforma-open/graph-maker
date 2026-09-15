import { assertParamsObject, defineBlockKind } from "@platforma-sdk/block-kind";
import type { GraphMakerProps, GraphMakerState } from "@milaboratories/graph-maker";
import { name, version } from "../package.json" with { type: "json" };

type ChartType = GraphMakerProps["chartType"];
type LayersTemplate = GraphMakerState["template"];
type LiveOptionsState = NonNullable<GraphMakerState["optionsState"]>;
type LiveComponent = LiveOptionsState["components"][string];
type LiveFilterSelector = Extract<LiveComponent, { type: "filter" }>["selectorStates"][number];

/** Fails to compile if `T` is anything but `never` — see the exhaustiveness checks below. */
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
 * Which column or axis feeds a chart input.
 *
 * Live, graph-maker holds this as one canonical string. A seed carries it taken
 * apart, and that is the whole point: a column's identity contains the `PlRef`
 * naming the block that produced it, and on apply the SDK repoints those refs at
 * the blocks of the project being built. Its relocator descends through objects
 * and rewrites any reference it recognizes, but a reference sealed inside a
 * string two layers down is not something it can reach — so a seed that carried
 * the string verbatim would arrive naming blocks of the project it was exported
 * from. Split open, the ref sits where the relocator sees it.
 *
 * **Carried whole, not field by field.** An identifier IS its canonical form:
 * drop a field this parser does not know about and the id rebuilt on the way in
 * names a different column, or nothing at all. So the fields below are checked
 * and everything else is preserved untouched.
 *
 * Axis sources are a known gap. An axis carries its block id inside `domain`
 * (`pl7.app/vdj/clonotypingRunId`, say), and the relocator leaves domain entries
 * alone by design — that is what stops a value which merely looks like an id from
 * being rewritten. Nothing a block can do reaches this: relocation runs before
 * both this parser and `init`, and neither is handed the block-id map. A page
 * bound to such an axis therefore still needs re-binding in the new project.
 */
export type SourceId = {
  kind: "column" | "axis";
  name: string;
  type: string;
  domain?: Record<string, string>;
  /** Any further field an identifier carries: preserved, never interpreted. */
  [extra: string]: unknown;
};

/** One chart input's binding, as a seed carries it. */
export type SeedSimpleSelector = { selectedSource: SourceId };

/** A filtering input's binding: the source plus the filter set on it. */
export type SeedFilterSelector = SeedSimpleSelector & {
  type: LiveFilterSelector["type"];
  selectedFilterRange?: { min: number; max: number };
  selectedFilterValues?: string[];
};

export type SeedComponent =
  | { type: "simple"; selectorStates: SeedSimpleSelector[] }
  | { type: "filter"; selectorStates: SeedFilterSelector[] };

/** The data mapping, with every source taken apart. Mirrors graph-maker's `optionsState`. */
export type SeedOptionsState = {
  type: ChartType;
  components: Record<string, SeedComponent>;
  dividedAxes: Record<string, boolean>;
};

/**
 * One graph page, reduced to what re-creating it actually takes.
 *
 * `template` and `chartType` choose the chart; `optionsState` is the data
 * mapping. `chartType` is kept alongside `template` because it is not derivable
 * from it: the UMAP scatterplot shares template `dots` with the ordinary one.
 *
 * What stays behind is per-view bookkeeping — zoom, the open tab, lasso
 * polygons, whether the tooltip hint was shown — and the cosmetic layers. A
 * seeded page therefore opens on the right chart, bound to what the new project
 * can resolve, at the chart type's default styling.
 */
export type GraphSeed = {
  id: string;
  label: string;
  chartType: ChartType;
  template: LayersTemplate;
  /** Absent for a page whose data mapping the reader never touched. */
  optionsState?: SeedOptionsState;
  /**
   * The reader's chart settings, carried whole.
   *
   * Whole rather than as a difference from the chart type's defaults, which would be the smaller
   * thing to carry: the defaults are produced by graph-maker's own `getInitialAxesSettings` and
   * friends, and that module cannot be reached from a block model — it imports the editor's icon
   * components, so bundling it into the model fails. The cost of carrying them whole is that a
   * seeded page keeps the defaults of the day it was exported, and a later change to them does
   * not reach it.
   */
  axesSettings?: GraphMakerState["axesSettings"];
  layersSettings?: GraphMakerState["layersSettings"];
  statisticsSettings?: GraphMakerState["statisticsSettings"];
  /** Palettes and colour mapping, keyed by the column or axis they were chosen for. */
  dataBindAes?: GraphMakerState["dataBindAes"];
};

/**
 * This block's init-params contract — the graph pages a project template seeds a
 * new graph-maker with.
 */
export type BlockParams = {
  graphs: GraphSeed[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isOneOf<const T extends readonly string[]>(
  value: unknown,
  allowed: T,
): value is T[number] {
  return typeof value === "string" && (allowed as readonly string[]).includes(value);
}

function parseSourceId(value: unknown, at: string): SourceId {
  if (!isRecord(value)) {
    throw new Error(`'${at}' must be an object describing a column or axis.`);
  }
  const { kind, name, type, domain, ...rest } = value;

  if (kind !== "column" && kind !== "axis") {
    throw new Error(`'${at}.kind' must be either "column" or "axis".`);
  }
  if (typeof name !== "string") {
    throw new Error(`'${at}.name' must be a string.`);
  }
  if (typeof type !== "string") {
    throw new Error(`'${at}.type' must be a string.`);
  }
  if (domain !== undefined) {
    if (!isRecord(domain) || Object.values(domain).some((v) => typeof v !== "string")) {
      throw new Error(`'${at}.domain' must be an object of strings.`);
    }
  }

  // `rest` is spread back in: see SourceId — an id is carried whole.
  return {
    ...rest,
    kind,
    name,
    type,
    ...(domain === undefined ? {} : { domain: domain as Record<string, string> }),
  };
}

function parseSimpleSelector(value: unknown, at: string): SeedSimpleSelector {
  if (!isRecord(value)) {
    throw new Error(`'${at}' must be an object.`);
  }
  return { selectedSource: parseSourceId(value.selectedSource, `${at}.selectedSource`) };
}

const FILTER_TYPES = [
  "equals",
  "range",
  "subset",
] as const satisfies readonly LiveFilterSelector["type"][];
type _FilterTypesExhaustive = AssertNever<
  Exclude<LiveFilterSelector["type"], (typeof FILTER_TYPES)[number]>
>;

function parseFilterSelector(value: unknown, at: string): SeedFilterSelector {
  const { selectedSource } = parseSimpleSelector(value, at);
  const { type, selectedFilterRange, selectedFilterValues } = value as Record<string, unknown>;

  if (!isOneOf(type, FILTER_TYPES)) {
    throw new Error(`'${at}.type' must be one of: ${FILTER_TYPES.join(", ")}.`);
  }

  const parsed: SeedFilterSelector = { selectedSource, type };

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

function parseComponent(value: unknown, at: string): SeedComponent {
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
function parseOptionsState(value: unknown, at: string): SeedOptionsState {
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

  const parsedComponents: Record<string, SeedComponent> = {};
  for (const [key, component] of Object.entries(components)) {
    parsedComponents[key] = parseComponent(component, `${at}.components.${key}`);
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

/**
 * One settings group, read as an envelope and carried whole.
 *
 * This kind reads none of the fields inside: they are graph-maker's own settings, what one means
 * is settled where it is applied, and a parser that knew their shape would have to be taught
 * again every time the editor gains a knob.
 */
function parseSettingsGroup(value: unknown, at: string): Record<string, unknown> {
  if (!isRecord(value)) {
    throw new Error(`'${at}' must be an object of settings.`);
  }
  return value;
}

/** The settings groups a seed may carry, each optional and each read as an envelope. */
const SETTINGS_KEYS = [
  "axesSettings",
  "layersSettings",
  "statisticsSettings",
  "dataBindAes",
] as const;

function parseSettings(value: Record<string, unknown>, at: string) {
  const parsed: Record<string, Record<string, unknown>> = {};
  for (const key of SETTINGS_KEYS) {
    if (value[key] !== undefined) parsed[key] = parseSettingsGroup(value[key], `${at}.${key}`);
  }
  return parsed as Pick<GraphSeed, (typeof SETTINGS_KEYS)[number]>;
}

function parseGraphSeed(value: unknown, index: number): GraphSeed {
  const at = `graphs[${index}]`;
  if (!isRecord(value)) {
    throw new Error(`'${at}' must be an object describing one graph page.`);
  }
  const { id, label, chartType, template, optionsState } = value;

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
  const settings = parseSettings(value, at);

  if (optionsState === undefined) {
    return { id, label, chartType, template, ...settings };
  }

  return {
    id,
    label,
    chartType,
    template,
    optionsState: parseOptionsState(optionsState, `${at}.optionsState`),
    ...settings,
  };
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
