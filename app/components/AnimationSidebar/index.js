import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import classnames from 'classnames';
import { withRouter } from 'react-router-dom'

import path from 'path';

import { memoize } from 'lodash';

import {
  selectSpriteSheets,
  addAnimation,
  selectAnimation,
  changeAnimationName,
  changeAnimationSpritesheet,
  changeAnimationFrameLength,
} from 'actions';

import {
  InlineSVG,
  Button,
  Dialog,
} from 'components';

import styles from './styles.css';

class AnimationSidebar extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      dialogIsOpen: false,
    };
  }

  toggleDialog() {
    this.setState(state => ({
      dialogIsOpen: !state.dialogIsOpen,
    }))
  }

  render() {
    const {
      sheets,
      animations,
      selectedAnimation,

      addAnimation,
      selectAnimation,
      changeAnimationName,
      changeAnimationSpritesheet,
      changeAnimationFrameLength,
    } = this.props;

    return (
      <div className={styles.component}>
        <h1>Animations</h1>
        <div className="animations separator">
          <h3>Animations</h3>
          {Object.keys(animations).map((key, i) => {
            const animation = animations[key];

            const classes = classnames('animation', {
              selected: selectedAnimation === key,
            });

            return (
              <div
                className={classes}
                key={animation.id}
                onClick={() => selectAnimation(key)}
              >
                <div>
                  <label>Name:</label>
                  <input
                    type="text"
                    value={key}
                    onChange={event => changeAnimationName(key, event.target.value)}
                  />
                </div>
                <div>
                  <label>Frame length:</label>
                  <input
                    type="number"
                    value={animation.numberOfFrames}
                    onChange={event => changeAnimationFrameLength(key, event.target.value)}
                  />
                </div>
                <div>
                  <label>Sheet:</label>
                  <select
                    type="select"
                    value={animation.spritesheet}
                    onChange={event => changeAnimationSpritesheet(key, event.target.value)}
                  >
                    {sheets.map((sheet, i) => {
                      return (<option key={sheet.src} value={i}>{sheet.name}</option>);
                    })}
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
        <div className="sheets">
        </div>
        <Dialog
          visible={this.state.dialogIsOpen}
          onContinue={addAnimation}
          onCancel={this.toggleDialog}
        >
          What is the name of the animation?
          <input type="text" autoFocus ref={input => { this.animationName = input; }} />
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  sheets: state.app.tilesets,
  animations: state.app.animations,
  selectedAnimation: state.global.selectedAnimation,
});

const mapDispatchToProps = (dispatch) => ({
  changeAnimationFrameLength: (name, value) => dispatch(changeAnimationFrameLength(name, value)),
  changeAnimationName: (name, value) => dispatch(changeAnimationName(name, value)),
  changeAnimationSpritesheet: (name, value) => dispatch(changeAnimationSpritesheet(name, value)),
  selectAnimation: (name) => dispatch(selectAnimation(name)),
  addAnimation: () => {
    const name = this.animationName.value;

    if (!name) return;

    dispatch(addAnimation(name));

    this.setState(state => ({
      dialogIsOpen: false,
    }))
    this.animationName.value = "";
  }
});


export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withRouter,
)(AnimationSidebar);
