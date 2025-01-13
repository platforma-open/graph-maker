import {
  BlockModel,
  type InferOutputsType,
  isPColumn, PColumn, PColumnValues, PObjectId, RenderCtx, ValueType,
} from '@platforma-sdk/model';
import { GraphMakerProps, GraphMakerState } from '@milaboratories/graph-maker';

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
    const columnsVolcanoTest = [
      {
        id: 'logFoldChange' as PObjectId,
        spec: {
          kind: 'PColumn',
          valueType: 'Double',
          name: 'LogFoldChange',
          annotations: {
            'pl7.app/label': 'Log fold change',
            'pl7.app/graph/axis/symmetricRange': '0'
          },
          axesSpec: [{ type: 'Int', name: 'key', annotations: { 'pl7.app/label': 'Key dot axis' } }]
        },
        data: [
          { key: [1], val: -1 },
          { key: [2], val: -1.5 },
          { key: [3], val: -1.7 },
          { key: [4], val: -2.5 },
          { key: [5], val: -0.1 },
          { key: [6], val: 0.5 },
          { key: [7], val: 1.1 },
          { key: [8], val: 1.5 },
          { key: [9], val: 2 },
          { key: [10], val: 3 }
        ]
      },
      {
        id: 'logPValue' as PObjectId,
        spec: {
          kind: 'PColumn',
          valueType: 'Double',
          name: 'LogPValue',
          annotations: { 'pl7.app/label': 'Log p-value' },
          axesSpec: [{ type: 'Int', name: 'key', annotations: { 'pl7.app/label': 'Key dot axis' } }
          ]
        },
        data: [
          { key: [1], val: 10 },
          { key: [2], val: 1.12 },
          { key: [3], val: 5.2 },
          { key: [4], val: 20.1 },
          { key: [5], val: 18.5 },
          { key: [6], val: 2.5 },
          { key: [7], val: 7.4 },
          { key: [8], val: 3.3 },
          { key: [9], val: 12.8 },
          { key: [10], val: 22.2 }
        ]
      },
      {
        id: 'upDownInfo' as PObjectId,
        spec: {
          kind: 'PColumn',
          valueType: 'String',
          name: 'UpDownInfo',
          annotations: {
            'pl7.app/label': 'Up-down info',
            'pl7.app/graph/palette': JSON.stringify({name: 'triadic', mapping: {'UP': '19', 'DOWN':'22', 'NS': '25'}}),
            // '{"name":"triadic","mapping":{"UP":"19","DOWN":"22","NS":"25"}}'
            'pl7.app/graph/thresholds': JSON.stringify([
              {columnId: {name: 'LogFoldChange', valueType: 'Double'}, label: 'Min LogFC (left vertical)', value: '-1'},
              {columnId: {name: 'LogFoldChange', valueType: 'Double'}, label: 'Max LogFC (right vertical)', value: '1'},
              {columnId: {name: 'LogPValue', valueType: 'Double'}, label: 'Y bound', value: '2'
              }])
            //[{"columnId":{"name":"LogFoldChange","valueType":"Double"},"label":"Min LogFC (left vertical)","value":"-1"},{"columnId":{"name":"LogFoldChange","valueType":"Double"},"label":"Max LogFC (right vertical)","value":"1"},{"columnId":{"name":"LogPValue","valueType":"Double"},"label":"Y bound","value":"2"}]'
          },
          axesSpec: [{ type: 'Int', name: 'key', annotations: { 'pl7.app/label': 'Key dot axis' } }]
        },
        data: [
          { key: [1], val: 'DOWN' },
          { key: [2], val: 'NS' },
          { key: [3], val: 'DOWN' },
          { key: [4], val: 'DOWN' },
          { key: [5], val: 'NS' },
          { key: [6], val: 'NS' },
          { key: [7], val: 'UP' },
          { key: [8], val: 'UP' },
          { key: [9], val: 'UP' },
          { key: [10], val: 'UP' }
        ]
      },
      {
        id: 'labelColumn' as PObjectId,
        spec: {
          kind: 'PColumn',
          valueType: 'String',
          name: 'labelColumn',
          annotations: { 'pl7.app/label': 'Labels' },
          axesSpec: [{ type: 'Int', name: 'key', annotations: { 'pl7.app/label': 'Key dot axis' } }]
        },
        data: [
          { key: [1], val: 'Sample 1' },
          { key: [2], val: null },
          { key: [3], val: 'Sample 2' },
          { key: [4], val: 'Sample 3' },
          { key: [5], val: null },
          { key: [6], val: null },
          { key: [7], val: 'Sample 4' },
          { key: [8], val: 'Sample 5' },
          { key: [9], val: 'Sample 6' },
          { key: [10], val: 'Sample 7' }
        ]
      }
    ] as PColumn<PColumnValues>[];
    return ctx.createPFrame(columnsVolcanoTest);
  })
  .done();

export type BlockOutputs = InferOutputsType<typeof platforma>;
