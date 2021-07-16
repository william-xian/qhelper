import React from 'react';
import { Container, Content, Footer, Header, Icon, Nav } from 'rsuite';
import Peoples from './pages/Pepoples';
import { Tools } from './pages/Tools';
import { Book } from './pages/Book';

class App extends React.Component {
  state = {
    active: "home"
  }

  onSelect(eventKey: string) {
    this.setState({ active: eventKey });
  }

  render() {
    const { active } = this.state;
    let content = (<div></div>);
    switch (active) {
      case 'home':
        content = (<Peoples></Peoples>);
        break;
      case 'book':
        content = (<Book></Book>);
        break;
      case 'tools':
        content = (<Tools></Tools>);
        break;
    }
    return (
      <Container>
        <Header></Header>
        <Content style={{ overflow: 'auto' }}>{content}</Content>
        <Footer>
          <Nav style={{ textAlign: "center" }} justified appearance="subtle" reversed activeKey={active} onSelect={(evtKey) => this.onSelect(evtKey)}>
            <Nav.Item eventKey="home" icon={<Icon icon="group"/>}>患者</Nav.Item>
            <Nav.Item eventKey="book" icon={<Icon icon="book" />}>笔记</Nav.Item>
            <Nav.Item eventKey="tools" icon={<Icon icon="calculator" style={{ marginBottom: "-1px"}}/>}>工具</Nav.Item>
          </Nav>
        </Footer>
      </Container>
    );
  }
}

export default App;
