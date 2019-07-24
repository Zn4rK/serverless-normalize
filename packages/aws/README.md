# @serverless-normalize/aws

The compatibility layer for AWS and `@serverless-normalize`.

## API

#### `normalize(callback: Function, options?: object): AWSLambda.APIGatewayProxyResult`

The `callback` has a function signature of:
```typescript
type Request = http.IncomingMessage & { originalEvent: AWSLambda.APIGatewayEvent };

type Callback = (
  request: Request,
  response: http.ServerResponse,
) => void
```

It is your responsibility to call `response.end()`! 

`options` is optional and looks like this:

```typescript
interface Options {
  binary?: boolean | string[] | Function;
}
```

#### options.binary

**`true`**<br><br>
This is the default behavior. Checks if response header `Content-Encoding` is set and equals to `gzip`, `deflate` or `br` and the response header `Content-Type` against those specified.

**`false`**<br><br>
Turns off the default behavior, and doesn't base64-encode any content for you.

**`string[]`**<br><br>
Adds the mime types to the list we will check the response header `content-type` against.

**`Function`**<br><br>
The callback has a signature of:
```typescript
type BinaryCallback = (headers: http.OutgoingHttpHeaders) => boolean
```

### Binary Mode

You can specify the `Content-Type`s in the environmental variable BINARY_CONTENT_TYPES via a comma separated list.

See [options.binary](README.md#optionsbinary) for more advanced configuration options.

## Usage

Install `@serverless-normalize/normalize` and `@serverless-normalize/aws` for automatic AWS detection.

## Standalone usage

To use this package without `@serverless-normalize/normalize` all you need to do is to import `normalize` from this
package instead of the aforementioned.  

