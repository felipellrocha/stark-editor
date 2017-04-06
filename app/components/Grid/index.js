import React, { Component } from 'react';
import { connect } from 'react-redux';

import styles from './styles.css';

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
      return data.slice(i * grid.columns, i * grid.columns + (grid.columns - 1));
    });

    return (
      <div
        className={styles.component}
        style={{width: grid.columns * tile.width + (grid.columns - 1)}}
      >
        {rows.map(columns => {

          return (
            <div className="row">
              {columns.map(column => {

                const [ setIndex, tileIndex ] = column;

                const style = {
                  height: tile.height,
                  width: tile.width,
                };

                const tileset = tilesets[setIndex];

                if (tileset) {
                  const left = (tileIndex % grid.columns) * tile.width;
                  const top = Math.floor(tileIndex / grid.columns) * tile.height;

                  style['backgroundImage'] = `url('file://${tileset}')`;
                  style['backgroundPosition'] = `-${left}px -${top}px`;
                }
                
                return (
                  <div className="tile" style={style} />
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
