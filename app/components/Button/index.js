import React, { Component } from 'react';
import { connect } from 'react-redux';

import styles from './styles.css';

class component extends Component {
  render() {
    const {
      label,
      onClick,
    } = this.props;

    return (
      <a
        className={styles.component}
        onClick={onClick}
      >
        { label }
      </a>
    );
  }
}

export default component;
