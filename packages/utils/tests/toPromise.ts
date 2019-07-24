import { toPromise } from "../src";
import { ServerResponse } from 'http';

describe('toPromise', () => {
  it('returns a promise', () => {
    return expect(
      toPromise({ write: jest.fn(), end: jest.fn() } as unknown as ServerResponse)
    ).toBeInstanceOf(Promise);
  });

  it('modifies .write() and .end() methods', () => {
    const write = jest.fn();
    const end = jest.fn();

    const originalObject = { write, end };

    // noinspection JSIgnoredPromiseFromCall
    toPromise(originalObject as unknown as ServerResponse);

    expect(originalObject.write).not.toBe(write);
    expect(originalObject.end).not.toBe(end);
  });

  it('calls the original write implementation', () => {
    const write = jest.fn();

    const originalObject = { write, end: () => {} };

    // noinspection JSIgnoredPromiseFromCall
    toPromise(originalObject as unknown as ServerResponse);

    const message = 'This should call the original implementation';

    originalObject.write(message);
    expect(write).toHaveBeenCalledWith(message);
  });

  it('calls the original end implementation', () => {
    const end = jest.fn();

    const originalObject = { write: () => {}, end };

    // noinspection JSIgnoredPromiseFromCall
    toPromise(originalObject as unknown as ServerResponse);

    const message = 'This ends the ServerResponse';

    originalObject.end(message);
    expect(end).toHaveBeenCalledWith(message);
  });


  it('resolves the promise with written data as buffer', () => {
    const write = jest.fn();
    const end = jest.fn();

    const originalObject = { write, end };

    // noinspection JSIgnoredPromiseFromCall
    const promise = toPromise(originalObject as unknown as ServerResponse);

    const writeMessage = 'This should call the original implementation';
    const endMessage = 'End this is the end-message';

    originalObject.write(writeMessage);
    originalObject.end(endMessage);

    expect(write).toHaveBeenCalledWith(writeMessage);
    expect(end).toHaveBeenCalledWith(endMessage);

    return expect(promise).resolves.toEqual(
      Buffer.concat([
        Buffer.from(writeMessage),
        Buffer.from(endMessage)
      ])
    );
  });

  it(`resolves correctly when using a function in end`, () => {
    const write = jest.fn();
    const end = jest.fn();

    const originalObject = { write, end };

    const promise = toPromise(originalObject as unknown as ServerResponse);

    originalObject.write('hello åäö');
    originalObject.end(() => {});

    return expect(promise).resolves.toEqual(Buffer.from('hello åäö'));
  });
});
