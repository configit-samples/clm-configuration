import React, { useCallback, useContext, useState } from 'react';
import { Section } from './components/Section';
import SideNav from '../../components/SideNav';
import IssuesBanner from './components/IssuesBanner';
import { Section as SectionType } from '../../api/types/configurator';
import { ProductSummaryContext } from '../ProductModel';
import { List } from '../../components/List';
import {
  ConfiguratorContext,
  ConfiguratorProvider,
  ConfiguratorProviderProps,
  NO_VIEW,
} from './ConfiguratorContext';
import { Button } from '../../components/Button';
import { ReactComponent as ResetIcon } from 'heroicons/outline/refresh.svg';
import * as utils from '../../api/utils';
import { PhasePreview } from './components/PhasePreview';
import { useURLState } from './useURLState';

export function ConfiguratorPage() {
  const { assign, unAssign, configuration, error, loading } = useContext(
    ConfiguratorContext
  );
  const { currentPhase: phase, setCurrentPhase } = usePhasedConfigurator();
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);

  // const [conflict, setConflict] = useState<UIConflict>();

  if (error) {
    return <div>{error}</div>;
  }
  if ((loading && !configuration) || !configuration) {
    return <div>Loading…</div>;
  }
  const { sections = [], phases = [] } = configuration || {};

  const currentPhase = phases[phase];
  const hasPhases = utils.hasPhases(configuration);

  return (
    <>
      <IssuesBanner issues={configuration?.issues} />
      {hasPhases && currentPhase ? (
        <>
          <Section
            section={(currentPhase?.sections || [])[0]}
            onAssign={assign}
            onUnassign={unAssign}
            removedAssignments={configuration?.removedAssignments}
          />
          <div className="float-right">
            <Button
              variant="primary"
              disabled={!currentPhase.isComplete}
              onClick={() => setCurrentPhase(phase + 1)}
            >
              Next
            </Button>
          </div>
        </>
      ) : (
        <SideNav
          items={sections.map((section: SectionType) => {
            return section.name;
          })}
          onTabChange={(i) => setActiveTabIndex(i)}
          activeTabIndex={sections[activeTabIndex] ? activeTabIndex : 0}
        >
          <Section
            section={sections[activeTabIndex] || sections[0]}
            onAssign={assign}
            onUnassign={unAssign}
            removedAssignments={configuration?.removedAssignments}
          />
        </SideNav>
      )}
    </>
  );
}

export function ConfiguratorSummary() {
  const { configuration } = useContext(ConfiguratorContext);
  const { productInfo, packageInfo } = useContext(ProductSummaryContext);
  const { setCurrentPhase } = usePhasedConfigurator();

  if ((!productInfo && !packageInfo) || !configuration) {
    return null;
  }
  const hasPhases = utils.hasPhases(configuration);
  const completedPhases = utils.getCompletedPhases(configuration);

  return (
    <div className="flex items-center">
      {hasPhases ? (
        <List>
          {completedPhases.map((p, i) => (
            <PhasePreview phase={p} key={i} onEdit={() => setCurrentPhase(i)} />
          ))}
        </List>
      ) : null}
    </div>
  );
}

export function ConfiguratorActions() {
  const {
    reset,
    currentView,
    currentLanguage,
    setView,
    setLanguage,
  } = useContext(ConfiguratorContext);
  const { productInfo, packageInfo } = useContext(ProductSummaryContext);

  return (
    <List>
      <label>
        View
        <select
          className="input w-full"
          value={currentView}
          onChange={(e) => setView(e.target.value)}
        >
          <option value={NO_VIEW}>No View</option>
          {productInfo?.views?.map((v) => (
            <option value={v.id} key={v.id}>
              {v.id}
            </option>
          ))}
        </select>
      </label>
      <label>
        Language
        <select
          className="input w-full"
          value={currentLanguage}
          onChange={(e) => setLanguage(e.target.value)}
        >
          {packageInfo?.languages?.map((l) => (
            <option value={l.id} key={l.id}>
              {l.name} ({l.id})
            </option>
          ))}
        </select>
      </label>
      <Button onClick={() => reset()} variant="secondary" size="small">
        <ResetIcon width="1em" height="1em" />{' '}
        <span className="pl-2">Start over</span>
      </Button>
      {/* {packageInfo?.priceProcedures?.length ? (
        <Button to={`/${productInfo?.id}/prices`}>Prices</Button>
      ) : null}
      <Button to={`/${productInfo?.id}`} variant="primary">
        Details
      </Button> */}
    </List>
  );
}

type PhasedConfiguratorContextType = {
  currentPhase: number;
  setCurrentPhase: (phase: number) => void;
};

const PhasedConfiguratorContext = React.createContext<PhasedConfiguratorContextType>(
  {
    currentPhase: 0,
    setCurrentPhase: () => {},
  }
);

function usePhasedConfigurator() {
  return useContext(PhasedConfiguratorContext);
}

export function PhasedConfiguratorProvider(props: ConfiguratorProviderProps) {
  const [phase, setPhase] = useURLState('phase', 0, (p) => Number(p));

  const setPhaseCallback = useCallback((phase: number) => setPhase(phase), [
    setPhase,
  ]);

  return (
    <PhasedConfiguratorContext.Provider
      value={{ currentPhase: phase, setCurrentPhase: setPhaseCallback }}
    >
      <ConfiguratorProvider {...props} />
    </PhasedConfiguratorContext.Provider>
  );
}

//   // update the state when new sections with the
//   // result from the `/configure` API
//   const conflict = getConflict(
//     currentAssignment,
//     result.removedAssignments?.variableAssignments,
//     result
//   );
//   if (conflict) {
//     setConflict(conflict);
//   } else {
//     setConfiguration({
//       sections: result.sections,
//       removedAssignments: result.removedAssignments,
//       issues: result.issues,
//     });
//   }
// } catch (e) {
//   if (e.type === 'CannotLoadPackage') {
//     setError(`Product with id '${productId}' doesn't exist`);
//   } else {
//     throw e;
//   }

// /**
//  * Handle undoing a conflict.
//  *
//  * Sets conflict to null and removes current assignment from assignment list
//  */
// function handleRejectConflict() {
//   const currentAssignment = conflict?.currentAssignment;
//   if (!currentAssignment) {
//     return;
//   }
//   assignments.current = unassign(assignments.current, {
//     variable: { ...currentAssignment.variable },
//     value: currentAssignment?.value,
//   });
//   setConflict(undefined);
// }

// /**
//  * Handle acceptance of a conflict
//  *
//  * Removes the removed assignments from assignment list and adds `sections` from
//  * the conflicting result.
//  */
// function handleAcceptConflict() {
//   assignments.current = removeAssignments(
//     assignments.current,
//     conflict?.removedAssignments || []
//   );

//   setConflict(undefined);
//   setConfiguration(conflict?.nextResult);
// }
