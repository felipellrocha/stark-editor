import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import classnames from 'classnames';
import { withRouter } from 'react-router-dom'

import { memoize } from 'lodash';

import {
  selectSpriteSheets,
  addAnimation,
  selectAnimation,
  changeAnimationName,
  changeAnimationFrameLength,
} from 'actions';

import {
  InlineSVG,
  Button,
  Dialog,
} from 'components';

import styles from './styles.css';

class component extends PureComponent {
  constructor(props) {
    super(props);

    this.toggleDialog = this.toggleDialog.bind(this);
    this.addSpriteSheet = this.addSpriteSheet.bind(this);
    this.addAnimation = this.addAnimation.bind(this);
    this.selectAnimation = this.selectAnimation.bind(this);
    this.changeAnimationName = this.changeAnimationName.bind(this);
    this.changeAnimationFrameLength = this.changeAnimationFrameLength.bind(this);

    this.state = {
      dialogIsOpen: false,
    };
  }

  changeAnimationFrameLength(name, event) {
    event.stopPropagation();

    const {
      dispatch,
    } = this.props;

    const length = event.target.value;

    dispatch(changeAnimationFrameLength(name, length));
  }

  changeAnimationName(oldName, event) {
    event.stopPropagation();

    const {
      dispatch,
    } = this.props;

    const newName = event.target.value;

    dispatch(changeAnimationName(oldName, newName));
  }

  selectAnimation(name) {
    const {
      dispatch,
    } = this.props;

    dispatch(selectAnimation(name));
  }

  addSpriteSheet() {
    const {
      dispatch,
    } = this.props;

    dispatch(selectSpriteSheets());
  }

  toggleDialog() {
    this.setState(state => ({
      dialogIsOpen: !state.dialogIsOpen,
    }))
  }

  addAnimation() {
    const {
      dispatch,
    } = this.props;

    const name = this.animationName.value;

    if (!name) return;

    dispatch(addAnimation(name));

    this.setState(state => ({
      dialogIsOpen: false,
    }))
    this.animationName.value = "";
  }

  render() {
    const {
      sheets,
      animations,
      selectedAnimation,
    } = this.props;

    return (
      <div className={styles.component}>
        <h1>Animations</h1>
        <div className="sheets">
          <h3>Import Sprite sheets</h3>
          <Button onClick={this.addSpriteSheet}>
            Add sprite sheet
          </Button>
          {sheets.map(sheet => {
            return (
              <div>
                <img src={sheet} />
              </div>
            )
          })}
        </div>
        <div className="animations separator">
          {Object.keys(animations).map((key, i) => {
            const animation = animations[key];

            const classes = classnames('animation', {
              selected: selectedAnimation === key,
            });

            return (
              <div
                className={classes}
                key={animation.id}
                onClick={() => this.selectAnimation(key)}
              >
                <div>
                  <label>Name:</label>
                  <input
                    type="text"
                    value={key}
                    onChange={event => this.changeAnimationName(key, event)}
                  />
                </div>
                <div>
                  <label>Frame length:</label>
                  <input
                    type="number"
                    value={animation.numberOfFrames}
                    onChange={event => this.changeAnimationFrameLength(key, event)}
                  />
                </div>
                <div>
                  <label>Sheet:</label>
                  <select
                    type="select"
                  >
                    {sheets.map((sheet, i) => (<option value={i}>{sheet}</option>))}
                  </select>
                </div>
              </div>
            )
          })}
          <div className="animation add" onClick={this.toggleDialog}>
            <div>Add another animation</div>
            <InlineSVG icon="plus-circle" />
          </div>
        </div>
        <Dialog
          visible={this.state.dialogIsOpen}
          onContinue={this.addAnimation}
          onCancel={this.toggleDialog}
        >
          What is the name of the animation?
          <input type="text" ref={input => { this.animationName = input; }} />
        </Dialog>
      </div>
    );
  }
}

export default compose(
  connect(state => ({
    sheets: state.app.sheets,
    animations: state.app.animations,
    selectedAnimation: state.global.selectedAnimation,
  })),
  withRouter,
)(component);
