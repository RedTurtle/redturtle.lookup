// @flow
import React from 'react';
import LookupContext from '../../Context/LookupContext';
import ProductWrapper from '../ProductWrapper';
import { Dimmer, Loader, Segment, Item } from 'semantic-ui-react';
import type { AppState } from '../../types';

type Props = {};

const ProductsPanel = (props: Props) => (
  <Segment basic>
    <LookupContext.Consumer>
      {(context: AppState) => {
        return context.isLoading ? (
          <Dimmer active inverted>
            <Loader>Loading</Loader>
          </Dimmer>
        ) : (
          <Item.Group divided>
            {context.products.map((product, index) => (
              <ProductWrapper key={index} product={product} context={context} />
            ))}
          </Item.Group>
        );
      }}
    </LookupContext.Consumer>
  </Segment>
);

export default ProductsPanel;
