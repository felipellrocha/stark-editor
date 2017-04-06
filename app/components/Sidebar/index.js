import React, { Component } from 'react';
import { connect } from 'react-redux';
import { nativeImage } from 'electron';

import {
  selectTilesets,
} from 'actions';

import {
  Button,
  Grid,
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
      app: {
        tile,
      }
    } = this.props;

    const image = nativeImage.createFromPath(tileset);
    const size = image.getSize();

    const rows = size.height / tile.height;
    const columns = size.width / tile.width;

    const data = [...Array(rows * columns)].map((_, i) => [index, i])

    return (
      <div>
        <Grid data={data} grid={{ rows:rows, columns:columns }} />
      </div>
    );
  }

  render() {
    const {
      app: {
        name,
        tilesets,
      },
    } = this.props;

    return (
      <div className={styles.component}>
        <h1>{ name }</h1>
        <div className="tilesets">
          { tilesets.map(this._renderGrid) }
        </div>
        <div className="actions">
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
