import { ViewTransactionModule } from './view-transaction.module';

describe('ViewTransactionModule', () => {
  let viewTransactionModule: ViewTransactionModule;

  beforeEach(() => {
    viewTransactionModule = new ViewTransactionModule();
  });

  it('should create an instance', () => {
    expect(viewTransactionModule).toBeTruthy();
  });
});
