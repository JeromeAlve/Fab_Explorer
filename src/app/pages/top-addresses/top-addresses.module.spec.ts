import { TopAddressesModule } from './top-addresses.module';

describe('TopAddressesModule', () => {
  let topAddressesModule: TopAddressesModule;

  beforeEach(() => {
    topAddressesModule = new TopAddressesModule();
  });

  it('should create an instance', () => {
    expect(topAddressesModule).toBeTruthy();
  });
});
