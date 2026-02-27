import { GraphMakerProps, GraphMakerState } from '@milaboratories/graph-maker';
import {
  BlockModel,
  type InferOutputsType,
  PColumn,
  PColumnDataUniversal,
  PColumnSpec,
  PObjectId,
  PTableHandle,
  SpecQuery,
  getAllRelatedColumns,
  isHiddenFromGraphColumn,
  isHiddenFromUIColumn,
} from '@platforma-sdk/model';

/** Recursively replace column ids in an id-only SpecQuery with live columns from the model. */
function mapSpecQueryIdsToColumns(
  query: SpecQuery<PObjectId>,
  getColumn: (id: PObjectId) => PColumn<PColumnDataUniversal>,
): SpecQuery<PColumn<PColumnDataUniversal>> {
  const traverseEntry = (
    entry: { entry: SpecQuery<PObjectId>; qualifications: unknown[] },
  ): { entry: SpecQuery<PColumn<PColumnDataUniversal>>; qualifications: unknown[] } => ({
    ...entry,
    entry: mapSpecQueryIdsToColumns(entry.entry, getColumn),
  });
  switch (query.type) {
    case 'column':
      return { type: 'column', column: getColumn(query.column) } as SpecQuery<PColumn<PColumnDataUniversal>>;
    case 'sparseToDenseColumn':
      return { ...query, column: getColumn(query.column) } as SpecQuery<PColumn<PColumnDataUniversal>>;
    case 'inlineColumn':
      return query as unknown as SpecQuery<PColumn<PColumnDataUniversal>>;
    case 'innerJoin':
    case 'fullJoin':
      return { ...query, entries: query.entries.map(traverseEntry) } as SpecQuery<PColumn<PColumnDataUniversal>>;
    case 'outerJoin':
      return {
        ...query,
        primary: traverseEntry(query.primary),
        secondary: query.secondary.map(traverseEntry),
      } as SpecQuery<PColumn<PColumnDataUniversal>>;
    case 'filter':
    case 'sort':
    case 'sliceAxes':
      return { ...query, input: mapSpecQueryIdsToColumns(query.input, getColumn) } as SpecQuery<PColumn<PColumnDataUniversal>>;
    default:
      return query as unknown as SpecQuery<PColumn<PColumnDataUniversal>>;
  }
}

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

  .sections((ctx) => {
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

  .outputWithStatus('pFrame', (ctx) => {
    const suitableSpec = (spec: PColumnSpec) =>
      !isHiddenFromUIColumn(spec) && !isHiddenFromGraphColumn(spec);
    const columns = getAllRelatedColumns(ctx, suitableSpec).filter(
      it => !((['Bytes', 'File']).includes(it.spec.valueType)));
    return {value: ctx.createPFrame(columns), columns};
  })
  .output('table', (ctx) => {
    const liveColumns = ctx.resultPool.selectColumns(() => true);
    const liveById = new Map(
      liveColumns.map((c) => [c.id, c as PColumn<PColumnDataUniversal>]),
    );
    const tables: (PTableHandle | null)[] = ctx.uiState?.graphs.map((gs: GraphPageState) => {
      const query = gs.state.chartSpecQuery;
      if (!query) {
        return null;
      }
      try {
        const restoredQuery = mapSpecQueryIdsToColumns(query as SpecQuery<PObjectId>, (id: PObjectId) => {
          const col = liveById.get(id);
          if (!col) throw new Error(`Column ${String(id)} not found in result pool`);
          return col;
        });
        return ctx.createPTableV2({ query: restoredQuery }) ?? null;
      } catch {
        return null;
      }
    });
    return tables;
  })
  .done(2);

export type BlockOutputs = InferOutputsType<typeof platforma>;
