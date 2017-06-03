import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom'
import classnames from 'classnames';

import {
  EntitySidebar,
  Form,
} from 'components';

import {
  addEntity,
  receiveComponent,
  changeEntityName,
  changeComponentValue,
} from 'actions';

import styles from './styles.css';

// break this down onto its own file
class EntityComponent extends PureComponent {
  constructor(props) {
    super(props);

    this.componentChange = this.componentChange.bind(this);
    this.dragEnter = this.dragEnter.bind(this);
    this.dragLeave = this.dragLeave.bind(this);
    this.drop = this.drop.bind(this);

    this.state = {
      dragOver: false,
    };
  }

  dragOver(event) {
    event.preventDefault();

    event.dataTransfer.dropEffect = 'move';

    return false
  }
  
  dragEnter() {
    this.setState({dragOver: true})
  }

  dragLeave() {
    this.setState({dragOver: false})
  }

  drop(event) {
    const {
      receiveComponent,
    } = this.props;

    this.setState({dragOver: false})
    const component = JSON.parse(event.nativeEvent.dataTransfer.getData('text/plain'));
    receiveComponent(component);
  }

  componentChange(change, index) {
    const {
      id,
      dispatch,
      changeComponentValue,
    } = this.props;

    //console.log('change', id, change)
    changeComponentValue(index, change.index, change.value);
  }

  render() {
    const {
      id,
      entities,
      changeEntityName,
    } = this.props;

    const entity = entities[id];

    const classes = classnames('entity', {
      'over': this.state.dragOver,
    });

    return (
      <div
        key={id}
        className={classes}
        onDragOver={this.dragOver}
        onDragEnter={this.dragEnter}
        onDragLeave={this.dragLeave}
        onDrop={this.drop} 
      >
        <input
          className="name"
          value={ entity.name }
          onChange={changeEntityName}
        />
        <div className="components">
          {entity.components.map((component, i) => {
            return (
              <div key={component.name} className="component">
                <div className="name">{ component.name }</div>
                <Form
                  fields={component.members}
                  onChange={change => this.componentChange(change, i)}
                />
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

const Entity = connect(
  state => ({
    entities: state.app.entities,
  }),
  (dispatch, props) => ({
    changeEntityName: (event) => dispatch(changeEntityName(props.id, event.target.value)),
    receiveComponent: (component) => dispatch(receiveComponent(props.id, component)),
    changeComponentValue: (i, j, value) => dispatch(changeComponentValue(props.id, i, j, value)),
  })
)(EntityComponent);

class component extends PureComponent {
  render() {
    const {
      entities,
      addEntity,
    } = this.props;

    return (
      <div className={styles.component}>
        <EntitySidebar />
        <div className="main">
          {Object.keys(entities).map(id => {
            const entity = entities[id];
            return (<Entity key={id} id={id} />)
          })}
          <div className="entity add" onClick={addEntity}>
            Add a new entity
          </div>
        </div>
     </div>
    );
  }
}

export default compose(
  connect(
    state => ({
      entities: state.app.entities,
    }),
    dispatch => ({
      addEntity: () => dispatch(addEntity()),
    }),
  ),
  withRouter,
)(component);
