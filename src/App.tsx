import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Container, Content, Footer, Header, Icon, Nav } from 'rsuite';

// import default style
import 'rsuite/dist/styles/rsuite-dark.css'
import './App.css'
import HomePage from './pages/HomePage';


class App extends React.Component {
  state = {
    active: "home"
  }
  render() {
    const { active } = this.state;
    return (<HomePage></HomePage>
    );
  }
}

export default App;
