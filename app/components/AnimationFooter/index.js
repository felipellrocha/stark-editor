import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom'

import {
  InlineSVG,
  Button,
  Dialog,
} from 'components';

import {
  selectFrame,
  deleteKeyframe,
} from 'actions';

import styles from './styles.css';
import button from 'components/Button/styles.css';

class component extends PureComponent {
  constructor(props) {
    super(props);

    this.selectFrame = this.selectFrame.bind(this);
    this.toggleAnimation = this.toggleAnimation.bind(this);
    this.toggleContextMenu = this.toggleContextMenu.bind(this);
    this.deleteKeyframe = this.deleteKeyframe.bind(this);
    this.isKeyframe = this.isKeyframe.bind(this);
    this.animate = this.animate.bind(this);

    this.animation = null;
    this.state = {
      animating: false,
      contextIndex: -1,
    };
  }

  deleteKeyframe() {
    const {
      dispatch,
      selectedAnimation,
    } = this.props;
    
    const {
      contextIndex,
    } = this.state;

    dispatch(deleteKeyframe(selectedAnimation, contextIndex));
    this.toggleContextMenu(-1, event);
  }

  selectFrame(index) {
    const {
      dispatch,
    } = this.props;

    dispatch(selectFrame(index));
  }

  toggleContextMenu(index, event) {
    event.preventDefault();

    this.setState(state => ({
      contextIndex: index,
    }));
  }

  toggleAnimation() {
    if (this.state.animating) {
      clearInterval(this.animation);
    }
    else {
      this.animation = setInterval(this.animate, 1000 / 60);
    }

    this.setState(state => ({
      animating: !state.animating,
    }));
  }

  isKeyframe(index) {
    const {
      animations,
      selectedAnimation,
    } = this.props;

    const animation = animations[selectedAnimation];

    if (!animation) return false;

    const keyframe = animation.keyframes[index];

    return !!(keyframe);
  }

  animate() {
    const {
      dispatch,
      selectedFrame,
      selectedAnimation,
      animations,
    } = this.props;

    const animation = animations[selectedAnimation];

    if (!animation) return;

    dispatch(selectFrame((selectedFrame + 1) % animation.numberOfFrames));
  }

  render() {
    const {
      animations,
      selectedAnimation,
      selectedFrame,
      animating,
    } = this.props;
    
    const animation = animations[selectedAnimation];
    const frameCount = (animation && animation.numberOfFrames) ? animation.numberOfFrames : 0;

    const classes = classnames(styles.component);

    const arr = [...Array(frameCount)];

    return (
      <div className={classes}>
        <div className="left">
          {arr.map((_, i) => {
            const classes = classnames('frame', {
              keyframe: !!(animation.keyframes[i]),
              selected: i === selectedFrame,
            });

            return (
              <div
                className={classes}
                onClick={() => this.selectFrame(i)}
                onContextMenu={event => this.toggleContextMenu(i, event)}
              >
                <div className="indicator" />
              </div>
            )
          })}
          <InlineSVG className={animating && 'animating'} icon="play" onClick={this.toggleAnimation} />
        </div>
        <Dialog
          visible={this.state.contextIndex >= 0}
          onCancel={event => this.toggleContextMenu(-1, event)}
        >
          <div className="menu">
            <Button
              onClick={this.deleteKeyframe}
              className={classnames(button.full, button.frame)}
              disabled={!this.isKeyframe(this.state.contextIndex)}
            >
              Delete keyframe
            </Button>
          </div>
        </Dialog>
      </div>
    );
  }
}

export default compose(
  connect(state => ({
    animations: state.app.animations,

    selectedAnimation: state.global.selectedAnimation,
    selectedFrame: state.global.selectedFrame,
  })),
  withRouter,
)(component);
