import React from 'react';
import MagnificentGraph from './MagnificentGraph.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div className="container-fluid">
        <div className ="header row">
          <div className="col-md-4"></div>
          <div className="col-md-4 title">Hi, my name is <span className="name">Stephanie Baum</span>.
          I'm a software developer 1 year out of uni. 
          I went to University of Los Angeles, California, majored in Computer Science & Linguistics with a minor in Arabic.
          I'm located in Seattle, WA. I'm passionate about creating exciting, high quality software.
          I made this quick little website for fun and to show some of my skillset.</div>
          <div className="col-md-4"></div>
        </div>
        <div className="mid row">
          <div className="col-md-2"></div>
          <div className="col-md-8 graph-col">
            <div className="graph-container">
              <MagnificentGraph dataset={this.props.dataset} />
            </div>
          </div>
          <div className="col-md-2"></div>
        </div>
        <div className ="footer row">
          <div className="col-md-4"></div>
          <div className="col-md-4 icons">
            <span className="fa fa-mobile-phone"><span className="phone-info">Mobile: 1-805-905-1963</span></span>
            <span className="fa fa-envelope"><span className="email-info">Email: sbaum1994@gmail.com</span></span>
            <a href="https://drive.google.com/file/d/0BxQw967oWD-fdmtyWTNBZVVnV1U/view?usp=sharing"><span className="fa fa-file-text"><span className="resume-info">Click to download my resume.</span></span></a>
            <a href="https://github.com/sbaum1994"><span className="fa fa-github"></span></a>
            <a href="https://www.linkedin.com/in/stephanie-baum-9a2a3b41"><span className="fa fa-linkedin"></span></a>
          </div>
          <div className="col-md-4"></div>
        </div>
      </div>
    )
  }
}

App.propTypes = {
  dataset: React.PropTypes.object.isRequired
};

export default App;