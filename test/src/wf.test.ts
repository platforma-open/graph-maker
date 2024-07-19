import { blockTest } from '@milaboratory/sdk-test';
import { wrapOutputs } from '@milaboratory/sdk-ui';
import { BlockArgs, BlockOutputs } from 'block-config';

blockTest('Run template', { timeout: 15000 }, async ({ rawPrj: prj, helpers, ml, myBlockSpec }) => {
  const blockId = await prj.addBlock('Block', myBlockSpec);
  await prj.runBlock(blockId);
  await helpers.awaitBlockDone(blockId);
  const blockState = prj.getBlockState(blockId);
  const result = await blockState.awaitStableValue();
  const outputs = wrapOutputs(result.outputs! as BlockOutputs);
  console.dir(outputs, { depth: 5 });
});
