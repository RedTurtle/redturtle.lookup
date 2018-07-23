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
  Segment,
  Loader,
} from 'semantic-ui-react';
import { handleProduct, getSiteProducts } from '../../helpers/apiFetcher';

type State = {
  inProgress: boolean,
  error: string,
};

type Props = {
  siteId: $PropertyType<Site, 'id'>,
  product: Product,
  updateSiteProducts: ({ siteId: string, products: any }) => void,
};

class HandleProductContainer extends Component<Props, State> {
  state = {
    inProgress: false,
    error: '',
  };

  handleButtonAction = ({ action }: { action: string }) => {
    const { siteId, product, updateSiteProducts } = this.props;
    this.setState({ inProgress: true, error: '' });
    handleProduct({ siteId, productId: product.id, action })
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
        return;
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
    const { product } = this.props;
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
                onClick={() => this.handleButtonAction({ action: 'upgrade' })}
              >
                Upgrade
              </Button>
            ) : null}
            {is_installed ? (
              <Button
                color="red"
                onClick={() => this.handleButtonAction({ action: 'uninstall' })}
              >
                Uninstall
              </Button>
            ) : (
              <Button
                color="grey"
                onClick={() => this.handleButtonAction({ action: 'install' })}
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
            <List.Header>{product.title}</List.Header>

            <List.Description>
              <span>{product.description}</span>
            </List.Description>
          </List.Content>
        </Segment>
      </List.Item>
    );
  }
}

export default HandleProductContainer;
