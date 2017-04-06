import React, { Component } from 'react';
import { connect } from 'react-redux';

import styles from './styles.css';

class component extends Component {
  render() {
    const {
      app: {
        grid,
        tile,
      }
    } = this.props;

    const rows = [...Array(grid.rows)];

    return (
      <div
        className={styles.component}
        style={{width: grid.columns * tile.width + (grid.columns - 1)}}
      >
        {rows.map(row => {
          const columns = [...Array(grid.columns)];

          return (
            <div className="row">
              {columns.map(column => {
                return (
                  <div
                    className="tile"
                    style={{height: tile.height, width: tile.width}}
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
