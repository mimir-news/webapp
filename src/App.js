import React, { Component } from 'react';
import './App.css';
import BackendHealth from './scenes/backendHealth';

class App extends Component {
  render() {
    return (
      <div className="App">
        <BackendHealth />
      </div>
    );
  }
}

export default App;
