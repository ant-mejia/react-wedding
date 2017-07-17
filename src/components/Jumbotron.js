import React from 'react';

class Jumbotron extends React.Component {

  render() {
    return (
      <div className="jumbotron uk-cover-container" data-uk-height-viewport>
        <img src="http://www.photographyonthehill.co.uk/wp-content/uploads/2011/06/lucy-preece1200-229-of-914.jpg" alt="" data-uk-cover/>
        <div className="uk-position-center">
          Jumbotron
        </div>
      </div>
    );
  }
}

export default Jumbotron;
