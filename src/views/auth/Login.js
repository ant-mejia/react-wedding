import React from 'react';
import { Redirect } from 'react-router-dom';
import $ from 'jquery';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      validated: false
    };
  }
  componentWillUnmount() {
    this.props.closeNotifications('login')
  }

  validateEmail = (email) => {
    let rx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return rx.test(email);
  }
  handleInput = (event) => {
    let email = $(event.target)
      .children('input[type="email"]')
      .val();
    console.log(this.validateEmail(email));
    console.log('input detected');
  }
  handleSubmit = (event) => {
    event.preventDefault();
    let email = $(event.target)
      .children('input[type="email"]')
      .val();
    let password = $(event.target)
      .children('input[type="password"]')
      .val();
    this.props.loginUser(email, password);
  }

  render() {
    let path = this.props.location.state ?
      this.props.location.state.from.pathname.split('/')[1] :
      '/profile';
    let heading = path === 'profile' ?
      'You have to Login!' :
      'Please Login';
    if (this.props.isUserAuth()) {
      return (<Redirect to={path}/>)
    }
    return (
      <div className="uk-container">
        <h1>{heading}</h1>
        Log In
        <form onInput={(e) => this.handleInput(e)} onSubmit={(e) => this.handleSubmit(e)}>
          <input ref="email" name="email" type="email"/>
          <input ref="password" name="password" type="password"/>
          <input type="submit"/>
        </form>
      </div>
    );
  }

}

export default Login;
