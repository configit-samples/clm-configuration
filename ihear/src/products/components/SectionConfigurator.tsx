import React from 'react';
import { Section, Assignment, IncompatibleAssignment } from '../../api/types';
import VariableLine from './VariableLine';
type SectionConfiguratorProps = {
  section: Section;
  onAssign: (assignment: Assignment) => void;
  onUnassign: (assignment: Assignment) => void;
  onCheckRemovedAssignments: (
    assignment: Assignment
  ) => Promise<IncompatibleAssignment[]>;
};
const SectionConfigurator: React.SFC<SectionConfiguratorProps> = ({
  section,
  onAssign,
  onUnassign,
  onCheckRemovedAssignments
}) => {
  return (
    <section>
      <h3>{section.name}</h3>
      {section.sections[0].variables.map(variable => (
        <VariableLine
          variable={variable}
          key={variable.id}
          onAssign={onAssign}
          onUnassign={onUnassign}
          onCheckRemovedAssignments={onCheckRemovedAssignments}
        />
      ))}
      <style jsx>{`
        section {
          flex: 1;
          align-content: flex-start;
          z-index: 2;
        }
      `}</style>
    </section>
  );
};

export default SectionConfigurator;
