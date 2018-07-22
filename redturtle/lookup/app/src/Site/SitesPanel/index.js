// @flow
import React from 'react';
import LookupContext from '../../Context/LookupContext';
import SiteWrapper from '../SiteWrapper';
import { Dimmer, Loader, Segment, Item } from 'semantic-ui-react';
import type { AppState } from '../../types';

type Props = {};

const SitesPanel = (props: Props) => (
  <Segment basic>
    <LookupContext.Consumer>
      {(context: AppState) => {
        return context.isLoading ? (
          <Dimmer active inverted>
            <Loader>Loading</Loader>
          </Dimmer>
        ) : (
          <Item.Group divided>
            {context.sites.map((site, index) => (
              <SiteWrapper key={index} site={site} context={context} />
            ))}
          </Item.Group>
        );
      }}
    </LookupContext.Consumer>
  </Segment>
);

export default SitesPanel;
