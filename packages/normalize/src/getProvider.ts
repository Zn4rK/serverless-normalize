export enum GetProvider {
  AWS = 'aws',
  GCF = 'gcf'
}

/**
 * Providers that already exposes a request/response implementation
 */
export const expressLike = [GetProvider.GCF];

export const getProvider = () => {
  const { env } = process;

  if (env.IS_OFFLINE || env.AWS_REGION) {
    return GetProvider.AWS;
  } else if (env.FUNCTION_IDENTITY || env.FUNCTION_SIGNATURE_TYPE) {
    /** @see https://cloud.google.com/functions/docs/env-var#environment_variables_set_automatically */
    return GetProvider.GCF;
  }

  throw new Error(`Provider not supported`);
};
