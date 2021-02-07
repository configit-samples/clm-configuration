import {
  ConfigurationVariable,
  ConfigureResponse,
  Phase,
  Section,
} from '../types/configurator';
import { UIAssignment } from './assignment-utils';

export function getCompletedPhases(configuration: ConfigureResponse) {
  return configuration.phases?.filter((p) => p.isComplete) || [];
}

export function getPhaseName(phase: Phase) {
  return (phase.sections || [])[0]?.name;
}

export function hasPhases(configuration: ConfigureResponse) {
  return (configuration.phaseCompletion?.totalPhases || 0) > 0;
}

export function getPhaseAssignments(
  phase: number | Phase,
  assignments: UIAssignment[],
  configuration?: ConfigureResponse
) {
  const variables = getPhaseVariables(phase, configuration);
  return assignments.filter((a) =>
    variables?.some((v) => v.id === a.variable.id)
  );
}

export function getPhaseVariables(
  phase: number | Phase,
  configuration?: ConfigureResponse
) {
  let phaseObj: Phase;
  if (typeof phase === 'number') {
    phaseObj = (configuration?.phases || [])[phase];
  } else {
    phaseObj = phase;
  }
  return phaseObj?.sections?.flatMap(getSectionVariables) || [];
}

export function getSectionVariables(section: Section): ConfigurationVariable[] {
  return [
    ...(section.sections?.flatMap((s) => getSectionVariables(s)) || []),
    ...(section.variables || []),
  ];
}
