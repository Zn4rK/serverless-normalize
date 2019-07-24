# serverless-normalize 😎

Normalize your serverless functions by abstracting away the differences between the different serverless providers.
It adds a standardized request/response model, that you can hook into any framework you like - or use it as is!

The package `@serverless-normalize/normalize` automatically identifies which provider you are using and if you have 
the compatibility layer installed for that provider, it'll call your function with the Node.js standard 
HTTP [request](https://nodejs.org/api/http.html#http_event_request) and [response](https://nodejs.org/api/http.html#http_class_http_serverresponse) objects.

## Support

### Supported Providers

* AWS (via [`@serverless-normalize/aws`](packages/aws/README.md))
* serverless-offline
* GCP
* ... accepting PRs for other providers

## Installation
```
npm install @serverless-normalize/normalize --save
```

If you are using AWS or serverless-offline you'll also need the compatibility layer. 
```
npm install @serverless-normalize/aws --save
```

## API

#### `normalize(callback: Function, options?: object): any`

The `callback` has a function signature of:
```typescript
type Callback = (
  request: http.IncomingMessage,
  response: http.ServerResponse,
) => void
```

`options` is optional and depends on the provider. Sensible defaults are used for all the providers.

## Examples

#### With Koa:
```js
// handler.js
import { normalize } from '@serverless-normalize/normalize';
import Koa from 'koa';

const app = new Koa();

app.use(async ctx => {
  ctx.status = 200;
  ctx.body = JSON.stringify({ message: 'Yay!' });
});

export default normalize(app.callback());
```

## FAQ
* Why the relative require?<br><br>
    > Two reasons:<br>
    There is no support for "optionalPeerDependencies" in a `package.json`
    file - and we don't want to load more code than necessary.<br><br>
    And the other reason is because of module bundlers (like Webpack) to still be able to do their analysis
    and not emit errors or warnings about missing packages
    (which they would have been if you only include the providers you plan on using).<br><br>
    Since scoped packages installs every package under your own scope, this works!
    

## Similar Projects

* [Alagarr](https://github.com/adieuadieu/alagarr)
* [serverless-http](https://github.com/dougmoscrop/serverless-http)
* [Middy](https://github.com/middyjs/middy)
* [corgi](https://github.com/balmbees/corgi)
* [node-lambda-req](https://github.com/doomhz/node-lambda-req)
* [apigateway-utils](https://github.com/silvermine/apigateway-utils)
* [serverless-utils](https://github.com/silvermine/serverless-utils)
* [@graphcool/lambda-helpers](https://www.npmjs.com/package/lambda-helpers)

## Contributing

Contributions are more than welcome! Just fork and clone the repository and run ```npm install```.

## License

**serverless-normalize** © [Alexander Liljengård](https://github.com/zn4rk). Released under the [MIT](./LICENSE) license.
<br>
Authored and maintained by Alexander Liljengård with help from [contributors](https://github.com/zn4rk/serverless-http/contributors).
