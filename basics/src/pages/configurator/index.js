﻿import React from 'react';
import { Section } from './components/Section';
import Page from '../../components/Page';
import Tabs from './components/Tabs';
import configure from '../../api/configure';
import { assign, unassign } from './utils/assignment-utils';
import './index.css';

/**
 * Example of how to use the `/configure` api to create an interactive
 * configurator.
 *
 * The `<Configurator>` component is the top level component of the interactive
 * configurator. It manages state and pushes state changes from the `/configure`
 * api down to sub component that renders the configuration result.
 *
 * The interactive configurator has the following structure.
 *
 * +--------------------------------------------------------------------------+
 * | Configurator                                                             |
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
 * | +------------------------------------------------------------------------
 *
 */
class Configurator extends React.Component {
  assignments = [];

  state = {
    activeTabIndex: 0
  };

  async componentDidMount() {
    this.configure();
  }

  handleActiveTabChange = activeTabIndex => this.setState({ activeTabIndex });

  /**
   * Called when ever the configuration needs to be recalculated.
   *
   * That includes:
   *  * When this component is mounted (to get initial configuration)
   *  * When users assign/unassign values in the configurator
   */
  configure = async assignments => {
    const { productId } = this.props.match.params;
    const packagePath = process.env.REACT_APP_PACKAGE_PATH;

    try {
      const result = await configure({
        packagePath,
        date: new Date(),
        line: {
          productId,
          variableAssignments: assignments
        }
      });

      // update the state when new sections with the result from the `/configure`
      // API
      this.setState({
        sections: result.sections,
        removedAssignments: result.removedAssignments,
        error: null
      });
    } catch (e) {
      if (e.type === 'CannotLoadPackage') {
        this.setState({
          error: `Product with id '${productId} doesn't exist in package with path '${packagePath}'`
        });
      }
    }
  };

  /**
   * Called when users make an assignment.
   *
   * Gets passed down to subcomponents link <Dropdown>
   */
  handleOnAssign = (variableId, value, exclude, multivalued) => {
    const newAssignments = assign(
      this.assignments,
      { variableId, value, exclude },
      multivalued
    );
    this.assignments = newAssignments;
    this.configure(newAssignments);
  };

  /**
   * Called when users make unassigns a value.
   *
   * Gets passed down to subcomponents link <Dropdown>
   */
  handleOnUnassign = (variableId, value, exclude) => {
    const newAssignments = unassign(this.assignments, {
      variableId,
      value,
      exclude
    });
    this.assignments = newAssignments;
    this.configure(newAssignments);
  };

  render() {
    const { productId } = this.props.match.params;
    if (!productId) {
      return (
        <Page>
          <div>
            <h2>Product id is missing</h2>
            <p>
              To start the configurator specify a product id in the URL, for
              example <a href="/configurator/IHEAR">/configurator/IHEAR</a>
            </p>
            <p>
              If you don't know any product id, use the{' '}
              <a href="/product-search">product search</a> to find one
            </p>
          </div>
        </Page>
      );
    }

    const { sections, removedAssignments, activeTabIndex, error } = this.state;
    if (error) {
      return <Page>{error}</Page>;
    }
    if (!sections) {
      return <Page>Loading…</Page>;
    }
    const activeSection = sections[activeTabIndex];
    return (
      <Page>
        <div className="configurator">
          <Tabs
            tabs={sections.map(section => section.name)}
            onTabChange={this.handleActiveTabChange}
            activeTabIndex={activeTabIndex}
          >
            {activeSection.sections.map(subsection => (
              <Section
                section={subsection}
                key={subsection.id}
                onAssign={this.handleOnAssign}
                onUnassign={this.handleOnUnassign}
                removedAssignments={removedAssignments}
              />
            ))}
            <Section
              section={{ variables: activeSection.variables }}
              onAssign={this.handleOnAssign}
              onUnassign={this.handleOnUnassign}
              removedAssignments={removedAssignments}
            />
          </Tabs>
        </div>
      </Page>
    );
  }
}

export default Configurator;
