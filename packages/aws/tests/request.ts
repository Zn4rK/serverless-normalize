import { mockEvent } from './fixtures/requests';
import { Request } from '../src/request';

describe('toPromise.ts', () => {
  it('sets original event', () => {
    const request = new Request(mockEvent);
    expect(request.originalEvent).toEqual(mockEvent);
  });

  it('sets body', () => {
    const body = 'hello';

    const request = new Request({ ...mockEvent, body });

    request.on('data', (data) => {
      expect(data.toString()).toBe(body);
    });
  });

  it('sets body base64', () => {
    const request = new Request({
      ...mockEvent,
      body: Buffer.from('hello').toString('base64'),
      isBase64Encoded: true
    });

    request.on('data', (data) => {
      expect(data.toString()).toBe('hello');
    });
  });

  it('does not set body if we have no body', () => {
    const request = new Request({
      ...mockEvent,
      body: null
    });

    const mock = jest.fn();
    request.on('data', mock);
    expect(mock).not.toHaveBeenCalled();
  });

  it('sets headers and minimizes them', () => {
    const headers = {
      'content-type': 'application/json',
      'other-HEADER': 'cool'
    };

    const expected = {
      'content-type': 'application/json',
      'other-header': 'cool'
    };

    const request = new Request({ ...mockEvent, headers });
    expect(request.headers).toEqual(expected);
  });

  it('sets http version', () => {
    const request = new Request(mockEvent);
    expect(request.httpVersion).toBe('1.1');
    expect(request.httpVersionMajor).toBe('1');
    expect(request.httpVersionMajor).toBe('1');
  });

  it('sets method', () => {
    const request = new Request({...mockEvent, httpMethod: 'PUT'});
    expect(request.method).toBe('PUT');

    const request2 = new Request({...mockEvent, httpMethod: 'RANDOM-METHOD'});
    expect(request2.method).toBe('RANDOM-METHOD');
  });

  it('marks the request as complete', () => {
    const request = new Request(mockEvent);
    expect(request.complete).toBe(true);
  });

  it('sets url', () => {
    const path = '/my-cool-path';
    const request = new Request({ ...mockEvent, path });
    expect(request.url).toBe('/my-cool-path');
  });

  it('sets url with query strings (when using queryStringParameters)', () => {
    const path = '/my-second-cool-path';
    const queryStringParameters = {
      hi: 'hello',
      hello: 'hi'
    };

    const request = new Request({ ...mockEvent, path, queryStringParameters });
    expect(request.url).toBe(`${path}?hi=hello&hello=hi`);
  });

  it('sets url with query strings (when using multiValueQueryStringParameters)', () => {
    const path = '/my-kinda-cool-path';
    const multiValueQueryStringParameters = {
      hi: ['hello', 'hi'],
      hello: ['hi']
    };

    const request = new Request({ ...mockEvent, path, multiValueQueryStringParameters });
    expect(request.url).toBe(`${path}?hi=hello&hi=hi&hello=hi`);
  });

  it('sets url with query strings (when using both)', () => {
    const path = '/my-other-cool-path';
    const multiValueQueryStringParameters = {
      hi: ['hello', 'hi urlencoded'],
      hello: ['hi']
    };

    const queryStringParameters = {
      ignored: 'this should be ignored'
    };

    const request = new Request({
      ...mockEvent,
      path,
      multiValueQueryStringParameters,
      queryStringParameters
    });

    expect(request.url).toBe(`${path}?hi=hello&hi=hi%20urlencoded&hello=hi`);
  });

  it('sets remote address', () => {
    const request = new Request(
      {
        ...mockEvent,
        requestContext: {
          ...mockEvent.requestContext,
          identity: {
            ...mockEvent.requestContext.identity,
            sourceIp: 'custom-ip-address'
          }
        }
      }
    );

    expect(request.connection.remoteAddress).toBe('custom-ip-address');
  });
});
