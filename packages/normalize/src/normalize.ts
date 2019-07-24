import { IncomingMessage, ServerResponse } from 'http';
import { getProvider, expressLike } from './getProvider';

type CallbackFunction = (request: IncomingMessage, response: ServerResponse) => any
type Options = object;

export const normalize = (callback: CallbackFunction, options: Options = {}) => {
    const providerName = getProvider();

    if (expressLike.includes(providerName)) {
      return callback;
    }

    let providerModule;

    try {
      providerModule = require(`../../${providerName}/lib/provider.js`);
    } catch (e) {
      throw new Error(`You need to install the @serverless-${providerName} package manually`);
    }

    return (providerModule.provider as Function)(callback, options);
};
