import React, { PureComponent } from 'react';
import classnames from 'classnames';

import styles from './styles.css'

import {
  Button,
} from 'components';

class component extends PureComponent {
  render() {
    const {
      className,
      visible,
      onContinue,
      onCancel,
    } = this.props;

    const classes = classnames(styles.component, className, {
      visible: visible, 
    });

    return (
      <div className={classes}>
        <div className="dialog">
          <div className="main">
            {this.props.children}
          </div>
          <div className="actions">
            <Button onClick={onContinue}>Continue</Button>
            <Button onClick={onCancel}>Cancel</Button>
          </div>
        </div>
      </div>
    );
  }
}

component.defaultProps = {
  visible: false,
  onContinue: () => { },
  onCancel: () => { },
}

export default component;
