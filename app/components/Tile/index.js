import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import classnames from 'classnames';

import styles from './styles.css';

class component extends PureComponent {
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
      tile,
      tilesets,
      setIndex,
      tileIndex,
      grid,
      className,
    } = this.props;

    const style = {
      height: tile.height,
      width: tile.width,
    };

    const classes = classnames(styles.component, className);

    if (setIndex >= 0) {
      const tileset = tilesets[setIndex];

      const left = (tileIndex % tileset.columns) * tile.width;
      const top = Math.floor(tileIndex / tileset.columns) * tile.height;

      style['backgroundImage'] = `url('file://${tileset.src}')`;
      style['backgroundPosition'] = `-${left}px -${top}px`;
    }
    
    return (
      <div className={classes} style={style} onClick={this._dispatchAction} />
    )
  }
}

export default connect(
  (state) => ({
    tile: state.tile,
    tilesets: state.tilesets,
  }),
)(component);
