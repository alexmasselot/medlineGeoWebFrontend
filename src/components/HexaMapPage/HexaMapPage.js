/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import styles from './HexaMapPage.css';
import withStyles from '../../decorators/withStyles';
import hexaCountStore from '../../stores/HexaCountStore.js'

@withStyles(styles)
class HexaMapPage extends Component {
  _onChange() {
    var _this = this;
    console.log('HexaMapPage._onChange', this, hexaCountStore.getAll())
    _this._data = hexaCountStore.getAll();
    _this.setState({});
  }

  componentDidMount() {
    var _this = this;
    console.log('compomentDidMount', _this);
    console.log('arguments', arguments);
    hexaCountStore.addChangeListener(function(){
      console.log('onChange callback');
      _this._onChange();
    });
  }

  componentWillUnmount() {
    hexaCountStore.removeChangeListener(this._onChange);
  }

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

  render() {
    var _this= this;
    console.log('rendering Heamap page', this.state);
    var radius = _this._data?_this._data.radius:0;
    console.log('rendering radius', radius);
    console.log('_data', _this._data)

    console.log('props', this.props);
    const title = 'publication count';

//    this.context.onSetTitle(title);
    return (
      <div className="HexaMap">
        <div className="HexaMap-container">
          <h1>{title}</h1>
          <p>WTF QQQ? {radius}!!</p>
        </div>
      </div>
    );
  }

}

export default HexaMapPage;
