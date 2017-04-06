import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  selectTilesets,
} from 'actions';

import styles from './styles.css';

class component extends Component {
  constructor(props) {
    super(props);

    this._handleSelectTiles = this._handleSelectTiles.bind(this);
  }

  _handleSelectTiles() {
    const {
      dispatch,
    } = this.props;

    dispatch(selectTilesets());
  }

  render() {
    const {
      app,
    } = this.props;

    return (
      <div className={styles.component}>
        { app.name }
        <button onClick={this._handleSelectTiles} />
      </div>
    );
  }
}

export default connect(
  (state) => ({
    app: state.app,
  }),
)(component);
