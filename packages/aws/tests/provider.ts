import { mockEvent } from './fixtures/requests';
import { provider } from '../src/provider';
import { Request } from '../src/request';
import { ServerResponse } from 'http';

describe('provider', () => {
  it('returns a function', () => {
    const result = provider(() => undefined);
    expect(result).toBeInstanceOf(Function);
  });

  it('returns a function that returns promise', () => {
    const result = provider(() => undefined)(mockEvent);
    return expect(result).toBeInstanceOf(Promise);
  });

  it('calls the callback with request and response', async () => {
    const callback = jest.fn((request: Request, response: ServerResponse) => {
      expect(request).toBeInstanceOf(Request);
      expect(response).toBeInstanceOf(ServerResponse);
      response.end();
    });

    await provider(callback)(mockEvent);
    expect(callback).toHaveBeenCalled();
  });

  it(`resolves to correct object and doesn't base64 encode the body`, async () => {
    const body = 'This should be the body';

    const callback = jest.fn((request: Request, response: ServerResponse) => {
      response.setHeader('set-cOokie', ['first_cookie=hello', 'second_cookie=hi']);
      response.setHeader('seRveR', 'lambda');
      response.writeHead(418, `I'm a teapot`);
      response.write(body);
      response.end();
    });

    const result = await provider(callback)(mockEvent);

    expect(callback).toHaveBeenCalled();
    expect(result).toEqual({
      body,
      statusCode: 418,
      headers: {
        server: 'lambda'
      },
      multiValueHeaders: {
        'set-cookie': [
          'first_cookie=hello',
          'second_cookie=hi'
        ]
      },
      isBase64Encoded: false
    });
  });

  it(`resolves to correct object and base64 encodes the body`, async () => {
    const body = 'This should be the body';

    const callback = jest.fn((request: Request, response: ServerResponse) => {
      response.setHeader('content-encoding', 'gzip');
      response.writeHead(418, `I'm a teapot`);
      response.write(body);
      response.end();
    });

    const result = await provider(callback)(mockEvent);

    expect(callback).toHaveBeenCalled();
    expect(result).toEqual({
      body: Buffer.from(body).toString('base64'),
      statusCode: 418,
      headers: {
        'content-encoding': 'gzip'
      },
      multiValueHeaders: {},
      isBase64Encoded: true
    });
  });
});
