import fetch from './fetch';
import { ProductsResponse } from './types/configurator';

/**
 * function for calling `/products` over HTTP
 */
async function fetchProducts(searchTerm: string): Promise<ProductsResponse> {
  const result = await fetch('/configurator/v1/products', 'GET', {
    packagePath: process.env.REACT_APP_PACKAGE_PATH,
    searchTerm,
  });
  return result;
}

export default fetchProducts;
