// @ts-ignore
import box from './assets/box.svg';
// @ts-ignore
import box_jitteredDots from './assets/box_jitteredDots.svg';
// @ts-ignore
import violin from './assets/violin.svg';
// @ts-ignore
import violin_binnedDots from './assets/violin_binnedDots.svg';
// @ts-ignore
import binnedDots from './assets/binnedDots.svg';
// @ts-ignore
import jitteredDots from './assets/jitteredDots.svg';
// @ts-ignore
import bar from './assets/bar.svg';
// @ts-ignore
import stackedBar from './assets/stackedBar.svg';
// @ts-ignore
import line from './assets/line.svg';
// @ts-ignore
import line_jitteredDots from './assets/line_jitteredDots.svg';
// @ts-ignore
import line_binnedDots from './assets/line_binnedDots.svg';
// @ts-ignore
import line_errorbar from './assets/line_errorbar.svg';
// @ts-ignore
import sina from './assets/sina.svg';
// @ts-ignore
import dots from './assets/dots.svg';
// @ts-ignore
import curve_dots from './assets/curve_dots.svg';
// @ts-ignore
import heatmap from './assets/heatmap.svg';
// @ts-ignore
import dendrogram from './assets/dendrogram.svg';
import { GraphMakerSettings } from '@milaboratory/graph-maker/dist/GraphMaker/types';

export const CHART_TYPES = [{
  group: 'Discrete',
  items: [
    { image: box, title: 'Boxplot', id: 'box' },
    { image: box, title: 'Boxplot + Binned dots', id: 'box_binnedDots' },
    { image: box_jitteredDots, title: 'Boxplot + Jittered dots', id: 'box_jitteredDots' },
    { image: violin, title: 'Violin', id: 'violin' },
    { image: violin_binnedDots, title: 'Violin + Binned dots', id: 'violin_binnedDots' },
    { image: binnedDots, title: 'Binned dots', id: 'binnedDots' },
    { image: jitteredDots, title: 'Jittered dots', id: 'jitteredDots' },
    { image: bar, title: 'Bar', id: 'bar' },
    { image: bar, title: 'Bar + Line', id: 'bar_line' },
    { image: bar, title: 'Bar + Error Bar', id: 'bar_errorbar' },
    { image: stackedBar, title: 'Stacked Bar', id: 'stackedBar' },
    { image: line, title: 'Line', id: 'line' },
    { image: line_jitteredDots, title: 'Line + Jittered dots', id: 'line_jitteredDots' },
    { image: line_binnedDots, title: 'Line + Binned dots', id: 'line_binnedDots' },
    { image: line_errorbar, title: 'Line + Error Bar', id: 'line_errorbar' },
    { image: sina, title: 'Sina', id: 'sina' },
  ]
}, {
  group: 'Scatter Plot',
  items: [
    { image: dots, title: 'Scatter Plot', id: 'dots' },
    { image: line, title: 'Curve', id: 'curve' },
    { image: curve_dots, title: 'Scatter Plot + Curve', id: 'curve_dots' },
  ]
}, {
  group: 'Heatmap',
  items: [{ image: heatmap, title: 'Heatmap', id: 'heatmap' }]
}, {
  group: 'Dendrogram',
  items: [{ image: dendrogram, title: 'Dendrogram', id: 'dendrogram' }]
}] as {
  group: string,
  items: {
    image: string,
    title: string,
    id: string
  }[]
}[];

export function getChartTypeByTemplate(template: string): GraphMakerSettings['chartType'] {
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
