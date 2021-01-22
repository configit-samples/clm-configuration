import React from 'react';
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
} from './utils/assignment-utils';
import './index.css';
import { getConflict } from './utils/variable-utils';
import ConflictDialog from './components/ConflictDialog';
import Toolbar, { ToobarButton } from '../../components/Toolbar';
import { Reset } from '../../components/Icons';
import { globalArguments } from '../../globalArguments';

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
class Configurator extends React.Component {
  assignments = [];

  quantity = { value: 1, unit: 'EA' };

  state = {
    activeTabIndex: 0,
  };

  componentDidMount() {
    this.configure(this.quantity);
  }

  handleActiveTabChange = (activeTabIndex) => this.setState({ activeTabIndex });

  /**
   * Called when the configuration needs to be recalculated.
   *
   *  * When this component is mounted (to get initial configuration)
   *  * When users assign/unassign values in the configurator
   */
  configure = async (quantity, assignments = [], currentAssignment = null) => {
    const { productId } = this.props.match.params;
    if (!productId) {
      return;
    }
    const packagePath = process.env.REACT_APP_PACKAGE_PATH;

    try {
      const result = await configureAPI({
        packagePath,
        date: new Date(),
        language: 'system',
        globalArguments,
        line: {
          quantity,
          productId,
          variableAssignments: assignments.map((a) => ({
            variableId: a.variable.id,
            value: a.value.value,
            exclude: a.value.exclude,
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
        result.removedAssignments.variableAssignments
      );
      if (conflict) {
        this.setState({ conflict, nextResult: result, error: null });
      } else {
        this.setState({
          sections: result.sections,
          removedAssignments: result.removedAssignments,
          issues: result.issues,
          error: null,
        });
      }
    } catch (e) {
      if (e.type === 'CannotLoadPackage') {
        this.setState({
          error:
            `Product with id '${productId}' doesn't exist ` +
            `in package with path '${packagePath}'`,
        });
      } else {
        throw e;
      }
    }
  };

  /**
   * Called when users make an assignment.
   *
   * Gets passed down to subcomponents like <Dropdown>
   */
  handleOnAssign = (variable, value) => {
    const currentAssignment = toAssignment(variable, value);
    const newAssignments = assign(this.assignments, currentAssignment);
    this.assignments = newAssignments;
    this.configure(this.quantity, newAssignments, currentAssignment);
  };

  /**
   * Called when users make unassigns a value.
   *
   * Gets passed down to subcomponents like <Dropdown>
   */
  handleOnUnassign = (variable, value) => {
    const currentAssignment = toAssignment(variable, value);
    const newAssignments = unassign(this.assignments, currentAssignment);
    this.assignments = newAssignments;
    this.configure(this.quantity, newAssignments);
  };

  handleReset = () => {
    this.assignments = reset();
    this.configure(this.quantity, this.assignments);
  };

  /**
   * Handle undoing a conflict.
   *
   * Sets conflict to null and removes current assignment from assignment list
   */
  handleRejectConflict = () => {
    const { currentAssignment } = this.state.conflict;
    this.assignments = unassign(this.assignments, currentAssignment);

    this.setState({ conflict: null });
  };

  /**
   * Handle acceptance of a conflict
   *
   * Removes the removed assignments from assignment list and adds `sections` from
   * the conflicting result.
   */
  handleAcceptConflict = () => {
    this.assignments = removeAssignments(
      this.assignments,
      this.state.conflict.removedAssignments
    );

    this.setState({
      conflict: undefined,
      sections: this.state.nextResult.sections,
      nextResult: null,
    });
  };

  handleQuantityChange = (quantity) => {
    this.quantity = quantity;
    this.configure();
  };

  render() {
    const { productId } = this.props.match.params;

    const {
      sections,
      removedAssignments,
      conflict,
      activeTabIndex,
      error,
      issues,
    } = this.state;

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
            <ToobarButton onClick={this.handleReset}>
              <Reset width="18px" height="18px" />
            </ToobarButton>
          </Toolbar>
          <Tabs
            tabs={sections.map((section) => section.name)}
            onTabChange={this.handleActiveTabChange}
            activeTabIndex={activeTabIndex}
          >
            <Section
              section={activeSection}
              onAssign={this.handleOnAssign}
              onUnassign={this.handleOnUnassign}
              removedAssignments={removedAssignments}
            />
          </Tabs>
        </div>
        <ConflictDialog
          conflict={conflict}
          onAccept={this.handleAcceptConflict}
          onReject={this.handleRejectConflict}
        />
      </Page>
    );
  }
}

export default Configurator;
