import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import Logo from './Logo.js';

const Header = ({}) => (
  <header className="">
    <nav className="uk-navbar-container uk-navbar-transparent uk-visible@m" data-uk-navbar>
      <div className="uk-navbar-center">
        <div className="uk-navbar-center-left">
          <div>
            <ul className="uk-navbar-nav">
              <li className="">
                <Route>
                  <NavLink activeClassName="active" to="/story">
                    Our Story
                  </NavLink>
                </Route>
              </li>
              <li className="">
                <Route>
                  <NavLink activeClassName="active" to="/login">
                    Wedding
                  </NavLink>
                </Route>
              </li>
              <li className="">
                <Route>
                  <NavLink activeClassName="active" to="/guestbook">
                    Travel
                  </NavLink>
                </Route>
              </li>
            </ul>
          </div>
        </div>
        <div className="uk-navbar-item uk-logo">
          <Route>
            <NavLink activeClassName="active" to="/" className="uk-link-reset">
              <Logo/>
            </NavLink>
          </Route>
        </div>
        <div className="uk-navbar-center-right">
          <div>
            <ul className="uk-navbar-nav">
              <li>
                <Route>
                  <NavLink activeClassName="active" to="/gallery">
                    Gallery
                  </NavLink>
                </Route>
              </li>
              <li>
                <Route>
                  <NavLink activeClassName="active" to="/registry">
                    Registry
                  </NavLink>
                </Route>
              </li>
              <li>
                <Route>
                  <NavLink activeClassName="active" to="/rsvp">
                    RSVP
                  </NavLink>
                </Route>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
    <nav className="uk-navbar-container uk-navbar-transparent uk-hidden@m mobile" data-uk-navbar>
      <div className="uk-navbar-left">
        <ul className="uk-navbar-nav">
          <li>
            <Route>
              <NavLink activeClassName="active" to="/" className="uk-link-reset">
                <Logo/>
              </NavLink>
            </Route>
          </li>

        </ul>
      </div>
      <div className="uk-navbar-right ">
        <ul className="uk-navbar-nav">
          <li className="uk-container hamburger-container">
            <span className="hamburger"></span>
            <span className="hamburger"></span>
            <span className="hamburger"></span>
          </li>
        </ul>
      </div>
    </nav>
  </header>
);

Header.propTypes = {
  user: React.PropTypes.string.isRequired
};

export default Header;
