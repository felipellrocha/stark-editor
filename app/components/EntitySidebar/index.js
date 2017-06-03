import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import classnames from 'classnames';
import { withRouter } from 'react-router-dom'

import { memoize } from 'lodash';

import {
  loadComponents,
} from 'actions';

import {
  Button,
} from 'components';

import styles from './styles.css';

class component extends PureComponent {
  constructor(props) {
    super(props);

    this.loadComponents = this.loadComponents.bind(this);
  }

  loadComponents() {
    const {
      dispatch,
    } = this.props;

    dispatch(loadComponents());
  }

  render() {
    const {
      components,
    } = this.props;

    return (
      <div className={styles.component}>
        <h1>Entities</h1>
        <Button onClick={this.loadComponents}>Load Component file</Button>
        <div className="components">
          {components.map(component => {
            return (
              <div
                className="component"
                key={component.name}
                onDragStart={event => {
                  event.dataTransfer.setData('text/plain', JSON.stringify(component));
                }}
                draggable
              >
                {component.name}
                {component.members.length > 0 &&
                  <div className="members">
                    {component.members.map(member => {
                      return (
                        <div className="member" key={ member.name }>
                          <strong>{ member.type }</strong>: { member.name }
                        </div>
                      )
                    })}
                  </div>
                }
              </div>
            )
          })}
        </div>
      </div>
    );
  }
}

export default compose(
  connect(state => ({
    components: state.global.components,
  })),
  withRouter,
)(component);
