import {
  InferHrefType,
  PColumn,
  PFrameDef,
  PlatformaConfiguration,
  TreeNodeAccessor,
  getImmediate,
  isPColumn,
  type InferOutputsType
} from '@milaboratory/sdk-ui';

export type BlockArgs = {};

export const platforma = PlatformaConfiguration.create<BlockArgs>('Heavy')
  .initialArgs({})

  .sections(getImmediate([{ type: 'link', href: '/', label: 'Main' }]))

  // .output('csvProgress', getImportProgress(getResourceField(MainOutputs, 'csvImport')))

  // .output('paramsProgress', getImportProgress(getResourceField(MainOutputs, 'paramsImport')))

  .output('pFrame', (render) => {
    const collection = render.resultPool.getDataFromResultPool();
    if (collection === undefined || !collection.isComplete) return undefined;

    const pColumns = collection.entries.map(({ obj }) => obj).filter(isPColumn);
    return render.createPFrame(pColumns);
  })

  // .output('pTable', (render) => {
  //   const collection = render.mainOutput?.resolve('resource')?.parsePObjectCollection();
  //   if (collection === undefined) return undefined;
  //   const pObjects = Object.entries(collection).map(([, obj]) => {
  //     if (!isPColumn(obj)) throw new Error(`not a PColumn (kind = ${obj.spec.kind})`);
  //     return obj;
  //   });
  //   return render.createPTable({
  //     src: {
  //       type: 'inner',
  //       entries: pObjects.map((c) => ({ type: 'column', column: c }))
  //     },
  //     filters: [],
  //     sorting: []
  //   });
  // })

  .done();

export type BlockOutputs = InferOutputsType<typeof platforma>;

export type NavigationHref = InferHrefType<typeof platforma>;
