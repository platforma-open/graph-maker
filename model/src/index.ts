import {
  BlockModel,
  type InferOutputsType,
  PColumn, TreeNodeAccessor, isPColumn
} from '@milaboratory/sdk-ui';

export type GraphState = { id: string; label: string; settings: unknown };

export type UiState = {
  graphs: GraphState[]
};

export type BlockArgs = {};

export const model = BlockModel.create<BlockArgs, UiState>("Heavy")
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

  .output('pFrame', (render) => {
    const collection = render.resultPool.getDataFromResultPool();
    if (collection === undefined || !collection.isComplete) return undefined;

    const pColumns = collection.entries.map(({ obj }) => obj).filter(isPColumn);
    return render.createPFrame(pColumns as PColumn<TreeNodeAccessor>[]);
  })

  .done();

export type BlockOutputs = InferOutputsType<typeof model>;
