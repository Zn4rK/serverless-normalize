import { Options } from '../provider';
import { OutgoingHttpHeaders } from "http";

/**
 * Most of the logic here is taken from https://github.com/dougmoscrop/serverless-http
 * @see https://git.io/fjDWQ
 */
const BINARY_ENCODINGS = ['gzip', 'deflate', 'br'];

const isBinaryEncoding = (headers: OutgoingHttpHeaders) => {
  const encoding = headers['content-encoding'];

  if (typeof encoding === 'string') {
    return encoding.split(',').some(value =>
      BINARY_ENCODINGS.some(binaryEncoding => value.indexOf(binaryEncoding) !== -1)
    );
  }
};

const isBinaryContent = (headers: OutgoingHttpHeaders, options: Options) => {
  const BINARY_CONTENT_TYPES = (process.env.BINARY_CONTENT_TYPES || '').split(',').filter(x => x);
  const contentTypes = [].concat(BINARY_CONTENT_TYPES, options.binary || []).map(candidate => (
    new RegExp(`^${candidate.replace(/\*/g, '.*')}$`)
  ));

  const contentType = (headers['content-type'] as string || '').split(';')[0];
  return !!contentType && contentTypes.some(candidate => candidate.test(contentType));
};

export const isBinary = (headers: OutgoingHttpHeaders, options: Options) => {
  const { binary } = options;

  if (binary === false) {
    return false;
  }

  if (typeof binary === 'function') {
    return binary(headers);
  }

  return isBinaryEncoding(headers) || isBinaryContent(headers, options);
};
