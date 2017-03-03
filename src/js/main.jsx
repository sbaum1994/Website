require('../sass/App.scss');
import Bootstrap from 'bootstrap/dist/css/bootstrap.css';
import ReactDOM from 'react-dom';
import React from 'react';
import * as d3 from "d3";

import App from './components/App.jsx';

let dataset;
// need to add redux this is lame lol
d3.json("/data", (err, json) => {
  dataset = json;
  ReactDOM.render(<div>
    <App dataset={dataset} />
  </div>, document.getElementById('app'));
});
