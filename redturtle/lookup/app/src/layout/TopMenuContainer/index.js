import React, { Component } from 'react';
import { Container, Icon, Image, Menu } from 'semantic-ui-react';

export default class TopMenuContainer extends Component {
  state = {
    menuFixed: false,
    overlayFixed: false,
  };

  stickOverlay = () =>
    this.setState({
      overlayFixed: true,
    });

  stickTopMenu = () =>
    this.setState({
      menuFixed: true,
    });

  unStickOverlay = () =>
    this.setState({
      overlayFixed: false,
    });

  unStickTopMenu = () =>
    this.setState({
      menuFixed: false,
    });

  render() {
    return (
      <Menu fixed="top" inverted>
        <Container>
          <Menu.Item as="a" header>
            <Image
              size="tiny"
              src="/++resource++plone-logo.png"
              style={{ marginRight: '1.5em' }}
            />
          </Menu.Item>
          <Menu.Item as="a" href="/manage_main">
            ZMI
          </Menu.Item>
          <Menu.Item as="a" href="/@@plone-addsite">
            <Icon name="add" />Add new site
          </Menu.Item>
        </Container>
      </Menu>
    );
  }
}
