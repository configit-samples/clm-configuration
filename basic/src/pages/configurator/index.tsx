import React, { useEffect, useRef, useState } from 'react';
import { Section } from './components/Section';
import Page from '../../components/Page';
import Tabs from '../../components/Tabs';
import InvalidMark from './components/InvalidMark';
import configureAPI from '../../api/configure';
import {
  assign,
  unassign,
  removeAssignments,
  toAssignment,
  reset,
  UIAssignment,
  UIConflict,
} from '../../api/utils/assignment-utils';
import './index.css';
import { getConflict } from '../../api/utils/variable-utils';
import ConflictDialog from './components/ConflictDialog';
import Toolbar, { ToobarButton } from '../../components/Toolbar';
import { Reset } from '../../components/Icons';
import { globalArguments } from '../../globalArguments';
import {
  ConfigurationVariable,
  ConfigureResponse,
  SingletonValue,
  ValueWithUnit,
} from '../../api/types/configurator';
import { useParams } from 'react-router';

/**
 * Component shown if product Id is missing from URL.
 */
function NoProductIdPage() {
  return (
    <Page>
      <div className="no-product-id-page">
        <h2>Product id is missing</h2>
        <p>
          To start the configurator specify a product id in the URL, for example{' '}
          <a href="/configurator/IHEAR">/configurator/IHEAR</a>
        </p>
        <p>
          If you don't know any product id, use the{' '}
          <a href="/product-search">product search</a> to find one
        </p>
      </div>
    </Page>
  );
}

/**
 * Example of how to use the `/configure` endpoint to create an interactive
 * configurator.
 *
 * The `<Configurator>` component is the top level component of the interactive
 * configurator. It manages state and pushes state changes from the `/configure`
 * endpoint down to sub component that renders the configuration result.
 *
 * The interactive configurator has the following structure.
 *
 * +--------------------------------------------------------------------------+
 * | Configurator                                                             |
 * | +----------------------------------------------------------------------+ |
 * | | Toolbar                                                              | |
 * | +----------------------------------------------------------------------+ |
 * | +----------------------------------------------------------------------+ |
 * | | Tabs                                                                 | |
 * | +----------------------------------------------------------------------+ |
 * | +----------------------------------------------------------------------+ |
 * | | Section                                                              | |
 * | | +------------------------------------------------------------------+ | |
 * | | | VariableLine+                                                    | | |
 * | | | +--------------------------------------------------------------+ | | |
 * | | | | VariableInput                                                | | | |
 * | | | | (Dropdown | TextInput | MultivaluedInput)                    | | | |
 * | | | +--------------------------------------------------------------+ | | |
 * | | +------------------------------------------------------------------+ | |
 * | +----------------------------------------------------------------------+ |
 * +--------------------------------------------------------------------------+
 */
function Configurator() {
  const assignments = useRef<UIAssignment[]>([]);
  const quantity = useRef<ValueWithUnit>({ value: 1, unit: 'EA' });
  const { productId } = useParams<{ productId: string }>();

  const [error, setError] = useState('');
  const [configuration, setConfiguration] = useState<ConfigureResponse>();
  const [conflict, setConflict] = useState<UIConflict>();
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);

  useEffect(() => {
    callConfigure(quantity.current, assignments.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /**

  handleActiveTabChange = (activeTabIndex) => this.setState({ activeTabIndex });

  /**
   * Called when the configuration needs to be recalculated.
   *
   *  * When this component is mounted (to get initial configuration)
   *  * When users assign/unassign values in the configurator
   */
  async function callConfigure(
    quantity: ValueWithUnit,
    assignments: UIAssignment[] = [],
    currentAssignment?: UIAssignment
  ) {
    try {
      const result = await configureAPI({
        date: new Date().toISOString(),
        language: 'system',
        globalArguments,
        line: {
          quantity,
          productId,
          variableAssignments: assignments.map((a) => ({
            variableId: a.variable?.id,
            value: a.value?.value,
            exclude: !!a.value?.excluded,
          })),
        },
        settings: {
          phaseBehavior: 'InSections',
        },
      });

      // update the state when new sections with the
      // result from the `/configure` API
      const conflict = getConflict(
        currentAssignment,
        result.removedAssignments?.variableAssignments,
        result
      );
      if (conflict) {
        setConflict(conflict);
      } else {
        setConfiguration({
          sections: result.sections,
          removedAssignments: result.removedAssignments,
          issues: result.issues,
        });
      }
    } catch (e) {
      if (e.type === 'CannotLoadPackage') {
        setError(`Product with id '${productId}' doesn't exist`);
      } else {
        throw e;
      }
    }
  }

  /**
   * Called when users make an assignment.
   *
   * Gets passed down to sub-components like <Dropdown>
   */
  function handleOnAssign(
    variable: ConfigurationVariable,
    value: SingletonValue
  ) {
    const currentAssignment = toAssignment(variable, value);
    const newAssignments = assign(assignments.current, currentAssignment);
    assignments.current = newAssignments;
    callConfigure(quantity.current, newAssignments, currentAssignment);
  }

  /**
   * Called when users make unassigns a value.
   *
   * Gets passed down to subcomponents like <Dropdown>
   */
  function handleOnUnassign(
    variable: ConfigurationVariable,
    value?: SingletonValue
  ) {
    const currentAssignment = toAssignment(variable, value);
    const newAssignments = unassign(assignments.current, currentAssignment);
    assignments.current = newAssignments;
    callConfigure(quantity.current, newAssignments);
  }

  function handleReset() {
    assignments.current = reset();
    callConfigure(quantity.current, assignments.current);
  }

  /**
   * Handle undoing a conflict.
   *
   * Sets conflict to null and removes current assignment from assignment list
   */
  function handleRejectConflict() {
    const currentAssignment = conflict?.currentAssignment;
    if (!currentAssignment) {
      return;
    }
    assignments.current = unassign(assignments.current, {
      variable: { ...currentAssignment.variable },
      value: currentAssignment?.value,
    });
    setConflict(undefined);
  }

  /**
   * Handle acceptance of a conflict
   *
   * Removes the removed assignments from assignment list and adds `sections` from
   * the conflicting result.
   */
  function handleAcceptConflict() {
    assignments.current = removeAssignments(
      assignments.current,
      conflict?.removedAssignments || []
    );

    setConflict(undefined);
    setConfiguration(conflict?.nextResult);
  }

  const { sections, removedAssignments, issues } = configuration || {};

  if (!productId) {
    return <NoProductIdPage />;
  }
  if (error) {
    return <Page>{error}</Page>;
  }
  if (!sections) {
    return <Page>Loading…</Page>;
  }
  const activeSection = sections[activeTabIndex];

  return (
    <Page variant="transparent">
      <div className="configurator">
        <Toolbar>
          <InvalidMark issues={issues} />
          <ToobarButton onClick={handleReset}>
            <Reset width="18px" height="18px" />
          </ToobarButton>
        </Toolbar>
        <Tabs
          tabs={sections.map((section) => section.name)}
          onTabChange={(i) => setActiveTabIndex(i)}
          activeTabIndex={activeTabIndex}
        >
          <Section
            section={activeSection}
            onAssign={handleOnAssign}
            onUnassign={handleOnUnassign}
            removedAssignments={removedAssignments}
          />
        </Tabs>
      </div>
      <ConflictDialog
        conflict={conflict}
        onAccept={handleAcceptConflict}
        onReject={handleRejectConflict}
      />
    </Page>
  );
}

export default Configurator;
