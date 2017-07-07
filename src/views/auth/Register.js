import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';

class Register extends Component {

  handleClick = () => {
    this.props.registerUser()
  }

  handleSubmit = (e = null) => {
    if (e !== null) {
      e.preventDefault();
    }
    let user = {
      email: this.refs.email.value,
      password: this.refs.password.value,
      firstname: 'Test',
      lastname: 'Account'
    }
    this.props.registerUser(user);
  }

  render() {
    if (this.props.isUserAuth()) {
      return (<Redirect to="/profile"/>)
    }
    return (
      <div className="uk-container">
        <h1 onClick={this.handleClick}>Register</h1>
        <form onSubmit={(e) => this.handleSubmit(e)}>
          <input ref="email" type="text" placeholder="email address"/>
          <input ref="password" type="password" placeholder="password"/>
          <input type="submit"/>
        </form>
      </div>
    );
  }

}

export default Register;
