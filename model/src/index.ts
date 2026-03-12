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
      return { type: 'column', column: getColumn(query.column) };
    case 'sparseToDenseColumn':
      return { ...query, column: getColumn(query.column) };
    case 'inlineColumn':
      return query;
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
      return { ...query, input: mapSpecQueryIdsToColumns(query.input, getColumn) };
    default:
      return query;
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

const suitableSpec = (spec: PColumnSpec) => !isHiddenFromUIColumn(spec) && !isHiddenFromGraphColumn(spec);

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
    const columns = getAllRelatedColumns(ctx, suitableSpec).filter(
      it => !((['Bytes', 'File']).includes(it.spec.valueType)));
    return {value: ctx.createPFrame(columns), columns};
  })
  .output('table', (ctx) => {
    const columns = getAllRelatedColumns(ctx, suitableSpec).filter(
      it => !((['Bytes', 'File']).includes(it.spec.valueType)));;
    const columnsById = new Map(
      columns.map((c) => [c.id, c as PColumn<PColumnDataUniversal>]),
    );
    const tables: ({table: PTableHandle | null, id: string} | null)[] = ctx.uiState?.graphs.map((gs: GraphPageState) => {
      const savedRequestData =  gs.state.chartSpecQueryResult;
      const query = savedRequestData?.specQuery;
      if (!query) {
        return null;
      }
      try {
        const restoredQuery = mapSpecQueryIdsToColumns(query as SpecQuery<PObjectId>, (id: PObjectId) => {
          const col = columnsById.get(id);
          if (!col) throw new Error(`Column ${String(id)} not found in result pool`);
          return col;
        });
        return {table: ctx.createPTableV2({ query: restoredQuery }) ?? null, id: savedRequestData.id};
      } catch {
        return null;
      }
    });
    return tables;
  })
  .done(2);

export type BlockOutputs = InferOutputsType<typeof platforma>;
