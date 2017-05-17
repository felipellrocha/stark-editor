import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom'

import {
  InlineSVG,
  Button,
} from 'components';

import {
  selectFrame,
} from 'actions';

import styles from './styles.css';

class component extends PureComponent {
  constructor(props) {
    super(props);

    this.selectFrame = this.selectFrame.bind(this);
  }

  selectFrame(index) {
    const {
      dispatch,
    } = this.props;

    dispatch(selectFrame(index));
  }

  render() {
    const {
      animations,
      selectedAnimation,
      selectedFrame,
    } = this.props;
    
    const animation = animations[selectedAnimation];
    const frameCount = (animation && animation.numberOfFrames) ? animation.numberOfFrames : 0;

    const classes = classnames(styles.component);

    const arr = [...Array(frameCount)];

    return (
      <div className={classes}>
        {arr.map((_, i) => {
          const classes = classnames('frame', {
            keyframe: !!(animation.keyframes[i]),
            selected: i === selectedFrame,
          });

          return (
            <div className={classes} onClick={() => this.selectFrame(i)}>
              <div className="indicator" />
            </div>
          )
        })}
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
