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
        label: '+ New Graph'
      }
    ];
  })

  .output('pFrame', (ctx) => {
    const collection = ctx.resultPool.getData();
    if (collection === undefined || !collection.isComplete) return undefined;

    const valueTypes = ['Int', 'Long', 'Float', 'Double', 'String', 'Bytes'] as ValueType[];
    const columns = collection.entries
      .map(({ obj }) => obj)
      .filter(isPColumn)
      .filter((column) => valueTypes.find((valueType) => valueType === column.spec.valueType));
    return createPFrameForGraphs(ctx, columns);
  })
  .done();

export type BlockOutputs = InferOutputsType<typeof platforma>;
