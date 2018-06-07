import { ChainInfoModule } from './chain-info.module';

describe('ChainInfoModule', () => {
  let chainInfoModule: ChainInfoModule;

  beforeEach(() => {
    chainInfoModule = new ChainInfoModule();
  });

  it('should create an instance', () => {
    expect(chainInfoModule).toBeTruthy();
  });
});
