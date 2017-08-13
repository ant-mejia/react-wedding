import React from 'react';

class Jumbotron extends React.Component {

  render() {
    return (
      <div className="c-jumbotron uk-cover-container">
        <div  data-uk-height-viewport data-uk-parallax="y: -100; easing: 0.8">
          <img src="http://www.photographyonthehill.co.uk/wp-content/uploads/2011/06/lucy-preece1200-229-of-914.jpg" className="c-jumbotron_image" alt="" data-uk-cover/>
        </div>
        <div className="uk-position-center c-jumbotron_container">
          <h1 className="uk-animation-fade">Denisse & Jon</h1>
          <h2 className="uk-animation-fade">- Tying the Knot -</h2>
        </div>
        <div className="uk-position-bottom-center down-arrow">
          <a href="#wedding" className="uk-link-reset" data-uk-scroll>
            <span className="li-down-open-big wt c-jumbotron_icon"></span>
          </a>
        </div>
      </div>
    );
  }
}

export default Jumbotron;
