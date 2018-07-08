// @flow
import React from 'react';
import LookupContext from '../../containers/LookupContext';
import ProductsList from '../ProductsList';
import { Dimmer, Loader, Segment } from 'semantic-ui-react';
import type { AppState } from '../../types';

type Props = {};

const ProductsWrapper = (props: Props) => (
  <Segment basic>
    <LookupContext.Consumer>
      {(context: AppState) => {
        return context.isLoading ? (
          <Dimmer active inverted>
            <Loader>Loading</Loader>
          </Dimmer>
        ) : (
          <ProductsList
            onUpdateStatus={context.retrieveStatus}
            products={context.products}
            sites={context.sites}
          />
        );
      }}
    </LookupContext.Consumer>
  </Segment>
);

export default ProductsWrapper;
