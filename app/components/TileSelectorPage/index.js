import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

// this needs to be imported like this because on some bug
// on importing. I don't know if the issue is with babel
// or webpack.
import App from 'components/App';

import {
  Grid,
  Workspace,
} from 'components';

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
      <div className={styles.component} style={style} >
        <Workspace
          layers={layers}
        />
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
    zoom: state.app.zoom,
  })),
  App(),
)(component);
