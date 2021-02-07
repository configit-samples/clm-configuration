import { useCallback } from 'react';
import fetch from './fetch';
import {
  ConfigureResponse,
  ConfigureRequest,
  ValueWithUnit,
  VariableAssignment,
} from './types/configurator';
import { useFetch } from './useFetch';
import { globalArguments } from '../globalArguments';
import hash from 'object-hash';

/**
 * function for calling `/configure` over HTTP
 */
export async function callConfigure(
  args: ConfigureRequest
): Promise<ConfigureResponse> {
  const result = await fetch('/configurator/v1/configure', 'POST', {
    packagePath: process.env.REACT_APP_PACKAGE_PATH,
    ...args,
  });
  return result;
}

const today = new Date(Date.now()).toISOString();

export function useConfigure(
  productId: string,
  quantity: ValueWithUnit,
  variableAssignments: VariableAssignment[],
  language?: string,
  view?: string
) {
  const assignmentHash = hash({ a: variableAssignments, l: language, v: view });
  console.log(assignmentHash);
  const cb = useCallback(
    () =>
      callConfigure({
        date: today,
        language,
        viewId: view,
        globalArguments,
        line: {
          quantity,
          productId,
          variableAssignments,
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [productId, quantity, language, assignmentHash]
  );

  return useFetch<ConfigureResponse>(cb, assignmentHash);
}

export default callConfigure;
