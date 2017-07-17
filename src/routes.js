import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { CSSTransitionGroup } from 'react-transition-group';
import io from 'socket.io-client';
import localStorage from 'localStorage';
import axios from 'axios';
import AuthRoute from './components/AuthRoute';
import App from './views/Index.js';
import About from './views//About';
import Contact from './views/Contact.js';
import Registry from './views/Registry.js';
import Rsvp from './views/Rsvp.js';
import Story from './views/Story.js';
import NotFound from './views/NotFound.js';
import Login from './views/auth/Login.js';
import Register from './views/auth/Register.js';
import Profile from './views/auth/Profile.js';
import Guestbook from './views/Guestbook.js';
import Header from './components/Header';
import Footer from './components/Footer';
import Preloader from './components/Preloader';
import UIkit from 'uikit';


class Routes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      guestbook: {},
    };
    this.socket = io('http://localhost:5000');
    this.socket.on('hello', (cnt) => {
      console.log(cnt);
    })
  }

  componentWillMount() {
    let tk = localStorage.getItem('jta');
    if (tk !== null && typeof tk === 'string' || tk instanceof String) {
      this.loginUserWTK(tk);
    }
  }

  isUserAuth = () => {
    return Object.keys(this.state.user)
      .length !== 0 && this.state.user.constructor === Object
  }
  createNotification = (message, status = "primary", timeout = 3000, group) => {
    let details = {
      message,
      status,
      group,
      pos: 'bottom-center',
      timeout
    }
    UIkit.notification(details);
  }

  closeNotifications = (group) => {
    UIkit.notification.closeAll(group);
  }

  loginUserWTK = (token) => {
    axios.post('/login', {
        jwt: token
      })
      .then((response) => {
        console.log(response);
        let user = response.data
        this.setUser(user);
      })
      .catch((error) => {
        this.createNotification("Please sign in again", 'error', undefined, "login");
        this.logoutUser();
      })
  }

  loginUser = (email, password) => {
    axios.post('/login', {
        email: email,
        password: password
      })
      .then((response) => {
        console.log(response.data);
        let user = response.data.user
        this.setUser(response.data.user);
        localStorage.setItem('jta', response.data.jwt);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          let message = error.response.data.message !== undefined ?
            error.response.data.message :
            "Invalid email/password";
          this.createNotification(message, 'error', 3000, 'login');
        }
      });
  }

  registerUser = (obj) => {
    axios.post('/register', {
        user: obj
      })
      .then((response) => {
        this.createNotification(response.data.message, 'success', 3000, 'register')
        this.loginUser(obj.email, obj.password)
      })
      .catch((error) => {
        if (error.response) {
          this.createNotification(error.response.data.message, 'error', 3000, 'login')
        }
      });
  }

  logoutUser = (tk) => {
    let data = {}
    if (this.state.user) {
      data = {
        user: this.state.user
      }
    } else {
      data = {
        jta: tk
      }
    }
    axios.post('/logout', data)
      .then((response) => {
        console.log(response);
        localStorage.removeItem('jta');
        this.setUser({});
      })
      .catch((err) => {
        console.log(err);
      });
  }

  setUser = (user) => {
    this.setState({ user });
  }

  guestbook = {
    newMessage: (msg) => {},
    getMessages: (fn) => {
      axios.get('/guestbook', {
          headers: {
            JWT: localStorage.getItem('jta')
          }
        })
        .then(function(response) {
          fn(response);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    handleSubmit: (e) => {
      e.preventDefault();
      this.socket.emit('guestbookMessage', 'TESTING!!');
    }
  }

  render() {
    return (
      <Router>
        <div id="body">
          <Preloader/>
          <Header user="a"/>
          <div id="app">
            <Switch>
              <Route exact path="/" component={App}/>
              <Route exact path="/about" component={About}/>
              <Route exact path="/contact" component={Contact}/>
              <Route exact path="/registry" component={() => <Registry loginUser={this.loginUser}/>}/>
              <Route exact path="/rsvp" component={Rsvp}/>
              <Route exact path="/story" component={Story}/>
              <Route path="/login" component={(location) => <Login location={location.location} closeNotifications={this.closeNotifications} loginUser={this.loginUser} isUserAuth={this.isUserAuth} user={this.state.user}/>}/>
              <Route path="/register" component={() => <Register createNotification={this.createNotification} closeNotifications={this.closeNotifications} registerUser={this.registerUser} isUserAuth={this.isUserAuth} user={this.state.user}/>}/>
              <AuthRoute path="/profile" appLoaded={this.state.loaded} isUserAuth={this.isUserAuth} user={this.state.user} component={() => <Profile isUserAuth={this.isUserAuth}/>}/>
              <AuthRoute path="/guestbook" appLoaded={this.state.loaded} isUserAuth={this.isUserAuth} user={this.state.user} component={() => <Guestbook methods={this.guestbook} isUserAuth={this.isUserAuth} createNotification={this.createNotification}/>}/>
              <Route component={NotFound}/>
            </Switch>
          </div>
          <Footer/>
        </div>
      </Router>
    );
  }
}

export default Routes;
