import React from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

class Rsvp extends React.Component {

  render() {
    return (
      <div className="uk-container" onClick={this.handleClick}>
        Save The Date!
        <Link to="/register">
          <h2>Register</h2>
        </Link>
      </div>
    );
  }

}

export default Rsvp;
