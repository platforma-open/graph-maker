import {
  BlockModel,
  type InferOutputsType,
  PColumn, TreeNodeAccessor
} from '@milaboratory/sdk-ui';

export type GraphState = { id: string; label: string; settings: unknown };

export type UiState = {
  graphs: GraphState[]
};

export type BlockArgs = {};

export const model = BlockModel.create<BlockArgs, UiState>('Heavy')
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

  .output('pFrame', (wf) => {
    const pColumns:PColumn<TreeNodeAccessor>[] = [];
    wf.resultPool.getDataFromResultPool().entries.forEach(({ obj }) => {
      pColumns.push(...obj.data?.getPColumns() ?? []);
    });
    return wf.createPFrame(pColumns);
  })

  .done();

export type BlockOutputs = InferOutputsType<typeof model>;
