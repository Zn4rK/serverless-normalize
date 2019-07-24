import { getProvider, GetProvider } from '../src/getProvider';
import { normalize } from '../src';

describe('getProvider', () => {
  const env = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...env };
  });

  it('should have the required exports', () => {
    expect(getProvider).toBeDefined();
  });

  it('identifies serverless-offline environment as aws environment', () => {
    process.env.IS_OFFLINE = String(true);
    expect(getProvider()).toBe(GetProvider.AWS);
  });

  it('identifies aws environment', () => {
    process.env.AWS_REGION = String(true);
    expect(getProvider()).toBe(GetProvider.AWS);
  });

  it('identifies gcf (node 8) environment', () => {
    process.env.FUNCTION_IDENTITY = String(true);
    expect(getProvider()).toBe(GetProvider.GCF);
  });

  it('identifies gcf (node 10) environment', () => {
    process.env.FUNCTION_SIGNATURE_TYPE	 = String(true);
    expect(getProvider()).toBe(GetProvider.GCF);
  });

  it('throws when no supported provider could be found', () => {
    const callback = jest.fn();

    expect(() => {
      normalize(callback);
    }).toThrow('Provider not supported');

    expect(callback).not.toHaveBeenCalled();
  });
});
