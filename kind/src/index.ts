import { assertParamsObject, defineBlockKind } from "@platforma-sdk/block-kind";
import type { GraphMakerProps, GraphMakerState } from "@milaboratories/graph-maker";
import { name, version } from "../package.json" with { type: "json" };

type ChartType = GraphMakerProps["chartType"];
type LayersTemplate = GraphMakerState["template"];

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
 * One graph page, reduced to what creating it actually takes.
 *
 * A live page carries a whole `GraphMakerState`, but almost none of that is
 * authorable: `optionsState` keys columns of the project it was built in,
 * and `usedDefaultOptions` is the flag that suppresses re-application of
 * defaults — carried into a new project, the page would bind to columns that
 * do not exist and never receive the defaults that would fix it. What remains
 * is exactly what `MainPage.addSection` writes for a brand-new page, which is
 * why `init` can rebuild a seed into a page that is indistinguishable from one
 * the user just created.
 *
 * `chartType` is not derivable from `template`: the UMAP scatterplot shares
 * template `dots` with the ordinary one and differs only in chart type.
 */
export type GraphSeed = {
  id: string;
  label: string;
  chartType: ChartType;
  template: LayersTemplate;
};

/**
 * This block's init-params contract — the graph pages a project template seeds a
 * new graph-maker with. Each page arrives at its chart type's default state,
 * titled, and unbound; the reader binds it to the new project's data.
 */
export type BlockParams = {
  graphs: GraphSeed[];
};

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

  return { id, label, chartType, template };
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
