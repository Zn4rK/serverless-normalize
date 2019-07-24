import * as http from 'http';
import * as url from 'url';

export class Request extends http.IncomingMessage {
  public readonly originalEvent: AWSLambda.APIGatewayEvent;
  constructor(event: AWSLambda.APIGatewayEvent) {
    super({
      remoteAddress: event.requestContext.identity.sourceIp,
      encrypted: true,
      readable: false,
    } as any);

    Object.assign(this, {
      complete: true,
      httpVersion: '1.1',
      httpVersionMajor: '1',
      httpVersionMinor: '1',
    });

    this.originalEvent = event;

    this.method = event.httpMethod;
    this.headers = Object.keys(event.headers).reduce((headers, key) => {
      headers[key.toLowerCase()] = event.headers[key];
      return headers;
    }, {});

    const query = event.multiValueQueryStringParameters || event.queryStringParameters;
    this.url = url.format({
      pathname: event.path,
      query
    });

    if (event.body) {
      this.push(Buffer.from(event.body, event.isBase64Encoded ? 'base64' : 'utf8'));
    }

    this.push(null);
  }
}
