import fetch from './fetch';
import { PriceResponse, PriceRequest } from './types/configurator';

/**
 * function for calling `/price` over HTTP
 */
async function callPrice(args: PriceRequest): Promise<PriceResponse> {
  const result = await fetch('/configurator/v1/price', 'POST', {
    packagePath: process.env.REACT_APP_PACKAGE_PATH,
    ...args,
  });
  return result;
}

export default callPrice;
