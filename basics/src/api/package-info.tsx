import { useCallback, useMemo } from 'react';
import fetch from './fetch';
import { useFetch } from './useFetch';
import { PackageResponse, ProductResponse } from './types/packages';

/**
 * function for calling `/packages/v1/product` over HTTP
 */
async function getProductInfo(id: string): Promise<ProductResponse> {
  const result = await fetch(`/packages/v1/products/${id}`, 'GET', {
    packagePath: process.env.REACT_APP_PACKAGE_PATH,
  });
  return result;
}

/**
 * function for calling `/packages/v1/package` over HTTP
 */
async function callPackageInfo(): Promise<PackageResponse> {
  const result = await fetch('/packages/v1/packages', 'GET', {
    packagePath: process.env.REACT_APP_PACKAGE_PATH,
  });
  return result;
}

export function usePackageInfo() {
  return useFetch<PackageResponse>(callPackageInfo);
}

export function useProductInfo(id: string) {
  const cb = useCallback(() => getProductInfo(id), [id]);

  return useFetch<ProductResponse>(cb);
}
