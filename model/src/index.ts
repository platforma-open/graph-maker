import {
  BlockModel,
  type InferOutputsType,
  RenderCtx,
  createPFrameForGraphs
} from '@platforma-sdk/model';
import {GraphMakerProps, GraphMakerState} from '@milaboratories/graph-maker';

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
  .withUiState<UiState>({graphs: []})
  .withArgs<BlockArgs>({})

  .sections((ctx:RenderCtx<any, any>) => {
    const graphRoutes = (ctx.uiState?.graphs ?? []).map((gs:GraphPageState) => ({
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
  .done();

export type BlockOutputs = InferOutputsType<typeof platforma>;
