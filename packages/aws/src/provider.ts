import { ServerResponse } from 'http';
import { toPromise } from '@serverless-normalize/utils';
import { Request } from './request';
import { filterHeaders } from './utils/filterHeaders';
import { isBinary } from './utils/isBinary';

export type Callback = (request: Request, response: ServerResponse) => any;

export interface Options {
  binary?: boolean | string[] | Function;
}

export const provider = (callback: Callback, options: Options = {}) =>
  async (event: AWSLambda.APIGatewayEvent): Promise<AWSLambda.APIGatewayProxyResult> => {
  const request = new Request(event);
  const response = new ServerResponse(request);

  const promise = toPromise(response);

  callback(request, response);

  const body = await promise;
  const [headers, multiValueHeaders] = filterHeaders(response.getHeaders());
  const isBase64Encoded = isBinary(response.getHeaders(), options);

  return {
    headers,
    multiValueHeaders,
    isBase64Encoded,
    statusCode: response.statusCode,
    body: body.toString(isBase64Encoded ? 'base64' : 'utf8'),
  };
};
