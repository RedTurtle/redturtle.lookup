// @flow
import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Header } from 'semantic-ui-react';
import TopMenuContainer from './containers/TopMenuContainer';
import { Container } from 'semantic-ui-react';
import LookupContext from './containers/LookupContext';
import fetchApi from './helpers/apiFetcher';

type Product = {
  description: string,
  profile_type: string,
  title: string,
  upgrade_info: {
    available: boolean,
    installedVersion: string,
    required: boolean,
    newVersion: string,
    hasProfile: boolean,
  },
  install_profile_id: string,
  version: string,
  uninstall_profile_id: string,
  is_installed: boolean,
  id: string,
};

type Site = {
  available: Array<Product>,
  installed: Array<Product>,
  outdated: Array<Product>,
  id: string,
  title: string,
};

type State = {
  products: Array<Product>,
  sites: Array<Site>,
  isLoading: boolean,
};
type Props = {};

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      products: [],
      sites: [],
      isLoading: false,
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    fetchApi({ route: 'status' }).then(data => {
      this.setState({ ...this.state, ...data, isLoading: false });
    });
  }

  render() {
    return (
      <LookupContext.Provider value={this.state}>
        <div className="App">
          <TopMenuContainer />
          <Container style={{ marginTop: '7em' }}>
            <Header as="h1"> Plone sites lookup </Header>
          </Container>
        </div>
      </LookupContext.Provider>
    );
  }
}

export default App;
