import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import classnames from 'classnames';
import styles from './styles.css';

import {
  Tile,
} from 'components';

class component extends PureComponent {
  render() {
    const {
      tile,
      tilesets,
      grid,
      data,
      className,
      simpleTiles,
    } = this.props;

    const rows = [...Array(grid.rows)]

    const classes = classnames(styles.component, className);

    return (
      <div
        className={classes}
        style={{width: grid.columns * tile.width + grid.columns}}
      >
        {rows.map((_, y) => {
          const columns = [...Array(grid.columns)]

          return (
            <div className="row" key={y}>
              {columns.map((_, x) => {
                const [ setIndex, tileIndex ] = data[y * grid.columns + x];
                
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

export default connect(
  (state) => ({
    tile: state.app.tile,
    tilesets: state.app.tilesets,
  }),
)(component);
