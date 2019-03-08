import React, { Component } from 'react';
import './App.css';
import LineChart from './components/LineChart'
import data from './components/data.json'

class App extends Component {
  render() {
    return (
      <div className="App">
        <LineChart data={data}/>
      </div>
    );
  }
}

export default App;
