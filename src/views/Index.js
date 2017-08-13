import React from 'react';
import Jumbotron from '../components/Jumbotron.js';
import Waypoint from 'react-waypoint';
import $ from 'jquery';

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: {}
    };
  }

  handleWaypointEnter = (classname, ref) => {
    let prevClasses = this.state.classes;
    prevClasses[ref] = classname;
    this.setState({
      classes: prevClasses
    });
  }

  render() {
    return (
      <div>
        <Jumbotron/>
        <div id="wedding" className="o-container-large u-mt-large u-mh-auto u-p-small u-pt-xlarge@sm" data-uk-height-viewport>
          <Waypoint onEnter={() => this.handleWaypointEnter('c-heading_active', 'weddingTitle')}/>
          <h1 ref='#weddingTitle'className={`c-heading-xlarge c-heading_block u-mb-large u-font-lato3 u-color-secondary ${this.state.classes.weddingTitle ? this.state.classes.weddingTitle : ''}`}>We're Getting Married!</h1>
          <div className="uk-flex uk-flex-around">
            <div className="u-1/2 u-pr-small">
              <div className="u-1">
                <img className="u-1" src="http://www.ashleyandjeffwedding.com/assets/img/Thumbnail5.jpg"/>
              </div>
              <div  className="u-flex uk-flex-around">
                <div className="u-1/2 u-f-l">
                  <img src="http://www.ashleyandjeffwedding.com/assets/img/Thumbnail5.jpg"/>
                </div>
                <div className="u-1/2">
                  <img src="http://www.ashleyandjeffwedding.com/assets/img/Thumbnail5.jpg"/>
                </div>
              </div>
              <div>
                <span className="li-gallery"></span>
              </div>
            </div>
            <div className="u-1/2">
              <h4>Thank you for coming!</h4>
              <p className="u-mv">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
              <p className="u-mv">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
              <p className="u-mv">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
              <p className="u-mv">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            </div>
          </div>
        </div>
        <div className="o-container" data-uk-height-viewport>
          Hello
        </div>
        <div  className="o-container" data-uk-height-viewport>
          Hello
        </div>
        <div className="o-container" data-uk-height-viewport>
          Hello
        </div>
      </div>
    );
  }
}

export default Index;
