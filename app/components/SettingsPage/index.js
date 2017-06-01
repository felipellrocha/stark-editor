import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom'
import classnames from 'classnames';

import {
  Sidebar,
  InlineSVG,
  SelectorFooter,
} from 'components';

import {
  changeGameName,
  changeTileWidth,
  changeTileHeight,
  changeGridColumns,
  changeGridRows,
  changeMap,
} from 'actions';

import styles from './styles.css';

class component extends PureComponent {
  constructor(props) {
    super(props);

    this.goBack = this.goBack.bind(this);
    this.changeGameName = this.changeGameName.bind(this);
    this.changeTileWidth = this.changeTileWidth.bind(this);
    this.changeTileHeight = this.changeTileHeight.bind(this);
    this.selectMap = this.selectMap.bind(this);
  }

  selectMap(index) {
    const {
      dispatch,
    } = this.props;

    dispatch(changeMap(index));
  }

  goBack() {
    const {
      history,
    } = this.props;

    history.goBack();
  }

  changeGameName(e) {
    const {
      dispatch,
    } = this.props;

    dispatch(changeGameName(e.target.value));
  }

  changeTileWidth(e) {
    const {
      dispatch,
    } = this.props;

    dispatch(changeTileWidth(e.target.value));
  }

  changeTileHeight(e) {
    const {
      dispatch,
    } = this.props;

    dispatch(changeTileHeight(e.target.value));
  }

  render() {
    const {
      gameName,
      tile,
      grid,
      maps,
      selectedMap,
    } = this.props;

    return (
      <div>
        <Sidebar />
        <div className={styles.component} >
          <h3>
            <span>Settings</span>
            <InlineSVG className="close" icon="cross" onClick={this.goBack} />
          </h3>
          <div className="form">
            <div className="input">
              <label>Game Name</label>
              <input type="text" value={ gameName } onChange={this.changeGameName} />
            </div>
            <div className="input">
              <label>Tiles</label>
            </div>
            <div className="input-row">
              <div className="input">
                <label>Width</label>
                <input type="number" value={ tile.width } onChange={this.changeTileWidth} />
              </div>
              <div className="input">
                <label>Height</label>
                <input type="number" value={ tile.height } onChange={this.changeTileHeight} />
              </div>
            </div>
            <div className="input-row">
              <div className="input">
                <label>Maps</label>
              </div>
              <div className="input list">
                {maps.map((m, i) => {
                  const classes = classnames('map', {
                    'selected': selectedMap === i,
                  });

                  return (
                    <div key={m.id} className={classes} onClick={() => this.selectMap(i)}>
                      {m.name}
                    </div>
                  );
                })}
                <div className="map add">
                  <div>Add another map</div>
                  <InlineSVG icon="plus-circle" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default compose(
  connect(state => ({
    gameName: state.app.name,
    tile: state.app.tile,
    maps: state.app.maps,
    selectedMap: state.global.selectedMap,
  })),
  withRouter,
)(component);
