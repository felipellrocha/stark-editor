import React, { PureComponent } from 'react';
import path from 'path';

import { connect } from 'react-redux';
import { compose } from 'recompose';

import {
  InlineSVG,
  Footer,
} from 'components';

import {
  changeTilesetName,
  changeTilesetType,
} from 'actions';

import styles from './styles.css';
import footerStyles from 'components/Footer/styles.css';

class component extends PureComponent {
  constructor(props) {
    super(props);

    this._handleGoBack = this._handleGoBack.bind(this);
    this._handleChangeTilesetName = this._handleChangeTilesetName.bind(this);
    this._handleChangeTilesetType = this._handleChangeTilesetType.bind(this);
  }

  _handleGoBack() {
    const {
      history,
    } = this.props;

    history.goBack();
  }

  _handleChangeTilesetName(event, index) {
    const {
      dispatch,
    } = this.props;

    dispatch(changeTilesetName(index, event.target.value));
  }

  _handleChangeTilesetType(event, index) {
    const {
      dispatch,
    } = this.props;

    dispatch(changeTilesetType(index, event.target.value));
  }

  render() {
    const {
      tilesets,
      basepath,
    } = this.props;

    return (
      <div className={styles.component}>
        <h3>
          <span>Tileset Manager</span>
          <InlineSVG className="close" icon="cross" onClick={this._handleGoBack} />
        </h3>
        {tilesets.map((tileset, i) => {
          const src = path.resolve(basepath, tileset.src)

          return (
            <div className='card'>
              <div className="left">
                <img src={src} />
              </div>
              <div className="right">
                <div>Path: <strong>{tileset.src}</strong></div>
                <div>Dimensions: <strong>{tileset.columns} x {tileset.rows}</strong></div>
                <div className="divider" />
                <div>Name: <input type="text" value={tileset.name} onChange={event => this._handleChangeTilesetName(event, i)} /></div>
                <div>Type:
                  <select value={tileset.type} onChange={event => this._handleChangeTilesetType(event, i)} >
                    <option value='tile'>Tile</option>
                    <option value='aware'>Aware</option>
                  </select>
                </div>
              </div>
            </div>
          );
        })}
        <Footer className={footerStyles.fullLength} />
      </div>
    );
  }
}

export default compose(
  connect(state => ({
    tilesets: state.app.tilesets,
    basepath: state.global.basepath,
  })),
)(component);
