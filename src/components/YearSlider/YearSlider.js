/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import ReactDOM  from 'react-dom';
import ActionCreators from '../../actions/ActionCreators';
import { Button, Glyphicon } from 'react-bootstrap';
import Dimensions from 'react-dimensions'
import _ from 'lodash';

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

  getFirstStore(){
    let _this = this;
    if(_.isArray(_this.props.store)){
      return _this.props.store[0];
    }
    return _this.props.store;
  }

  getStores(){
    let _this = this;
    if(_.isArray(_this.props.store)){
      return _this.props.store;
    }
    return [_this.props.store];
  }

  _onChange() {
    var _this = this;
    let year = _this.getFirstStore().getData().year;
    _this.setState({
      selectedYear:year,
      localYear:year
    });
  }

//  resize (){ _.throttle(() => {
//      if (this.refs.root && this.refs.sidebarToggleBtn) {
//        this.setState({
//          rootWidth:              this.refs.root.offsetWidth,
//          sidebarToggleBtnWidth:  this.refs.sidebarToggleBtn.offsetWidth,
//        });
//      }
//    }, 30)
//  }

  componentDidMount() {
    var _this = this;
    _.each(_this.getStores(), function(store){
      store.addChangeListener(function () {
        _this._onChange();
      });
    });
  }

  componentWillUnmount() {
    let _this = this;
    _.each(_this.getStores(), function(store){
      store.removeChangeListener(function () {
        _this._onChange();
      });
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

    let w = _this.props.containerWidth;

    return <div className="year-slider">
      <div style={{width:'50%', position:'relative'}}>

        <Button style={{width:'40px', top:0, left:0, position:'absolute'}} bsStyle="info" bsSize="small" onClick={_this.previousYear.bind(_this)}><Glyphicon glyph="chevron-left" /></Button>
        <div style={{width:(w-115)+'px', left:'50px', top:0, position:'absolute'}}>
          <ReactSlider
                style={{width:(w-108)+'px', left:'50px'}}
               className="horizontal-slider"
               value={_this.state.localYear}
               min={_this.props.minYear}
               max={_this.props.maxYear}
               withBars
               onChange={function(v){_this.setState({localYear:v})}}
               onAfterChange={_this.handleAfterChange}
               >
               <div className={'year-value' + ((_this.state.localYear === _this.state.selectedYear)?' confirmed':'') }
                key="0">{_this.state.localYear}</div>
           </ReactSlider>
         </div>
         <Button  style={{width:'40px', left:(w-53)+'px', top:0, position:'absolute'}} bsStyle="info" bsSize="small" onClick={_this.nextYear.bind(_this)}><Glyphicon glyph="chevron-right" /></Button>
       </div>
    </div>;
  }
}

export default Dimensions()(YearSlider);
