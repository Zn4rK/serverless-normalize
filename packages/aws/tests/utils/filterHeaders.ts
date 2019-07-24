import { filterHeaders } from '../../src/utils/filterHeaders';

describe('filterHeaders', () => {
  it('is defined', () => {
    expect(filterHeaders).toBeDefined();
  });

  it('correctly filters strings', () => {
    expect(filterHeaders({ otherKeyName: 'value' })).toEqual([
      { otherKeyName: 'value' },
      {}
    ]);
  });

  it('correctly filters arrays', () => {
    expect(filterHeaders({ keyName: ['value1', 'value2'] })).toEqual([
      {},
      { keyName: ['value1', 'value2'] }
    ]);
  });

  it('correctly filters both', () => {
    expect(filterHeaders({
      otherKeyName: 'value',
      arrayKeyName: ['value1', 'value2'],
      anotherWithArrays: ['more1', 'more2'],
      moreStrings: 'value2'
    })).toEqual([
      { otherKeyName: 'value', moreStrings: 'value2' },
      { arrayKeyName: ['value1', 'value2'], anotherWithArrays: ['more1', 'more2'] }
    ]);
  });
});
