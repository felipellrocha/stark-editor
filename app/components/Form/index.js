import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import classnames from 'classnames';

import styles from './styles.css';

class component extends PureComponent {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event, field, i) {
    const {
      onChange,
    } = this.props;
    
    if (onChange) onChange({
      field: field,
      value: event.target.value,
      index: i,
    });
  }

  renderInput(field, i) {
    if (field.type === 'int') return (<input
      type="number"
      value={field.value || 0}
      onChange={event => this.handleChange(event, field, i)}
    />);

    return (<input
      type="text"
      value={field.value || ''}
      onChange={event => this.handleChange(event, field, i)}
    />);
  }

  render() {
    const {
      fields
    } = this.props;

    return (
      <div
        className={styles.component}
      >
        {fields.map((field, i) => {
          return (
            <div className="field" key={field.name}>
              <label><strong>{field.type}</strong> {field.name}</label>
              {this.renderInput(field, i)}
            </div>
          )
        })}
      </div>
    );
  }
}

export default component;
