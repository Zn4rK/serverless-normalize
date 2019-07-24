# @serverless-normalize/utils

A collection of utility functions that can be shared across different providers.

## API

#### toPromise(response: ServerResponse) => Promise<Buffer>

Overrides the `.write()` and `.end()` methods in ServerResponse to be able to intercept all messages written on the WritableStream.
