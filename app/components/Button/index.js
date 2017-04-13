import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import classnames from 'classnames';

import styles from './styles.css';

class component extends PureComponent {
  render() {
    const {
      label,
      onClick,
      className,
    } = this.props;

    const classes = classnames(styles.component, className);

    return (
      <a
        className={classes}
        onClick={onClick}
      >
        { this.props.children }
      </a>
    );
  }
}

export default component;
