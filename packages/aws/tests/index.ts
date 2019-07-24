import { normalize } from '../src';
import { provider } from '../src/provider';

describe('index', () => {
  it('exports provider as normalize', () => {
    expect(normalize).toEqual(provider);
  });
});
