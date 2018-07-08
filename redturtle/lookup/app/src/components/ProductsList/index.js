// @flow
import React from 'react';
import { Item, Label, Segment } from 'semantic-ui-react';
import type { AppState } from '../../types';
import ModalContainer from '../../containers/ModalContainer';
import SitesOverview from '../SitesOverview';

type Props = {
  products: $PropertyType<AppState, 'products'>,
  sites: $PropertyType<AppState, 'sites'>,
  onUpdateStatus: () => void,
};

const ProductsList = ({ products, sites, onUpdateStatus }: Props) => {
  const productItems =
    products && products.length === 0
      ? null
      : products.map(product => {
          const installedStatus = sites.reduce(
            (status, site) => {
              const isInstalled = site.products.installed.reduce(
                (flag, checkProduct) => {
                  if (flag) {
                    return flag;
                  }
                  return product.id === checkProduct.id;
                },
                false,
              );
              isInstalled
                ? status.installed.push(site.id)
                : status.notInstalled.push(site.id);
              return status;
            },
            { installed: [], notInstalled: [] },
          );

          const sitesModal = (
            <ModalContainer
              buttonLabel={`Installed on ${installedStatus.installed.length}/${
                sites.length
              } sites`}
              headerLabel={product.title}
            >
              <SitesOverview
                {...{ product, sites, installedStatus, onUpdateStatus }}
              />
            </ModalContainer>
          );

          return (
            <Segment key={product.id}>
              <Item key={product.id}>
                <Item.Content>
                  <Item.Header as="a">
                    {product.title}{' '}
                    <Label size="mini" basic>
                      {product.version}
                    </Label>
                  </Item.Header>
                  <Item.Extra>{product.description}</Item.Extra>
                  <Item.Extra>{sitesModal}</Item.Extra>
                </Item.Content>
              </Item>
            </Segment>
          );
        });

  return <Item.Group divided>{productItems}</Item.Group>;
};

export default ProductsList;
