import React from 'react';
import { Route, Redirect } from 'react-router-dom';


const AuthRoute = ({ component: Component, ...rest }) => {
  return (
    <Route {...rest} render={props => {
      let p = { ...rest };
      return (p.isUserAuth() ? (<Component {...props}/>): (false ? (
        <Redirect to={{
          pathname: '/login',
          state: { from: props.location }
        }}/>
      ) : (<Component {...props}/>))
      )
    }
    }
    />)
};

AuthRoute.propTypes = {
  user: React.PropTypes.object.isRequired,
  isUserAuth: React.PropTypes.func.isRequired
};

export default AuthRoute;
