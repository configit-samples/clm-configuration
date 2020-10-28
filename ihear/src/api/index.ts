import fetch from './fetch';
import { Assignment, IncompatibleAssignment, Variable, Section } from './types';
import { getAssignedValue } from './variable';

const BROCHURE_MODEL_VARIABLE_ID = 'BMOD';

type ResponseType = {
  sections: Section[];
  removedAssignments: {
    variableAssignments: IncompatibleAssignment[];
  };
};

type RequestType = {
  currency: string;
  language: string;
  date: Date;
  viewId: string;
  line: {
    id: string;
    quantity: { value: number; unit: string };
    productId: string;
    variableAssignments?: Assignment[];
  };
};

const CONFIGURE_URL = ``;

const baseRequest: RequestType = {
  currency: 'EUR',
  language: 'uk_en',
  date: new Date(),
  viewId: 'DEFAULT',
  line: {
    id: 'ROOT',
    quantity: { value: 1, unit: 'EA' },
    productId: 'IHEAR',
  },
};

const baseAssignments = [
  { variableId: 'MRKT', value: 'GBR' },
  {
    variableId: 'DIM_BUILDDATE',
    value: '2018-10-17T10:00:00.000Z',
  },
];

const brochureModelAssignment = (brochureModel: string) => ({
  variableId: BROCHURE_MODEL_VARIABLE_ID,
  value: brochureModel,
});

export const reset = async (packagePath: string) => {
  fetch.bind(null, `${CONFIGURE_URL}?packagePath=${packagePath}`, 'POST');
};

export const getConfiguration = async (
  brochureModel: string,
  assignments: Assignment[],
  packagePath: string
) => {
  const request = {
    ...baseRequest,
    line: {
      ...baseRequest.line,
      variableAssignments: [
        brochureModelAssignment(brochureModel),
        ...baseAssignments,
        ...(assignments || []),
      ],
    },
  };

  const resp = (await fetch(
    `${CONFIGURE_URL}?packagePath=${packagePath}`,
    'POST',
    request
  )) as ResponseType;

  const sections = resp.sections
    .filter((s) => s.id !== 'Scope' && s.id !== 'General')
    .map((s) => s.sections[0]);

  return {
    brochureModel: getAssignedValue(getBrochureModelVariable(resp)),
    sections,
    removedAssignments: resp.removedAssignments.variableAssignments,
  };
};

export const getBrochureModels = async (packagePath: string) => {
  const request = {
    ...baseRequest,
    line: {
      ...baseRequest.line,
      variableAssignments: baseAssignments,
    },
  };

  const resp = (await fetch(
    `${CONFIGURE_URL}?packagePath=${packagePath}`,
    'POST',
    request
  )) as ResponseType;

  const brochureModels = getBrochureModelVariable(resp).values.filter(
    (value) => !value.incompatible
  );

  return { brochureModels };
};

const getBrochureModelVariable = (resp: ResponseType) =>
  resp.sections[0].variables.find((v) => v.id === BROCHURE_MODEL_VARIABLE_ID) ||
  ({} as Variable);
