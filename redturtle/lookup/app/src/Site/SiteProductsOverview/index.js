// @flow
import React from 'react';
import { List } from 'semantic-ui-react';
import type { Site } from '../../types';
import HandleProductContainer from '../HandleProductContainer';

type Props = {
  site: Site,
  context: $FlowFixMe,
};

const SiteProductsOverview = ({ site, context }: Props) => {
  if (!site) {
    return '';
  }
  const { installed, outdated, available } = site.products;
  const installedProducts = installed.filter(
    product =>
      product.upgrade_info.available ? !product.upgrade_info.available : true,
  );
  return (
    <div className="site-products">
      {outdated.length ? (
        <React.Fragment>
          <h3 className="ui header">Outated</h3>
          <List divided relaxed>
            {outdated.map(product => (
              <HandleProductContainer
                key={product.id}
                siteId={site.id}
                product={product}
                updateSiteProducts={context.updateSiteProducts}
              />
            ))}
          </List>
        </React.Fragment>
      ) : null}

      <h3 className="ui header">Available</h3>
      <List divided relaxed>
        {available.map(product => (
          <HandleProductContainer
            key={product.id}
            siteId={site.id}
            product={product}
            updateSiteProducts={context.updateSiteProducts}
          />
        ))}
      </List>
      {installedProducts.length > 0 ? (
        <React.Fragment>
          <h3 className="ui header">Installed</h3>
          <List divided relaxed>
            {installed.map(product => (
              <HandleProductContainer
                key={product.id}
                siteId={site.id}
                product={product}
                updateSiteProducts={context.updateSiteProducts}
              />
            ))}
          </List>
        </React.Fragment>
      ) : null}
    </div>
  );
};

export default SiteProductsOverview;
