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
      dispatch,
      app: {
        tile,
      }
    } = this.props;

    dispatch(putDownTile({
      x: Math.floor(e.nativeEvent.offsetX / (tile.width + 1)),
      y: Math.floor(e.nativeEvent.offsetY / (tile.height + 1)),
    }));
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
      app: {
        grid,
        tile,
      },
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
