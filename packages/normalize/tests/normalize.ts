// noinspection TypeScriptPreferShortImport
import { normalize } from '../src/normalize';
import { getProvider, expressLike } from '../src/getProvider';

jest.mock('../src/getProvider');

describe('normalize', () => {
  beforeEach(() => jest.resetModules());

  it('should have the required exports', () => {
    expect(normalize).toBeDefined();
  });

  it('returns the callback if expressLike', () => {
    const fakePackage = 'express-like-package';
    expressLike.push(fakePackage as any);
    (getProvider as jest.Mock).mockImplementation(() => fakePackage);

    const callback = jest.fn();

    expect(normalize(callback)).toEqual(callback);
  });

  it('throws when supported module is not found', () => {
    const fakePackage = 'non-installed-module';
    (getProvider as jest.Mock).mockImplementation(() => fakePackage);

    expect(() => {
      normalize(() => {});
    }).toThrow(`You need to install the @serverless-${fakePackage} package manually`);
  });

  it('calls the provider with the callback and options', () => {
    const fakePackage = 'supported-but-non-existent';
    const provider = jest.fn();
    const callback = jest.fn();
    const options = {};

    (getProvider as jest.Mock).mockImplementation(() => fakePackage);
    jest.doMock('../../' + fakePackage + '/lib/provider.js', () => ({ provider }), { virtual: true });

    normalize(callback);

    expect(provider).toHaveBeenCalledWith(callback, options);
  });
});
