import React, { ReactNode } from 'react';
import VariableLine from './VariableLine';
import { showVariable } from '../../../api/utils/variable-utils';
import {
  ConfigurationVariable,
  RemovedAssignments,
  Section as SectionType,
  SingletonValue,
} from '../../../api/types/configurator';
import tw from '../../../styles/classnames';

type SectionProps = {
  section: SectionType;
  removedAssignments?: RemovedAssignments;
  onAssign: (v: ConfigurationVariable, value: SingletonValue) => void;
  onUnassign: (v: ConfigurationVariable, value?: SingletonValue) => void;
  level?: number;
};

/**
 * `<Section>` component that renders a section from the configure response.
 *
 * A section is rendered by rendering a `<VariableLine>` for variable in
 * the section.
 */
export function Section({
  section,
  onAssign,
  onUnassign,
  removedAssignments,
  level = 0,
}: SectionProps) {
  if (!section) {
    return null;
  }
  const visibleVariables = section.variables?.filter(showVariable) || [];

  if (visibleVariables.length === 0 && section.sections?.length === 0) {
    return null;
  }

  const levels = [
    tw('pt-2', 'pb-6'),
    tw('pt-0', 'pb-2', 'pl-4'),
    tw('pt-0', 'pb-2', 'pl-8'),
    tw('pt-0', 'pb-1', 'pl-16'),
  ];

  return (
    <>
      <section className={levels[level] || levels[levels.length - 1]}>
        <SectionHeader level={level}>{section.name}</SectionHeader>
        {visibleVariables.map((variable) => (
          <VariableLine
            key={variable.id}
            variable={variable}
            onAssign={onAssign}
            onUnassign={onUnassign}
            removedAssignments={removedAssignments}
          />
        ))}
      </section>

      {(section.sections || []).map((subSection) => (
        <Section
          key={`${section.id}-${subSection.id}`}
          section={subSection}
          onAssign={onAssign}
          onUnassign={onUnassign}
          removedAssignments={removedAssignments}
          level={level + 1}
        />
      ))}
    </>
  );
}

type SectionHeaderProps = {
  level: number;
  children: ReactNode;
};

function SectionHeader({ level, children }: SectionHeaderProps) {
  const base = tw(
    'font-semibold',
    'text-gray-700',
    'capitalize',
    'sticky',
    'top-32',
    'w-full',
    'bg-white'
  );
  const levels = [
    tw('text-3xl', 'mb-4'),
    tw('text-2xl', 'mb-3'),
    tw('text-xl', 'mb-2'),
    tw('text-lg', 'mb-2'),
  ];
  const className = tw(base, levels[level] || levels[levels.length - 1]);

  return React.createElement('h' + (level + 1), { className }, children);
}
