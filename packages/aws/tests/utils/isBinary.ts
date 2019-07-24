import { isBinary } from '../../src/utils/isBinary';

/**
 * Most of the logic here is taken from https://github.com/dougmoscrop/serverless-http
 * @see https://git.io/fjDWQ
 */
describe('isBinary', function() {
  const env = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...env };
  });

  it('handles charset', function() {
    const result = isBinary({ 'content-type': 'application/json; charset:utf-8' }, {
      binary: ['application/json']
    });

    expect(result).toEqual(true);
  });

  it('handles wildcard', function() {
    const result = isBinary({ 'content-type': 'image/png' }, {
      binary: ['image/*']
    });

    expect(result).toEqual(true);
  });

  it('handles double wildcard', function() {
    const result = isBinary({ 'content-type': 'application/json' }, {
      binary: ['*/*']
    });

    expect(result).toEqual(true);
  });

  it('does not incorrectly handle wildcards', function() {
    const result = isBinary({ 'content-type': 'application/json' }, {
      binary: ['image/*']
    });

    expect(result).toEqual(false);
  });

  it('merges environment variables with config', () => {
    process.env.BINARY_CONTENT_TYPES = 'test';
    const binary = ['test2'];

    expect(
      isBinary({ 'content-type': 'test' }, { binary })
    ).toEqual(true);

    expect(
      isBinary({ 'content-type': 'test2' }, { binary })
    ).toEqual(true);
  });

  it('works with content-encoding', () => {
    expect(isBinary({ 'content-encoding': 'gzip' }, {})).toEqual(true);
  });

  it('handles ; separator', function() {
    const result = isBinary({ 'content-type': 'application/json; foo=bar' }, {
      binary: ['*/*']
    });

    expect(result).toEqual(true);
  });

  it('force to false', function() {
    const result = isBinary({ 'content-encoding': 'gzip' }, {
      binary: false
    });

    expect(result).toEqual(false);
  });

  it('custom function', function() {
    const stub = jest.fn().mockImplementation(() => true);
    const result = isBinary({}, {
      binary: stub
    });

    expect(result).toEqual(true);
    expect(stub).toHaveBeenCalled();
  });
});
