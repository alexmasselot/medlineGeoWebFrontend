/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import ReactDOM  from 'react-dom';
import ActionCreators from '../../actions/ActionCreators';

import ReactSlider from 'react-slider';
import styles from './YearSlider.css';
import withStyles from '../../decorators/withStyles';


@withStyles(styles) class YearSlider extends Component {
  constructor() {
    super();
    this.state = {
      selectedYear:-1
    };
  }

  _onChange() {
    var _this = this;
    let year = _this.props.store.getData().year;
    _this.setState({
      selectedYear:year,
      localYear:year
    });
  }

  componentDidMount() {
    var _this = this;
    _this.props.store.addChangeListener(function () {
      _this._onChange();
    });
  }

  componentWillUnmount() {
    let _this = this;
    _this.props.store.removeChangeListener(function () {
      _this._onChange();
    });
  }

  handleChange(value){
    let _this = this;
    _this.setState({localYear:value})
  }

  handleAfterChange(value){
    let _this = this;
    ActionCreators.selectYear(value);
  }


  render() {
    var _this = this;
    var year = _this.state.localYear;

    return <div className="year-slider">
      <ReactSlider
             className="horizontal-slider"
             value={year}
             min={_this.props.minYear}
             max={_this.props.maxYear}
             withBars
             onChange={function(v){_this.setState({localYear:v})}}
             onAfterChange={_this.handleAfterChange}
             >
             <div key="0">{year}</div>
         </ReactSlider>
              <span><strong>{year}</strong></span>
    </div>;
  }
}

export default YearSlider;
