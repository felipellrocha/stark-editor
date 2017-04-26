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

    this._handleWrite = this._handleWrite.bind(this);
    this._handleOpen = this._handleOpen.bind(this);
    this._handleChangeTerrainType = this._handleChangeTerrainType.bind(this);
  }

  _handleOpen() {
    const {
      dispatch,
    } = this.props;

    dispatch(openFile());
  }

  _handleChangeTerrainType(event) {
    const {
      dispatch,
    } = this.props;

    dispatch(changeTerrain(event.target.value));
  }

  _handleWrite() {
    const {
      dispatch,
    } = this.props;

    dispatch(writeFile());
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
        <div className="right">
          <Button onClick={this._handleOpen} className={styles.button}>
            <InlineSVG className={styles.buttonIcon} icon="upload" /> Open
          </Button>
          <Button onClick={this._handleWrite} className={styles.button}>
            <InlineSVG className={styles.buttonIcon} icon="download" /> Save
          </Button>
          <Button className={styles.button}>
            <InlineSVG className={styles.buttonIcon} icon="cog" />
          </Button>
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
