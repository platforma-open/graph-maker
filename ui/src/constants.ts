// @ts-ignore
import box from './assets/new-assets/Type=Box Plot.svg';
//@ts-ignore
import boxBin from './assets/new-assets/Type=Box + Bin.svg';
// @ts-ignore
import box_jitteredDots from './assets/new-assets/Type=Box + Jitter.svg';
// @ts-ignore
import violin from './assets/new-assets/Type=Violin.svg';
// @ts-ignore
import violin_binnedDots from './assets/new-assets/Type=Violin + Bin.svg';
// @ts-ignore
import binnedDots from './assets/new-assets/Type=Binned Dots.svg';
// @ts-ignore
import jitteredDots from './assets/new-assets/Type=Jittered Dots.svg';
// @ts-ignore
import bar from './assets/new-assets/Type=Bar Chart.svg';
// @ts-ignore
import barLine from './assets/new-assets/Type=Bar Chart + Line.svg';
// @ts-ignore
import barError from './assets/new-assets/Type=Bar Chart + Error.svg';
// @ts-ignore
import stackedBar from './assets/new-assets/Type=Stacked Bar Chart.svg';
// @ts-ignore
import line from './assets/new-assets/Type=Line.svg';
// @ts-ignore
import curve from './assets/new-assets/Type=Curve.svg';
// @ts-ignore
import line_jitteredDots from './assets/new-assets/Type=Line + Jitt.svg';
// @ts-ignore
import line_binnedDots from './assets/new-assets/Type=Line + Bin.svg';
// @ts-ignore
import line_errorbar from './assets/new-assets/Type=Line + Err.svg';
// @ts-ignore
import sina from './assets/new-assets/Type=Sina Plot.svg';

// @ts-ignore //FIXME './assets/dots.svg'; => ui/src/assets/new-assets/Type=Skatter.svg
import dots from './assets/new-assets/Type=Skatter.svg';
// @ts-ignore
import curve_dots from './assets/new-assets/Type=Skatter + Curve.svg';
// @ts-ignore
import heatmap from './assets/new-assets/Type=Heatmap.svg';
// @ts-ignore
import dendrogram from './assets/new-assets/Type=Dendrogram.svg';
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
  { image: dots, title: 'Skatter Plot', id: 'dots', description: 'Displays individual data points to reveal relationships or patterns' },
  { image: curve, title: 'Curve', id: 'curve', description: 'Visualizes relationships or trends with a smooth line' },
  { image: curve_dots, title: 'Skatter Plot + Curve', id: 'curve_dots', description: 'Combines raw data points with a smooth line to show trends or fits' },
  { image: heatmap, title: 'Heatmap', id: 'heatmap', description: 'Represents data intensity or values using color gradients' },
  { image: dendrogram, title: 'Dendrogram', id: 'dendrogram', description: 'Visualizes hierarchical clustering or relationships between data groups' },
];

export function getChartTypeByTemplate(template: string): GraphMakerProps['chartType'] {
  if (template === 'heatmap') {
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
