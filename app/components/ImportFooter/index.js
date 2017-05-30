import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import {
  Tile,
  InlineSVG,
  Button,
} from 'components';

import {
  writeFile,
  openFile,
  changeTerrain,
} from 'actions';

import styles from './styles.css';

class component extends PureComponent {
  constructor(props) {
    super(props);

    this._handleChangeTerrainType = this._handleChangeTerrainType.bind(this);
  }

  _handleChangeTerrainType(event) {
    const {
      dispatch,
    } = this.props;

    dispatch(changeTerrain(event.target.value));
  }

  render() {
    const {
      className,
      selectedTerrainType,
    } = this.props;

    const classes = classnames(styles.component, className);

    return (
      <div className={classes}>
        <div className="left">
          <div>Terrain type:
            <select value={selectedTerrainType} onChange={this._handleChangeTerrainType} >
              <option value='6-tile'>6 Type</option>
              <option value='4-tile'>4 Type</option>
            </select>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    selectedTerrainType: state.global.selectedTerrainType,
  }),
)(component);
