import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from "react-router-dom";
import Routes from './components/routes';
import store from './state';
import './App.css';

const App = () => (
  <Provider store={store}>
    <Router>
      <div className="App">
        <Routes />
      </div>
    </Router>
  </Provider>
);


export default App;
