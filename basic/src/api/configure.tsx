import fetch from './fetch';
import { ConfigureResponse, ConfigureRequest } from './types/configurator';

/**
 * function for calling `/products` over HTTP
 */
async function callConfigure(
  args: ConfigureRequest
): Promise<ConfigureResponse> {
  const result = await fetch('/configurator/v1/configure', 'POST', {
    packagePath: process.env.REACT_APP_PACKAGE_PATH,
    ...args,
  });
  return result;
}

export default callConfigure;
