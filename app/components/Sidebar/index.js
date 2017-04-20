import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import classnames from 'classnames';
import { withRouter } from 'react-router-dom'

import { memoize } from 'lodash';

import {
  selectTilesets,
  selectTile,
  selectLayer,
} from 'actions';

import {
  Button,
  Grid,
} from 'components';

import styles from './styles.css';

class component extends PureComponent {
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
      history,
    } = this.props;

    dispatch(selectTilesets(history));
  }

  _renderGrid(tileset, index) {
    const {
      rows,
      columns,
      src,
      name,
    } = tileset;

    const [
      data,
      grid,
    ] = _getGridData(tileset, rows, columns, index);

    const key = `${rows}_${columns}_${index}`

    return (
      <div key={key}>
        <h3>{ name }</h3>
        <Grid
          data={data}
          grid={grid}
          tileAction={selectTile}
          simpleTiles
        />
      </div>
    );
  }

  render() {
    const {
      name,
      tilesets,
      layers,
      selectedLayer,
    } = this.props;

    return (
      <div className={styles.component}>
        <h1>{ name }</h1>
        <div className="separator">
          {layers.map((layer, i) => {
            const classes = classnames('layer', {
              'selected': selectedLayer === i,
            });

            return (
              <div
                key={ layer.name }
                className={classes}
                onClick={() => this._handleSelectLayer(i)}
              >
                { layer.name }
              </div>
            )
          })}
        </div>
        <div className="tilesets separator">
          { tilesets.map(this._renderGrid) }
        </div>
        <div className="actions separator">
          <Button onClick={this._handleSelectTiles}>
            Add tilesets
          </Button>
        </div>
      </div>
    );
  }
}

const _getGridData = memoize(function(tileset, rows, columns, index) {
  return [
    [...Array(rows * columns)].map((_, i) => [index, i]),
    { rows, columns },
  ];
});

export default compose(
  connect(state => ({
    name: state.app.name,
    tilesets: state.app.tilesets,
    layers: state.app.layers,
    selectedLayer: state.app.selectedLayer,
    basepath: state.app.basepath,
  })),
  withRouter,
)(component);
