import React from 'react';
import { Section, Assignment, IncompatibleAssignment } from '../../api/types';
import Navigation from './Navigation';
import VariableLine from './VariableLine';
type SectionConfiguratorProps = {
  section: Section;
  prevSection: Section;
  onPrev: () => void;
  nextSection: Section;
  onNext: () => void;
  onAssign: (assignment: Assignment) => void;
  onUnassign: (assignment: Assignment) => void;
  onCheckRemovedAssignments: (
    assignment: Assignment
  ) => Promise<IncompatibleAssignment[]>;
};
function SectionConfigurator({
  section,
  prevSection,
  nextSection,
  onPrev,
  onNext,
  onAssign,
  onUnassign,
  onCheckRemovedAssignments,
}: SectionConfiguratorProps) {
  return (
    <section>
      <div className="title">
        <h3>{section.name}</h3>

        <Navigation
          onPrev={onPrev}
          prevSection={prevSection}
          onNext={onNext}
          nextSection={nextSection}
        />
      </div>
      {section.variables.map((variable) => (
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
        .title {
          display: flex;
          align-items: center;
          padding-right: 4px;
        }
        .title > h3 {
          flex: 1;
        }
      `}</style>
    </section>
  );
}

export default SectionConfigurator;
