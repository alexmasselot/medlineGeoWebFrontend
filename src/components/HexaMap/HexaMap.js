/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import styles from './HexaMap.css';
import withStyles from '../../decorators/withStyles';
import hexaCountStore from '../../stores/HexaCountStore.js'

@withStyles(styles)
class ContactPage extends Component {
  _onChange() {
    this.setState(hexaCountStore.getAll());
  }

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

  componentDidMount() {
    hexaCountStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    hexaCountStore.removeChangeListener(this._onChange);
  }

  render() {
    const title = 'publication count';
    this.context.onSetTitle(title);
    return (
      <div className="HexaMap">
        <div className="HexaMap-container">
          <h1>{title}</h1>
          <p>WTF QQQQQQ? {this.state.radius}!</p>
        </div>
      </div>
    );
  }

}

export default ContactPage;
