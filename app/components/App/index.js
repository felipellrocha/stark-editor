import React, { Component } from 'react';
import type { Children } from 'react';

import styles from './styles.css';

import {
  Sidebar,
} from 'components';

export default class component extends Component {
  props: {
    children: Children
  };

  render() {
    return (
      <div>
        <Sidebar />
        <div className={styles.component}>
          {this.props.children}
        </div>
      </div>
    );
  }
}
