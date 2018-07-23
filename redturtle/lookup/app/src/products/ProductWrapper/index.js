// @flow
import React from 'react';
import { Item, Label, Segment } from 'semantic-ui-react';
import type { Product } from '../../types';
import ModalContainer from '../../misc/ModalContainer';
import SitesOverview from '../SitesOverview';

type Props = {
  product: Product,
  context: $FlowFixMe,
};

const ProductWrapper = ({ product, context }: Props) => {
  const { sites } = context;
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
      <SitesOverview {...{ product, installedStatus, context }} />
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
};

export default ProductWrapper;
