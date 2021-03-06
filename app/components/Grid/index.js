import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import classnames from 'classnames';
import styles from './styles.css';

import { memoize } from 'lodash';

import {
  IndexToXY,
  XYToIndex,
} from 'utils';

import {
  Tile,
} from 'components';

function noop () { }

class Grid extends PureComponent {
  constructor(props) {
    super(props);

    this.putTile = this.putTile.bind(this);

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);

    this.state = {
      mouseDown: false,
    }
  }

  putTile(e) {
    if (!this.state.mouseDown && e.type !== 'click') { return }

    this.props.onMouseMove(e);

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
      actionMethod,
    } = this.props;

    const xy = {
      x: Math.floor(x / tile.width),
      y: Math.floor(y / tile.height),
    };

    if (actionMethod) dispatch(actionMethod(xy));
  }

  onMouseDown(e) {
    this.setState({
      mouseDown: true,
    });

    this.props.onMouseDown(e);
  }

  onMouseUp(e) {
    this.setState({
      mouseDown: false,
    });

    this.props.onMouseUp(e);
  }

  render() {
    const {
      tile,
      tilesets,
      grid,
      data,
      className,
      simpleTiles,
      selectedShape,
      selectedTile,
    } = this.props;

    const rows = [...Array(grid.rows)]

    const classes = classnames(styles.component, className);
    const selectedIndexes = getSelectedIndexes(selectedShape, selectedTile, grid);

    return (
      <div
        className={classes}
        style={{width: grid.columns * tile.width}}

        onMouseMove={this.putTile}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
      >
        {rows.map((_, y) => {
          const columns = [...Array(grid.columns)]

          return (
            <div className="row" key={y}>
              {columns.map((_, x) => {
                const cell = data[y * grid.columns + x];

                if (!cell) return null;

                const [ setIndex, tileIndex ] = cell;
                
                return (
                  <Tile
                    key={`${x}_${y}`}
                    setIndex={setIndex}
                    tileIndex={tileIndex}
                    grid={grid}
                    tileAction={this.props.tileAction}
                    x={x}
                    y={y}
                    simpleTile={simpleTiles}
                    data={data}
                    selected={selectedIndexes[tileIndex]}
                    togglableGrid={this.props.togglableGrid}
                    workspaceGrid={this.props.workspace}
                  />
                )
              })}
            </div>
          )
        })}
      </div>
    );
  }
}

Grid.defaultProps = {
  actionMethod: noop,
  onMouseUp: noop,
  onMouseDown: noop,
  onMouseMove: noop,
};

const getSelectedIndexes = function(selectedShape, selectedTile, grid) {
  if (!selectedShape || !selectedTile) return {};

  const count = selectedShape.columns * selectedShape.rows;

  const [x, y] = IndexToXY(selectedTile[1], grid);

  return [...Array(count)].reduce((prev, _, i) => {
    const [x_1, y_1] = IndexToXY(i, selectedShape);

    const x_p = x + x_1;
    const y_p = y + y_1;

    const index = XYToIndex(x_p, y_p, grid);

    prev[index] = true;

    return prev;
  }, {});
};

export default connect(
  (state, props) => {
    const data = {
      tile: state.app.tile,
      tilesets: state.app.tilesets,
    };

    return (props.selectorGrid) ?
      Object.assign({}, data, {
        selectedTile: state.global.selectedTile,
        selectedShape: state.global.selectedShape,
      }) : data;
  },
)(Grid);
