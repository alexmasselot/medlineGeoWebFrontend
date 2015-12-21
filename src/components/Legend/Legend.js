/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import styles from './Legend.css';
import withStyles from '../../decorators/withStyles';
import legendStore from '../../stores/LegendStore';

@withStyles(styles)
class Legend extends Component {

  static propTypes = {
    className: PropTypes.string,
  };

 _onChange() {
    this.setState({legendEl:legendStore.getLegendFocus()})
  }

  componentDidMount() {
    var _this = this;
    legendStore.addChangeListener(function(){
      _this._onChange();
    });
  }

  componentWillUnmount() {
    legendStore.removeChangeListener(this._onChange);
  }

  render() {
    let _this = this;

    if(!(_this.state && _this.state.legendEl)){
      return <div></div>
    }
    return (
      <div className='Legend-container' >
        <h4>Legend</h4>
        {_this.state.legendEl}
      </div>
    );
  }

}

export default Legend;
