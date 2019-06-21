import React from 'react';
import VariableLine from './VariableLine';
import { showVariable } from '../utils/variable-utils';
import './Section.css';

/**
 * `<Section>` component that renders a section from the
 * configure response.
 *
 * A section is rendered by rendering a `<VariableLine>` for variable in
 * the section.
 *
 */
export function Section({
  section,
  onAssign,
  onUnassign,
  removedAssignments,
  level = 0
}) {
  const visibleVariables = section.variables.filter(showVariable);

  if (visibleVariables.length === 0 && section.sections.length === 0) {
    return null;
  }

  return (
    <section>
      {level > 0 && (
        <header className={`section-header section-header-level${level}`}>
          {section.name}
        </header>
      )}
      {visibleVariables.map(variable => (
        <VariableLine
          key={variable.id}
          variable={variable}
          onAssign={onAssign}
          onUnassign={onUnassign}
          removedAssignments={removedAssignments}
        />
      ))}
      {(section.sections || []).map(subSection => (
        <Section
          key={`${section.id}-${subSection.id}`}
          section={subSection}
          onAssign={onAssign}
          onUnassign={onUnassign}
          removedAssignments={removedAssignments}
          level={level + 1}
        />
      ))}
    </section>
  );
}
