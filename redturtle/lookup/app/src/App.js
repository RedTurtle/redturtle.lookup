// @flow
import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css';

import LookupContext from './Context/LookupContext';
import SitesPanel from './Site/SitesPanel';
import ProductsPanel from './Product/ProductsPanel';
import TopMenuContainer from './containers/TopMenuContainer';
import type { AppProps, AppState, Product } from './types';
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
      error: '',
      retrieveStatus: (): any => {
        return getStatus()
          .then(data => {
            return this.setState({
              ...this.state,
              ...data,
              isLoading: false,
              error: '',
            });
          })
          .catch(e => {
            console.error(e.message);
            this.setState({
              ...this.state,
              isLoading: false,
              error: e.message,
            });
          });
      },
      updateSiteProducts: ({ siteId, products }): any => {
        this.setState({
          ...this.state,
          sites: this.state.sites.map(site => {
            if (site.id === siteId) {
              site.products = products;
            }
            return site;
          }),
          error: '',
        });
      },
    };
  }

  componentDidMount() {
    this.setState({
      isLoading: true,
    });
    this.state.retrieveStatus();
  }

  render() {
    const panes = [
      {
        menuItem: 'Sites',
        render: () => (
          <Tab.Pane>
            <SitesPanel />
          </Tab.Pane>
        ),
      },
      {
        menuItem: 'Products',
        render: () => (
          <Tab.Pane>
            <ProductsPanel />
          </Tab.Pane>
        ),
      },
    ];

    const { error } = this.state;

    return (
      <LookupContext.Provider value={this.state}>
        <div className="App">
          <TopMenuContainer />
          <Container
            style={{
              marginTop: '7em',
            }}
          >
            <Header as="h1"> Plone sites lookup </Header>{' '}
            {error.length ? <span> {error} </span> : <Tab panes={panes} />}{' '}
          </Container>{' '}
        </div>{' '}
      </LookupContext.Provider>
    );
  }
}

export default App;
