import React from 'react';
import { getConfiguration } from '../api';
import { assign, unassign, without } from '../api/assignment';
import * as store from '../api/store';
import { Section, Assignment, Value } from '../api/types';
import * as theme from '../components/theme';
import Selections from '../components/Selections';
import SectionConfigurator from './components/SectionConfigurator';
import { SettingsContext } from '../Settings';
import { RouteChildrenProps } from 'react-router';

interface ProductsPageProps extends RouteChildrenProps {
  sections: Section[];
  session: string;
}

type ProductPageState = {
  brochureModel?: Value;
  assignments?: Assignment[];
  activeSection: number;
  sections?: Section[];
};

export default class ProductsPage extends React.Component<
  ProductsPageProps,
  ProductPageState
> {
  static contextType = SettingsContext;

  contentElm: HTMLDivElement | undefined;

  constructor(props: ProductsPageProps) {
    super(props);
    this.contentElm = undefined;
    this.state = { activeSection: 0, assignments: [] };
  }

  async componentDidMount() {
    let session = store.get();
    if (!session) {
      session = this.saveSession();
    }

    const result = await getConfiguration(
      session.brochureModelId,
      session.assignments,
      this.context.packagePath
    );

    this.setState({
      assignments: session.assignments,
      activeSection: session.activeSection,
      sections: result.sections,
      brochureModel: result.brochureModel,
    });
  }

  saveSession = () => {
    const session = {
      assignments: this.state.assignments as Assignment[],
      brochureModelId: this.props.match.params['brochureModelId'],
      activeSection: this.state.activeSection,
    };
    store.put(session);
    return session;
  };

  handleAssign = async (
    assignment: Assignment,
    removedAssignments: Assignment[] = []
  ) => {
    let newAssignments = this.state.assignments || [];
    removedAssignments.forEach((ra) => {
      newAssignments = unassign(ra, newAssignments);
    });
    newAssignments = assign(assignment, newAssignments);
    this.configure(newAssignments);
  };

  handleUnassign = async (assignment: Assignment) => {
    const { assignments = [] } = this.state;
    const newAssignments = unassign(assignment, assignments);
    this.configure(newAssignments);
  };

  handelCheckRemovedAssignments = async (assignment: Assignment) => {
    const { assignments = [], brochureModel = { value: '' } } = this.state;
    const newAssignments = assign(assignment, assignments);

    const { removedAssignments } = await getConfiguration(
      brochureModel.value,
      newAssignments,
      this.context.packagePath
    );
    return removedAssignments;
  };

  configure = async (assignments: Assignment[]) => {
    const { brochureModel = { value: '' } } = this.state;

    const { sections, removedAssignments } = await getConfiguration(
      brochureModel.value,
      assignments,
      this.context.packagePath
    );

    const newAssignments = without(
      assignments,
      removedAssignments.map((ra) => ({
        variableId: ra.variable.id,
        variableName: ra.variable.name,
        valueId: ra.value.name,
        valueName: ra.value.name,
      }))
    );

    this.setState({ assignments: newAssignments, sections }, this.saveSession);
  };

  handlePrev = () => {
    const { activeSection } = this.state;
    this.setState({ activeSection: activeSection - 1 }, this.postNav);
  };

  handleNext = () => {
    const { activeSection, sections = [] } = this.state;
    if (activeSection >= sections.length - 1) {
      return this.props.history.push({ pathname: '/summary' });
    }
    this.setState({ activeSection: activeSection + 1 }, this.postNav);
  };

  postNav = () => {
    this.saveSession();

    if (this.contentElm) {
      this.contentElm.scrollTop = 0;
    }
  };

  render() {
    const { activeSection, brochureModel, sections } = this.state;

    if (!sections || !brochureModel) {
      return <div>Loading...</div>;
    }

    return (
      <div className="container">
        <div className="title">
          <h2>
            Configure <strong>your</strong> {brochureModel.name}
          </h2>
        </div>

        <div className="configurator">
          <div
            className="content"
            ref={(e) => (this.contentElm = e as HTMLDivElement)}
          >
            <div className="nav-and-content">
              <SectionConfigurator
                section={sections[activeSection]}
                onAssign={this.handleAssign}
                onUnassign={this.handleUnassign}
                onCheckRemovedAssignments={this.handelCheckRemovedAssignments}
                onPrev={this.handlePrev}
                prevSection={sections[activeSection - 1]}
                onNext={this.handleNext}
                nextSection={
                  sections[activeSection + 1] || { id: 'DONE', name: 'Done' }
                }
              />
            </div>
            <div className="all-selections">
              <Selections sections={sections} layout="small" />
            </div>
          </div>
        </div>
        <style jsx>{`
          .title {
            display: flex;
          }
          .title > h2 {
            flex: 1;
          }
          .container {
            display: flex;
            flex-direction: column;
          }
          .nav-and-content {
            flex: 1;
          }
          .configurator {
            display: flex;
            flex-direction: column;
            position: relative;
            padding: 10px 20px 20px 20px;
            box-shadow: ${theme.LIST_SHADOW};
            overflow: auto;
            height: calc(100vh-200px);
          }
          .configurator::after {
            content: ' ';
            display: block;
            position: absolute;
            right: 0;
            top: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
            opacity: 0.1;
            pointer-events: none;
            background-image: url(${process.env
              .PUBLIC_URL}/${brochureModel.value}.jpg);
            background-repeat: no-repeat;
            background-size: cover;
          }
          .content {
            flex: 10;
            display: flex;
            flex-direction: row;
          }
          .all-selections {
            z-index: 4;
          }
          header {
            z-index: 2;
          }

          @media screen and (max-width: 800px) {
            .all-selections {
              display: none;
            }
          }
        `}</style>
      </div>
    );
  }
}
