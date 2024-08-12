import box from './assets/box.svg';
import box_jitteredDots from './assets/box_jitteredDots.svg';
import violin from './assets/violin.svg';
import violin_binnedDots from './assets/violin_binnedDots.svg';
import binnedDots from './assets/binnedDots.svg';
import jitteredDots from './assets/jitteredDots.svg';
import bar from './assets/bar.svg';
import stackedBar from './assets/stackedBar.svg';
import line from './assets/line.svg';
import line_jitteredDots from './assets/line_jitteredDots.svg';
import line_binnedDots from './assets/line_binnedDots.svg';
import line_errorbar from './assets/line_errorbar.svg';
import sina from './assets/sina.svg';
import dots from './assets/dots.svg';
import curve_dots from './assets/curve_dots.svg';
import heatmap from './assets/heatmap.svg';
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
}];

export function getChartTypeByTemplate(template: string): GraphMakerSettings['chartType'] {
  if (template === 'heatmap' || template === 'dendrogram') {
    return template as GraphMakerSettings['chartType'];
  }
  if (template === 'dots' || template === 'curve' || template === 'curve_dots') {
    return 'scatterplot';
  }
  return 'discrete'
}
