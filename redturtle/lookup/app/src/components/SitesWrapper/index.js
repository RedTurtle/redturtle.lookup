// @flow
import React from 'react';
import LookupContext from '../../containers/LookupContext';
import SitesList from '../SitesList';
import { Dimmer, Loader, Segment } from 'semantic-ui-react';
import type { AppState } from '../../types';

type Props = {};

const SitesWrapper = (props: Props) => (
  <Segment basic>
    <LookupContext.Consumer>
      {(context: AppState) => {
        return context.isLoading ? (
          <Dimmer active inverted>
            <Loader>Loading</Loader>
          </Dimmer>
        ) : (
          <SitesList
            onUpdateStatus={context.retrieveStatus}
            sites={context.sites}
          />
        );
      }}
    </LookupContext.Consumer>
  </Segment>
);

export default SitesWrapper;
