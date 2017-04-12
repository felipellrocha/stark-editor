import React from 'react';

import styles from './styles.css';

import {
  Sidebar,
  Footer,
} from 'components';

export default function() {
  return (Component) => (props) => {
    return (
      <div>
        <Sidebar />
        <div className={styles.component}>
          <Component {...props} />
        </div>
        <Footer />
      </div>
    );
  }
};
