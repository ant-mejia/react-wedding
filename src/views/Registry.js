import React from 'react';
import {Link} from 'react-router-dom';

class Registry extends React.Component {

    render() {
        return (
            <div>
                <h1>Wedding Registry</h1>
                <Link to="/profile">
                    Profile
                </Link>
            </div>
        );
    }

}

export default Registry;
