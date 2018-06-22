// @flow
import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css';

import LookupContext from './containers/LookupContext';
import SitesWrapper from './components/SitesWrapper';
import ProductsWrapper from './components/ProductsWrapper';
import TopMenuContainer from './containers/TopMenuContainer';
import type { AppProps, AppState } from './types';
import { Container } from 'semantic-ui-react';
import { Header, Tab } from 'semantic-ui-react';
import { getStatus } from './helpers/apiFetcher';

class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      products: [],
      sites: [],
      authenticator: '',
      isLoading: false,
      retrieveStatus: (): any => {
        return getStatus().then(data => {
          return this.setState({ ...this.state, ...data, isLoading: false });
        });
      },
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    this.state.retrieveStatus();
  }

  render() {
    const panes = [
      {
        menuItem: 'Sites',
        render: () => (
          <Tab.Pane>
            <SitesWrapper />
          </Tab.Pane>
        ),
      },
      {
        menuItem: 'Products',
        render: () => (
          <Tab.Pane>
            <ProductsWrapper />
          </Tab.Pane>
        ),
      },
    ];

    return (
      <LookupContext.Provider value={this.state}>
        <div className="App">
          <TopMenuContainer />
          <Container style={{ marginTop: '7em' }}>
            <Header as="h1"> Plone sites lookup </Header>
            <Tab panes={panes} />
          </Container>
        </div>
      </LookupContext.Provider>
    );
  }
}

export default App;
