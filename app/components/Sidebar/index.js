import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  selectTilesets,
  selectTile,
} from 'actions';

import {
  Button,
  Grid,
  Tile,
} from 'components';

import styles from './styles.css';

class component extends Component {
  constructor(props) {
    super(props);

    this._handleSelectTiles = this._handleSelectTiles.bind(this);
    this._renderGrid = this._renderGrid.bind(this);
  }

  _handleSelectTiles() {
    const {
      dispatch,
    } = this.props;

    dispatch(selectTilesets());
  }

  _renderGrid(tileset, index) {
    const {
      rows,
      columns,
      src,
    } = tileset;

    const data = [...Array(rows * columns)].map((_, i) => [index, i])

    return (
      <div>
        <h3>{ src }</h3>
        <Grid
          data={data}
          grid={{ rows:rows, columns:columns }}
          tileAction={selectTile}
        />
      </div>
    );
  }

  render() {
    const {
      app: {
        name,
        tilesets,
        selectedTile: [
          setIndex,
          tileIndex,
        ],
      },
    } = this.props;

    return (
      <div className={styles.component}>
        <h1>{ name }</h1>
        <div className="tilesets">
          { tilesets.map(this._renderGrid) }
        </div>
        <div className="actions">
          <Tile setIndex={setIndex} tileIndex={tileIndex} />
          <Button
            label="Add tilesets"
            onClick={this._handleSelectTiles}
          />
        </div>
      </div>
    );
  }
}

export default connect(
  (state) => ({
    app: state.app,
  }),
)(component);
