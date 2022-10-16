import { AuthenticatedGuard } from './authenticated-guard';

describe('AuthenticatedGuard', () => {
  it('should create an instance', () => {
    expect(new AuthenticatedGuard()).toBeTruthy();
  });
});
