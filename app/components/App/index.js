import React, { Component } from 'react';

import styles from './styles.css';

import {
  Sidebar,
  Footer,
} from 'components';

console.log('here');

const hoc = function() {
  return (component) => (props) => {
    return (
      <div>
        <Sidebar />
        <div className={styles.component}>
          <component {...props} />
        </div>
        <Footer />
      </div>
    );
  }
};

export default hoc;
