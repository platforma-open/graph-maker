// @ts-ignore
import box from './assets/icons/Type=Box Plot.svg';
//@ts-ignore
import boxBin from './assets/icons/Type=Box + Bin.svg';
// @ts-ignore
import box_jitteredDots from './assets/icons/Type=Box + Jitter.svg';
// @ts-ignore
import violin from './assets/icons/Type=Violin.svg';
// @ts-ignore
import violin_binnedDots from './assets/icons/Type=Violin + Bin.svg';
// @ts-ignore
import binnedDots from './assets/icons/Type=Binned Dots.svg';
// @ts-ignore
import jitteredDots from './assets/icons/Type=Jittered Dots.svg';
// @ts-ignore
import bar from './assets/icons/Type=Bar Chart.svg';
// @ts-ignore
import barLine from './assets/icons/Type=Bar Chart + Line.svg';
// @ts-ignore
import barError from './assets/icons/Type=Bar Chart + Error.svg';
// @ts-ignore
import stackedBar from './assets/icons/Type=Stacked Bar Chart.svg';
// @ts-ignore
import line from './assets/icons/Type=Line.svg';
// @ts-ignore
import curve from './assets/icons/Type=Curve.svg';
// @ts-ignore
import line_jitteredDots from './assets/icons/Type=Line + Jitt.svg';
// @ts-ignore
import line_binnedDots from './assets/icons/Type=Line + Bin.svg';
// @ts-ignore
import line_errorbar from './assets/icons/Type=Line + Err.svg';
// @ts-ignore
import sina from './assets/icons/Type=Sina Plot.svg';
// @ts-ignore
import dots from './assets/icons/Type=Skatter.svg';
// @ts-ignore
import curve_dots from './assets/icons/Type=Skatter + Curve.svg';
// @ts-ignore
import heatmap from './assets/icons/Type=Heatmap.svg';
// @ts-ignore
import heatmapClustered from './assets/icons/Type=Heatmap + Dendrogram.svg';
// @ts-ignore
import dendrogram from './assets/icons/Type=Dendrogram.svg';
// @ts-ignore
import histogram from './assets/icons/Type=Histogram.svg';
import { GraphMakerProps } from '@milaboratories/graph-maker';

export type GraphCardItem = { id: string, title: string, description: string, image: string, };
export const CHART_TYPES: GraphCardItem[] = [
  { image: box, title: 'Box Plot', id: 'box', description: 'Summarizes data distribution, variability, and outliers' },
  { image: boxBin, title: 'Box Plot + Binned Dots', id: 'box_binnedDots', description: 'Displays statistical summaries with grouped raw data for density insights' },
  { image: box_jitteredDots, title: 'Box Plot + Jittered Dots', id: 'box_jitteredDots', description: 'Highlights raw data alongside statistical summaries' },
  { image: violin, title: 'Violin Plot', id: 'violin', description: 'Shows data distribution and density across categories' },
  { image: violin_binnedDots, title: 'Violin Plot + Binned Dots', id: 'violin_binnedDots', description: 'Combines density visualization with grouped raw data for detailed insights' },
  { image: binnedDots, title: 'Binned Dots', id: 'binnedDots', description: 'Groups individual data points into bins to reveal distribution patterns' },
  { image: jitteredDots, title: 'Jittered Dots', id: 'jitteredDots', description: 'Adds random variation to data points for better visibility of overlapping values' },
  { image: bar, title: 'Bar Chart', id: 'bar', description: 'Compares values across categories with discrete bars' },
  { image: barLine, title: 'Bar Chart + Line', id: 'bar_line', description: 'Combines bars and a line to compare values and show trends simultaneously', },
  { image: barError, title: 'Bar Chart + Error Bars', id: 'bar_errorbar', description: 'Shows data comparisons with added variability or uncertainty indicators' },
  { image: stackedBar, title: 'Stacked Bar Chart', id: 'stackedBar', description: 'Compares parts of a whole across categories, layering segments within each bar' },
  { image: line, title: 'Line Chart', id: 'line', description: 'Shows trends or changes in data over a continuous range' },
  { image: line_jitteredDots, title: 'Line + Jittered Dots', id: 'line_jitteredDots', description: 'Displays individual data points with added variation alongside the trend line' },
  { image: line_binnedDots, title: 'Line + Binned Dots', id: 'line_binnedDots', description: 'Combines a line with grouped data points to highlight density along the trend' },
  { image: line_errorbar, title: 'Line + Error Bars', id: 'line_errorbar', description: 'Visualizes trends with indicators of variability or uncertainty' },
  { image: sina, title: 'Sina Plot', id: 'sina', description: 'Shows individual data points with density to highlight distributions' },
  { image: dots, title: 'Scatter Plot', id: 'dots', description: 'Displays individual data points to reveal relationships or patterns' },
  { image: curve, title: 'Curve', id: 'curve', description: 'Visualizes relationships or trends with a smooth line' },
  { image: curve_dots, title: 'Scatter Plot + Curve', id: 'curve_dots', description: 'Combines raw data points with a smooth line to show trends or fits' },
  { image: heatmap, title: 'Heatmap', id: 'heatmap', description: 'Represents data intensity or values using color gradients' },
  { image: heatmapClustered, title: 'Heatmap + Dendro', id: 'heatmapClustered', description: 'Combines data intensity visualization with hierarchical clustering information' },
  { image: dendrogram, title: 'Dendrogram', id: 'dendrogram', description: 'Visualizes hierarchical clustering or relationships between data groups' },
  { image: histogram, title: 'Histogram', id: 'bins', description: 'Shows data distribution by grouping values into bins' },
];

export function getChartTypeByTemplate(template: string): GraphMakerProps['chartType'] {
  if (template === 'bins') {
    return 'histogram';
  }
  if (template === 'heatmap' || template === 'heatmapClustered') {
    return 'heatmap';
  }
  if (template === 'dendrogram') {
    return 'dendro';
  }
  if (template === 'dots' || template === 'curve' || template === 'curve_dots') {
    return 'scatterplot';
  }
  return 'discrete'
}
