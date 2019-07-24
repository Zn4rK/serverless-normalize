import * as http from 'http';

export const toPromise = (response: http.ServerResponse) => {
  const { write, end } = response;

  const body = [];

  return new Promise<Buffer>((resolve) => {
    response.write = (...args) => {
      const [chunk] = args;
      body.push(Buffer.from(chunk));
      return write.apply(response, args);
    };

    response.end = (...args) => {
      const [chunk] = args;

      if (chunk && typeof chunk !== 'function') {
        body.push(Buffer.from(chunk));
      }

      resolve(Buffer.concat(body));

      return end.apply(response, args);
    };
  });
};
