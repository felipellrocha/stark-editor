import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import {
  Grid,
  Workspace,
  Sidebar,
} from 'components';


import Footer from './Footer'

import {
  putDownTile,
} from 'actions';

import styles from './styles.css';

class component extends PureComponent {
  render() {
    const {
      grid,
      tile,
      data,
      layers,
      zoom,
    } = this.props;

    const style = {
      transform: `scale(${zoom})`,
    };

    return (
      <div>
        <Sidebar />
        <div className={styles.component} style={style} >
          <Workspace
            layers={layers}
          />
        </div>
        <Footer />
      </div>
    );
  }
}

export default compose(
  connect(state => ({
    grid: state.app.grid,
    tile: state.app.tile,
    data: state.app.data,
    layers: state.app.layers,
    zoom: state.global.zoom,
  })),
)(component);
