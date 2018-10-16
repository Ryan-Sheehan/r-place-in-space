import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import MyComponent from './MyComponent';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <MyComponent/>
        </header>
      </div>
    );
  }
}

export default App;
