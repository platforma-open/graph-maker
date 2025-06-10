import {
  AxisId,
  BlockModel, CanonicalizedJson, canonicalizeJson,
  enrichCompatible,
  getAxisId,
  type InferOutputsType,
  isPColumn, PColumn, PColumnDataUniversal, PFrameHandle, RenderCtx, TreeNodeAccessor, ValueType
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

export function createPFrameForGraphs<A, U>(
  ctx: RenderCtx<A, U>,
  allColumns: PColumn<PColumnDataUniversal>[] | undefined,
): PFrameHandle | undefined {
  if (!allColumns) return undefined;

  // all possible axes from block columns
  const allAxes = new Map<CanonicalizedJson<AxisId>, AxisId>();
  for (const c of allColumns) {
    for (const id of c.spec.axesSpec) {
      const aid = getAxisId(id);
      allAxes.set(canonicalizeJson(aid), aid);
    }
  }

  // additional columns are duplicates with extra fields in domains for compatibility if there are ones with partial match
  const extendedColumns = enrichCompatible(allAxes, allColumns);

  // if at least one column is not yet ready, we can't show the table
  if (
    extendedColumns.some(
      (a) => a.data instanceof TreeNodeAccessor && !a.data.getIsReadyOrError(),
    )
  )
    return undefined;

  return ctx.createPFrame(extendedColumns);
}


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
