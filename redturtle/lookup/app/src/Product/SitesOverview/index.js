// @flow
import React from 'react';
import { List } from 'semantic-ui-react';
import type { Product, AppState } from '../../types';
import HandleProductSiteContainer from '../../containers/HandleProductSiteContainer';

type Props = {
  product: Product,
  installedStatus: {
    installed: Array<string>,
    notInstalled: Array<string>,
  },
  context: $FlowFixMe,
};

const SitesOverview = ({ product, installedStatus, context }: Props) => {
  if (!product) {
    return '';
  }
  const { sites } = context;
  const { installed, notInstalled } = installedStatus;
  return (
    <div className="sites">
      {' '}
      {notInstalled.length ? (
        <React.Fragment>
          <h3 className="ui header"> Not installed in </h3>{' '}
          <List divided relaxed>
            {' '}
            {notInstalled.map(id => {
              const siteProduct = sites.reduce((foundProduct, site) => {
                if (foundProduct) {
                  return foundProduct;
                }
                return site.products.available.reduce((prod, item) => {
                  if (prod) {
                    return prod;
                  }
                  return item.id === product.id ? item : prod;
                }, null);
              }, null);
              return (
                <HandleProductSiteContainer
                  key={id}
                  siteId={id}
                  product={siteProduct}
                  updateSiteProducts={context.updateSiteProducts}
                />
              );
            })}{' '}
          </List>{' '}
        </React.Fragment>
      ) : null}{' '}
      {installed.length ? (
        <React.Fragment>
          <h3 className="ui header"> Installed in </h3>{' '}
          <List divided relaxed>
            {' '}
            {installed.map(id => {
              const siteProduct = sites.reduce((foundProduct, site) => {
                if (foundProduct || site.id !== id) {
                  return foundProduct;
                }
                return site.products.installed.reduce((prod, item) => {
                  if (prod) {
                    return prod;
                  }
                  return item.id === product.id ? item : prod;
                }, null);
              }, null);
              return (
                <HandleProductSiteContainer
                  key={id}
                  siteId={id}
                  product={siteProduct}
                  updateSiteProducts={context.updateSiteProducts}
                />
              );
            })}{' '}
          </List>{' '}
        </React.Fragment>
      ) : null}{' '}
    </div>
  );
};

export default SitesOverview;
