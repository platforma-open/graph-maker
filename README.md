# Graph Maker

Plot anything in your project. This Platforma block reads the outputs of every other block in a project — abundances, scores, cluster assignments, sample metadata — and turns them into publication-ready figures across 28 chart types, with built-in significance testing and as many independent graphs per block as you need.

Open-source analysis block for Platforma, the biologics discovery platform by MiLaboratories. For the full no-code workflow, see [platforma.bio](https://platforma.bio/).

## What it does

Most blocks come with the specific visualizations their analysis calls for. Graph Maker is the general case: the block you add when the figure you want is not the one any single analysis block produces — a comparison across sample groups, a metric plotted against another metric, a metadata variable crossed with a computed score.

It has access to the whole project. Any column any upstream block produced is available as an axis, a grouping, a color, or a size — as is the sample metadata from Samples & Data. Because it composes across blocks rather than reading one dataset, you can plot an enrichment score against a liability count, or group a diversity metric by treatment arm, without exporting anything.

**Chart types** cover distributions (box, violin, sina, histogram, binned and jittered dots, and box/violin combinations with raw points overlaid), comparisons (bar charts with lines or error bars, stacked bars, stacked bar with stream area), trends (line charts with jittered dots, binned dots, or error bars; curves), relationships (scatter plots, scatter with fitted curve, bubble plots), and matrices (heatmaps, heatmaps with dendrogram, standalone dendrograms), plus sequence logo and selection plots.

**Statistical testing** is built in for group comparisons: t-test, ANOVA, Wilcoxon, and Kruskal-Wallis, run either pairwise or against a reference group, with Bonferroni correction for multiple comparisons. Significance annotations render onto the plot, so a figure carries its own statistics rather than needing them computed elsewhere and added by hand.

Each Graph Maker block holds **multiple graphs**, each named and configured independently and appearing as its own section. One block can therefore hold a whole figure panel for a report, with every chart staying live against the data.

## Inputs & outputs

* **Input:** any columns produced by any block in the project, plus sample metadata. Nothing needs to be selected as a dataset — the whole project is available.
* **Output:** interactive, configurable figures. Each graph is saved as part of the project, so it stays current as upstream analysis is re-run.

## Specifications

| | |
|---|---|
| Block title in app | Graph Maker |
| Data source | Every column in the project, from any block, plus sample metadata |
| Chart types | 28, spanning distributions, comparisons, trends, relationships, matrices, sequence logos, and selection plots |
| Distribution charts | Box plot, violin plot, sina plot, histogram, binned dots, jittered dots, and box/violin variants with raw points |
| Comparison charts | Bar chart, bar + line, bar + error bars, stacked bar, stacked bar + stream area |
| Trend charts | Line chart, line + jittered dots, line + binned dots, line + error bars, curve |
| Relationship charts | Scatter plot, scatter + curve, bubble plot |
| Matrix charts | Heatmap, heatmap + dendrogram, dendrogram |
| Statistical tests | t-test, ANOVA, Wilcoxon, Kruskal-Wallis — pairwise or against a reference group, with Bonferroni correction |

## Use cases

* **Cross-block comparisons:** plot a score from one block against a score from another — enrichment versus liability count, diversity versus treatment arm.
* **Group comparisons with statistics:** compare a metric across sample groups with significance annotations rendered on the figure.
* **Publication figures:** build the exact chart a paper or report needs, rather than screenshotting a block's built-in view.
* **Metadata-driven views:** group or color any measurement by condition, timepoint, donor, or treatment from your sample metadata.
* **Figure panels:** hold a report's whole set of charts in one block, each as its own section.
* **Live figures:** re-run upstream analysis and watch the charts update, instead of rebuilding them by hand.
* **Exploratory plotting:** try a chart type against your data before deciding what the analysis actually shows.

## FAQ

### When should I use Graph Maker instead of a block's own plots?

When the figure you want crosses blocks, or is not one the analysis block offers. Analysis blocks ship the visualizations their method calls for; Graph Maker is for everything else — especially comparisons that combine columns from several blocks with sample metadata.

### Which data can it plot?

Anything in the project. It composes across all blocks rather than reading a single selected dataset, so any column any block produced is available, along with your sample metadata.

### Which statistical tests are available?

t-test, ANOVA, Wilcoxon, and Kruskal-Wallis. Comparisons can run pairwise across groups or against a designated reference group, and Bonferroni correction is available for multiple comparisons. Which tests are offered depends on the chart and how many groups you are comparing.

### Can one block hold more than one chart?

Yes, as many as you need. Each graph is named, configured independently, and gets its own section — so a single Graph Maker block can hold a complete figure panel.

### Do my charts update when I re-run an analysis?

Yes. Graphs are configured against project columns rather than exported snapshots, so re-running upstream analysis updates them.

### Which chart type should I use?

For distributions across groups, a box or violin plot — add binned or jittered dots when the raw points matter. For comparisons of magnitude, bar charts. For relationships between two continuous measures, scatter plots, with a fitted curve if a trend is the point. For a matrix of values across two categorical axes, a heatmap, with a dendrogram when clustering structure matters.

## Part of the Platforma ecosystem

This block is part of [Platforma](https://platforma.bio/) by [MiLaboratories](https://github.com/milaboratory). Explore the other open-source blocks at [github.com/platforma-open](https://github.com/platforma-open) and the documentation at [docs.platforma.bio](https://docs.platforma.bio/).
