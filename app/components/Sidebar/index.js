import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import {
  selectTilesets,
  selectTile,
  selectLayer,
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
    this._handleSelectLayer = this._handleSelectLayer.bind(this);
    this._renderGrid = this._renderGrid.bind(this);
  }

  _handleSelectLayer(layer) {
    const {
      dispatch,
    } = this.props;

    dispatch(selectLayer(layer));
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
        layers,
        selectedLayer,
      },
    } = this.props;

    return (
      <div className={styles.component}>
        <h1>{ name }</h1>
        <div className="separator">
          {layers.map((layer, i) => {
            const classes = classnames('layer', {
              'selected': selectedLayer === i,
            });

            if (layer.type !== 'base')
            return (
              <div className={classes} onClick={() => this._handleSelectLayer(i)}>{ layer.name }</div>
            )
          })}
        </div>
        <div className="tilesets separator">
          { tilesets.map(this._renderGrid) }
        </div>
        <div className="actions separator">
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
