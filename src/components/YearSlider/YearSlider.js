/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import ReactDOM  from 'react-dom';
import ActionCreators from '../../actions/ActionCreators';
import { Button, Glyphicon } from 'react-bootstrap';

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

  nextYear(){
    let _this = this;
    ActionCreators.selectYear(Math.min(_this.state.selectedYear+1, _this.props.maxYear));
  }

  previousYear(){
    let _this = this;
    ActionCreators.selectYear(Math.max(_this.state.selectedYear-1, _this.props.minYear));
  }

  render() {
    var _this = this;

    return <div className="year-slider">
      <Button bsStyle="primary" bsSize="small" onClick={_this.previousYear.bind(_this)}><Glyphicon glyph="chevron-left" /></Button>
      <ReactSlider
             className="horizontal-slider"
             value={_this.state.localYear}
             min={_this.props.minYear}
             max={_this.props.maxYear}
             withBars
             onChange={function(v){_this.setState({localYear:v})}}
             onAfterChange={_this.handleAfterChange}
             >
             <div className="{'year-value' + (_this.state.localYear === _this.state.selectedYear)?' confirmed':'') }" key="0">{_this.state.localYear}</div>
         </ReactSlider>
         <Button bsStyle="primary" bsSize="small" onClick={_this.nextYear.bind(_this)}><Glyphicon glyph="chevron-right" /></Button>
    </div>;
  }
}

export default YearSlider;
