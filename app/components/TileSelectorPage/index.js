import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import {
  App,
  Grid,
  Workspace,
} from 'components';

import {
  putDownTile,
} from 'actions';

import styles from './styles.css';

class component extends Component {
  render() {
    console.log(typeof App, typeof Workspace);
    const {
      app: {
        grid,
        tile,
        data,
        layers
      },
    } = this.props;

    return (
      <div className={styles.component} >
        <Workspace
          layers={layers}
        />
      </div>
    );
  }
}

console.log(typeof Workspace);
console.log(typeof App);
console.log(typeof connect);

/*
export default compose(
  App(),
  connect(state => ({ app: state })),
)(component);
*/
export default connect(state => ({ app: state}))(component)
