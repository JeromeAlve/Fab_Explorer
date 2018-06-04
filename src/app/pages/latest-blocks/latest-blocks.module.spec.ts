import { LatestBlocksModule } from './latest-blocks.module';

describe('LatestBlocksModule', () => {
  let latestBlocksModule: LatestBlocksModule;

  beforeEach(() => {
    latestBlocksModule = new LatestBlocksModule();
  });

  it('should create an instance', () => {
    expect(latestBlocksModule).toBeTruthy();
  });
});
