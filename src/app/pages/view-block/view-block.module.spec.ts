import { ViewBlockModule } from './view-block.module';

describe('ViewBlockModule', () => {
  let viewBlockModule: ViewBlockModule;

  beforeEach(() => {
    viewBlockModule = new ViewBlockModule();
  });

  it('should create an instance', () => {
    expect(viewBlockModule).toBeTruthy();
  });
});
