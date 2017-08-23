import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import styles from './styles.css';

import {
  Grid,
} from 'components';

import {
  putDownTile,
  paintTile,
} from 'actions';

class component extends PureComponent {
  constructor(props) {
    super(props);

    this._handlePutTile = this._handlePutTile.bind(this);

    this._handleMouseDown = this._handleMouseDown.bind(this);
    this._handleMouseUp = this._handleMouseUp.bind(this);

    this.state = {
      mouseDown: false,
    }
  }

  _handlePutTile(e) {
    if (!this.state.mouseDown && e.type !== 'click') { return }

    const {
      offsetX: x,
      offsetY: y,
    } = e.nativeEvent;

    const {
      dispatch,
      tile,
      method,
      selectedLayer,
      selectedTile,
    } = this.props;

    const xy = {
      x: Math.floor(x / tile.width),
      y: Math.floor(y / tile.height),
    };

    if (method === 'put') dispatch(putDownTile(xy));
    else dispatch(paintTile(xy, selectedLayer, selectedTile));
  }

  _handleMouseDown() {
    this.setState({
      mouseDown: true,
    });
  }

  _handleMouseUp() {
    this.setState({
      mouseDown: false,
    });
  }

  render() {
    const {
      grid,
      tile,
      data,
      layers,
      tileAction,
    } = this.props;

    const style = {
      width: grid.columns * tile.width,
      height: grid.rows * tile.height,
    }

    return (
      <div
        className={styles.component}
        onClick={this._handlePutTile}
        onMouseMove={this._handlePutTile}
        onMouseDown={this._handleMouseDown}
        onMouseUp={this._handleMouseUp}
        style={style}
      > 
        {layers.map(layer => {
          if (layer.visible)
          return (
            <Grid
              key={layer.name}
              grid={grid}
              data={layer.data}
              className={styles.stack}
              togglableGrid
            />
          )
        })}
      </div>
    );
  }
}

export default connect(
  (state) => ({
    grid: state.tilemap.grid,
    tile: state.app.tile,
    selectedLayer: state.global.selectedLayer,
    selectedTile: state.global.selectedTile,
    method: state.global.selectedAction,
  }),
)(component);
