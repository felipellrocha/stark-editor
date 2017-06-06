import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import classnames from 'classnames';

import styles from './styles.css';

class component extends PureComponent {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.renderArray = this.renderArray.bind(this);
    this.renderObject = this.renderObject.bind(this);
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

  renderArray() {
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

  renderObject() {
    const {
      fields
    } = this.props;

    const fieldList = Object.keys(fields);

    return (
      <div
        className={styles.component}
      >
        {fieldList.map(name => {
          const field = fields[name];
          return (
            <div className="field" key={name}>
              <label><strong>{field.type}</strong> {name}</label>
              {this.renderInput(field, name)}
            </div>
          )
        })}
      </div>
    );
  }

  render() {
    const {
      fields
    } = this.props;

    return Array.isArray(fields) ?
      this.renderArray() :
      this.renderObject();
  }
}

export default component;
