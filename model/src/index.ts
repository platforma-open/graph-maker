import {
  BlockModel, createPFrameForGraphs,
  type InferOutputsType,
  isPColumn, RenderCtx, ValueType
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
    const VALUE_TYPES: ValueType[] = [
      'Int',
      'Long',
      'Float',
      'Double',
      'String',
      'Bytes'
    ];
    const upstreamColumns = ctx.resultPool
      .getData()
      .entries.map((v) => v.obj)
      .filter(isPColumn)
      .filter((column) => VALUE_TYPES.includes(column.spec.valueType));
    return createPFrameForGraphs(ctx, upstreamColumns);
  })
  .done();

export type BlockOutputs = InferOutputsType<typeof platforma>;
