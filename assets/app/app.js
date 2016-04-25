//var CONST_ES6_BUILD_PATH = './build/';

//var _  = require('lodash');
//var React = require('react');

import React from 'react'
import { render } from 'react-dom'
import { Router, Route, Link, browserHistory } from 'react-router'
import App from './pages/App.jsx'
import Test from './pages/Test.jsx'
console.log(location.pathname)
render((
  <Router history={browserHistory}>
    <Route path="/" component={App}/>
    <Route path="/test" component={Test}/>
  </Router>
), document.getElementById('app'))
