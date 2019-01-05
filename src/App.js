import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import BackendHealth from './scenes/backendHealth';
import WatchlistContainer from './scenes/watchlist';
import './App.css';

const App = () => (
  <Router>
    <div className="App">
      <Route path="/" exact component={WatchlistContainer} />
      <Route path="/health" component={BackendHealth} />
    </div>
  </Router>
);


export default App;
