import React, { Component } from 'react';
import { connect } from 'react-redux';

import styles from './styles.css';

import {
  Tile,
} from 'components';

class component extends Component {
  render() {
    const {
      app: {
        tile,
        tilesets,
      },
      grid,
      data,
    } = this.props;

    const rows = [...Array(grid.rows)].map((_, i) => {
      return data.slice(i * grid.columns, i * grid.columns + (grid.columns));
    });

    return (
      <div
        className={styles.component}
        style={{width: grid.columns * tile.width + (grid.columns - 1)}}
      >
        {rows.map((columns, y) => {

          return (
            <div className="row">
              {columns.map((column, x) => {
                const [ setIndex, tileIndex ] = column;
                
                return (
                  <Tile
                    setIndex={setIndex}
                    tileIndex={tileIndex}
                    grid={grid}
                    tileAction={this.props.tileAction}
                    x={x}
                    y={y}
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
    app: state.app,
  }),
)(component);
