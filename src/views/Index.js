import React from 'react';
import Jumbotron from '../components/Jumbotron.js';
class Index extends React.Component {

    render() {
        return (
            <div>
                <Jumbotron/>
                <div className="uk-container" data-uk-height-viewport>
                    Hello
                </div>
                <div className="uk-container" data-uk-height-viewport>
                    Hello
                </div>
                <div id="wedding" className="uk-container" data-uk-height-viewport>
                    Hello
                </div>
                <div className="uk-container" data-uk-height-viewport>
                    Hello
                </div>
            </div>
        );
    }

}

export default Index;
