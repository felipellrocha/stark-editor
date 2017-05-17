import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { memoize } from 'lodash';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom'

import {
  AnimationSidebar,
  AnimationFooter,
} from 'components';

import {
  moveSprite,
  createKeyframe,
} from 'actions';

import styles from './styles.css';

class component extends PureComponent {
  constructor(props) {
    super(props);
    
    this.moveSprite = this.moveSprite.bind(this);
  }

  componentWillMount() {
    window.addEventListener('keydown', this.moveSprite);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.moveSprite);
  }

  moveSprite(event) {
    if (
      event.key !== 'ArrowUp' &&
      event.key !== 'ArrowRight' &&
      event.key !== 'ArrowDown' &&
      event.key !== 'ArrowLeft'
    ) return;

    const {
      selectedAnimation,
      selectedFrame,
      animations,
      sheets,
      dispatch,
    } = this.props;

    const animation = animations[selectedAnimation];

    if (!animation) return;

    const frame = animation.keyframes[selectedFrame];

    if (!frame) {
      const clone = getFrame(animation, selectedFrame);
      dispatch(createKeyframe(selectedAnimation, selectedFrame, clone));
    }

    // putting this here because I eventually wanna be able to support
    // multiple keys down.
    const coord = event.key;

    dispatch(moveSprite(selectedAnimation, selectedFrame, coord));
  }

  renderFrame() {
    const {
      selectedAnimation,
      selectedFrame,
      animations,
      sheets,
    } = this.props;

    const animation = animations[selectedAnimation];

    if (!animation) return null;

    const frame = getFrame(animation, selectedFrame);

    if (!frame) return null;

    const sheet = sheets[animation.sheet];

    const style = {
      width: frame.w,
      height: frame.h,
      background: `url(${sheet})`,
      backgroundPosition: `-${frame.x}px -${frame.y}px`,
      border: '1px dotted #aaa',
    };

    return (
      <div style={style} />
    );
  }

  render() {
    return (
      <div>
        <AnimationSidebar />
        <div className={styles.component}>
          {this.renderFrame()}
        </div>
        <AnimationFooter />
      </div>
    );
  }
}

const getFrame = memoize(function(animation, frameIndex) {
  for (let i = frameIndex; i >= 0; i--) {
    const frame = animation.keyframes[i];

    if (frame) return frame;
  }

  return null;
});

export default compose(
  connect(state => ({
    selectedAnimation: state.global.selectedAnimation,
    selectedFrame: state.global.selectedFrame,
    animations: state.app.animations,
    sheets: state.app.sheets,
  })),
  withRouter,
)(component);
