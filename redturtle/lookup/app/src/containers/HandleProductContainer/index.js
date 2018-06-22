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
} from 'semantic-ui-react';
import { handleProduct } from '../../helpers/apiFetcher';

type State = {
  inProgress: boolean,
  error: string,
};

type Props = {
  siteId: $PropertyType<Site, 'id'>,
  product: Product,
  onUpdateStatus: () => void,
};

class HandleProductContainer extends Component<Props, State> {
  state = {
    inProgress: false,
    error: '',
  };

  onHandleProduct = ({ action }: { action: string }) => {
    const { siteId, product, onUpdateStatus } = this.props;
    this.setState({ inProgress: true, error: '' });
    return handleProduct({ siteId, productId: product.id, action })
      .then(result => {
        this.setState({
          ...this.state,
          inProgress: false,
          error: result.ok ? '' : result.msg,
        });
        onUpdateStatus();
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
        {errorMessage}
        {inProgress ? (
          <Dimmer active>
            <Loader />
          </Dimmer>
        ) : null}
        <List.Content floated="right">
          {is_installed ? (
            <Button
              onClick={() => this.onHandleProduct({ action: 'uninstall' })}
            >
              Uninstall
            </Button>
          ) : (
            <Button onClick={() => this.onHandleProduct({ action: 'install' })}>
              Install
            </Button>
          )}
          {needUpgrade ? (
            <Button onClick={() => this.onHandleProduct({ action: 'upgrade' })}>
              Upgrade
            </Button>
          ) : null}
        </List.Content>
        {needUpgrade ? (
          <Label color="red">
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
      </List.Item>
    );
  }
}

export default HandleProductContainer;
