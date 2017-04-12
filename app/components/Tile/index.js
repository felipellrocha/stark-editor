import React, { Component } from 'react';
import { connect } from 'react-redux';

import styles from './styles.css';

class component extends Component {
  constructor(props) {
    super(props);

    this._dispatchAction = this._dispatchAction.bind(this);
  }

  _dispatchAction() {
    const {
      setIndex,
      tileIndex,
      x,
      y,
      dispatch,
    } = this.props;

    if (this.props.tileAction)
      dispatch(this.props.tileAction({
        setIndex,
        tileIndex,
        x,
        y,
      }));
  }

  render() {
    const {
      app: {
        tile,
        tilesets,
      },
      setIndex,
      tileIndex,
      grid,
    } = this.props;

    const style = {
      height: tile.height,
      width: tile.width,
    };

    if (setIndex >= 0) {
      const tileset = tilesets[setIndex];

      const left = (tileIndex % tileset.columns) * tile.width;
      const top = Math.floor(tileIndex / tileset.columns) * tile.height;

      style['backgroundImage'] = `url('file://${tileset.src}')`;
      style['backgroundPosition'] = `-${left}px -${top}px`;
    }
    
    return (
      <div className={styles.component} style={style} onClick={this._dispatchAction} />
    )
  }
}

export default connect(
  (state) => ({
    app: state,
  }),
)(component);
