import React, { Component } from 'react';
import { connect } from 'react-redux';

import styles from './styles.css';

import {
  Grid,
} from 'components';

import {
  putDownTile,
} from 'actions';

class component extends Component {
  constructor(props) {
    super(props);

    this._handleHover = this._handleHover.bind(this);
  }

  _handleHover(e) {
    const {
      dispatch,
      app: {
        tile,
      }
    } = this.props;

    dispatch(putDownTile({
      x: Math.floor(e.nativeEvent.offsetX / tile.width),
      y: Math.floor(e.nativeEvent.offsetY / tile.height),
    }));
  }

  render() {
    const {
      app: {
        grid,
        tile,
      },
      data,
      layers,
      tileAction,
    } = this.props;

    const style = {
      width: grid.columns * tile.width + tile.width,
      height: grid.rows * tile.height + tile.height,
    }

    return (
      <div
        className={styles.component}
        onClick={this._handleHover}
        onDrag={this._handleHover}
        style={style}
      > 
        {layers.map(layer => {
          return (
            <Grid
              grid={grid}
              data={layer.data}
              className={styles.stack}
            />
          )
        })}
      </div>
    );
  }
}

          //<Grid grid={grid} data={data} tileAction={} />

export default connect(
  (state) => ({
    app: state.app,
  }),
)(component);
