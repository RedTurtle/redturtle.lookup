// @flow
import React, { Component } from 'react';
import type { Product, Site } from '../../types';
import {
  Dimmer,
  Message,
  List,
  Button,
  Icon,
  Label,
  Loader,
  Segment,
} from 'semantic-ui-react';
import { handleProduct, getSiteProducts } from '../../helpers/apiFetcher';

type State = {
  inProgress: boolean,
  error: string,
};

type Props = {
  siteId: $PropertyType<Site, 'id'>,
  // siteTitle: $PropertyType<Site, 'title'>,
  product: Product,
  updateSiteProducts: ({ siteId: string, products: any }) => void,
};

class HandleProductSiteContainer extends Component<Props, State> {
  state = {
    inProgress: false,
    error: '',
  };

  onHandleProduct = ({ action }: { action: string }) => {
    const { siteId, product, updateSiteProducts } = this.props;
    const productId = product.id;
    this.setState({ inProgress: true, error: '' });
    handleProduct({ siteId, productId, action })
      .then(result => {
        if (result.msg && result.msg.length > 0) {
          this.setState({
            ...this.state,
            inProgress: false,
            error: result.msg,
          });
        } else {
          getSiteProducts({ siteId }).then(products => {
            this.setState({
              ...this.state,
              inProgress: false,
              error: '',
            });
            updateSiteProducts({ siteId, products });
          });
        }
      })
      .catch(e => {
        this.setState({
          ...this.state,
          inProgress: false,
          error:
            'Impossibile aggiornare. Controllare il log degli errori per maggiori dettagli.',
        });
      });
  };

  render() {
    const { siteId, product } = this.props;
    const { inProgress, error } = this.state;
    const { is_installed } = product;
    const needUpgrade = product.upgrade_info.available ? true : false;

    let errorMessage = '';
    if (error.length > 0) {
      errorMessage = (
        <Message negative>
          <Message.Header>Error</Message.Header>
          <p>{error}</p>
        </Message>
      );
    }
    return (
      <List.Item>
        <Segment>
          {errorMessage}
          {inProgress ? (
            <Dimmer active>
              <Loader />
            </Dimmer>
          ) : null}
          <List.Content floated="right">
            {needUpgrade ? (
              <Button
                color="orange"
                onClick={() => this.onHandleProduct({ action: 'upgrade' })}
              >
                Upgrade
              </Button>
            ) : null}
            {is_installed ? (
              <Button
                color="red"
                onClick={() => this.onHandleProduct({ action: 'uninstall' })}
              >
                Uninstall
              </Button>
            ) : (
              <Button
                color="grey"
                onClick={() => this.onHandleProduct({ action: 'install' })}
              >
                Install
              </Button>
            )}
          </List.Content>
          {needUpgrade ? (
            <Label color="orange">
              <Icon name="warning sign" />
              {product.upgrade_info.installedVersion} =>{' '}
              {product.upgrade_info.newVersion}
            </Label>
          ) : null}
          <List.Content>
            <List.Header>{siteId}</List.Header>
          </List.Content>
        </Segment>
      </List.Item>
    );
  }
}

export default HandleProductSiteContainer;
