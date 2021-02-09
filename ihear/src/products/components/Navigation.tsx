import React from 'react';
import { Section } from '../../api/types';
import Button from '../../components/Button';
type NavigationProps = {
  prevSection: Section;
  onPrev: () => void;
  nextSection: Section;
  onNext: () => void;
};
const Navigation: React.SFC<NavigationProps> = ({
  prevSection,
  onPrev,
  nextSection,
  onNext,
}) => (
  <nav>
    <div className="prev">
      {prevSection && (
        <Button color="dark" size="normal" onClick={onPrev}>
          ❮{'  '}
          {prevSection.name}
        </Button>
      )}
    </div>
    <div className="next">
      {nextSection && (
        <Button color="dark" size="normal" onClick={onNext}>
          {nextSection.name}
          {'  '}❯
        </Button>
      )}
    </div>
    <style jsx>{`
      nav {
        display: flex;
        flex-direction: row;

        justify-content: space-between;
        z-index: 5;
        margin-top: 24px;
        margin-bottom: 12px;
      }
      .prev {
        margin-right: 6px;
      }
    `}</style>
  </nav>
);

export default Navigation;
