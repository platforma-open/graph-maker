import { GraphMakerProps, GraphMakerState } from '@milaboratories/graph-maker';
import {
  BlockModel,
  type InferOutputsType,
  PColumnCollection,
  RenderCtx,
  createPFrameForGraphs
} from '@platforma-sdk/model';

export type GraphPageState = {
  id: string;
  label: string;
  state: GraphMakerState,
  settings: GraphMakerProps
};

export type UiState = {
  graphs: GraphPageState[]
};

export type BlockArgs = {};

export const platforma = BlockModel.create('Heavy')
  .withUiState<UiState>({ graphs: [] })
  .withArgs<BlockArgs>({})

  .sections((ctx: RenderCtx<any, any>) => {
    const graphRoutes = (ctx.uiState?.graphs ?? []).map((gs: GraphPageState) => ({
      type: 'link' as const,
      href: `/graph?id=${gs.id}` as const,
      label: gs.label
    }));
    return [
      ...graphRoutes,
      {
        type: 'link',
        href: '/',
        appearance: 'add-section',
        label: 'New Graph'
      }
    ];
  })

  .output('pFrame', (ctx) => {
    return createPFrameForGraphs(ctx);
  })
  .output('filteredPFrame', (ctx) => {
    const mainColumn = ctx.resultPool.selectColumns(
      (spec) => spec.name === 'pl7.app/vdj/geneHit',
    )?.[0];
    if (!mainColumn) {
      return undefined;
    }
    const anchorCtx = ctx.resultPool.resolveAnchorCtx({ main: {
      ...mainColumn.spec,
      domain: {},
      axesSpec: mainColumn.spec.axesSpec.map((s) => ({...s, domain: {}}))
    }});
    if (!anchorCtx) {
      return undefined;
    }
    const entries = new PColumnCollection()
      .addColumnProvider(ctx.resultPool)
      .addAxisLabelProvider(ctx.resultPool)
      .getUniversalEntries(
        [{
          domainAnchor: 'main',
          axes: [
            { anchor: 'main', idx: 0 },
          ],
        },
        {
          // Include linker columns to connect clonotypes to clusters
          domainAnchor: 'main',
          annotations: {
            'pl7.app/isLinkerColumn': 'true',
          },
        }],
        { anchorCtx, enrichByLinkers: false },
      );
    return ctx.createPFrame(entries ?? []);
  })
  .done(2);

export type BlockOutputs = InferOutputsType<typeof platforma>;
