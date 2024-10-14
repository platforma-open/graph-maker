import {
  BlockModel,
  type InferOutputsType,
  isPColumn, ValueType
} from '@platforma-sdk/model';

export type GraphState = { id: string; label: string; settings: unknown };

export type UiState = {
  graphs: GraphState[]
};

export type BlockArgs = {};

export const platforma = BlockModel.create<BlockArgs, UiState>('Heavy')
  .initialArgs({})

  .sections((ctx) => {
    const graphRoutes = (ctx.uiState?.graphs ?? []).map((gs) => ({
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
    return ctx.createPFrame(columns);
  })
  .done();

export type BlockOutputs = InferOutputsType<typeof platforma>;
