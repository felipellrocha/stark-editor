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
    this._executePutTile = this._executePutTile.bind(this);

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
    } = this.props;

    if (method === 'put') { 
      dispatch(putDownTile({
        x: Math.floor(x / (tile.width + 1)),
        y: Math.floor(y / (tile.height + 1)),
      }));
    } else {
      dispatch(paintTile({
        x: Math.floor(x / (tile.width + 1)),
        y: Math.floor(y / (tile.height + 1)),
      }));
    }
  }

  _executePutTile(x, y) {
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
      width: grid.columns * tile.width + (grid.columns - 1),
      height: grid.rows * tile.height + (grid.rows - 1),
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
          return (
            <Grid
              key={layer.name}
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

export default connect(
  (state) => ({
    grid: state.grid,
    tile: state.tile,
    method: state.selectedAction,
  }),
)(component);
