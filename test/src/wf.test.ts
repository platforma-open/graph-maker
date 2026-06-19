import { blockSpec } from "this-block";
import { blockTest } from "@platforma-sdk/test";

blockTest("Run template", { timeout: 30000 }, async ({ rawPrj: project, helpers }) => {
  const blockId = await project.addBlock("Block", blockSpec);
  const overview = await project.overview.getValue();
  const blockOverview = overview?.blocks.find((b) => b.id === blockId)!;
  if (blockOverview.updatedBlockPack) {
    await project.updateBlockPack(blockId, blockOverview.updatedBlockPack!);
  }
  await project.runBlock(blockId);
  await helpers.awaitBlockDone(blockId);
  const blockState = await project.getBlockState(blockId);
  console.dir(await blockState.awaitStableValue(), { depth: 5 });
});
