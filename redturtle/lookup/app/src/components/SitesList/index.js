// @flow
import React from 'react';
import { Item, Label, List, Segment, Icon } from 'semantic-ui-react';
import type { AppState } from '../../types';
import HandleProductContainer from '../../containers/HandleProductContainer';
import ModalContainer from '../../containers/ModalContainer';
import SiteProductsOverview from '../SiteProductsOverview';

type Props = {
  sites: $PropertyType<AppState, 'sites'>,
  onUpdateStatus: () => void,
};

const SitesList = ({ sites, onUpdateStatus }: Props) => {
  const siteItems =
    sites && sites.length === 0
      ? null
      : sites.map(site => {
          const { outdated } = site.products;
          const showUpdate = outdated && outdated.length > 0;
          const styles = showUpdate
            ? {
                color: showUpdate ? 'red' : '',
              }
            : {};
          let productsModal = (
            <ModalContainer label="Products" labelProps={styles}>
              <SiteProductsOverview
                site={site}
                onUpdateStatus={onUpdateStatus}
              />
            </ModalContainer>
          );

          return (
            <Segment {...styles} key={site.id}>
              {showUpdate ? (
                <Label attached="top right" color="red">
                  <Icon name="warning sign" /> Some products needs an upgrade
                </Label>
              ) : null}
              <Item key={site.id}>
                <Item.Content>
                  <Item.Header as="a">{site.title}</Item.Header>
                  <Item.Extra>
                    {productsModal}
                    <Label as="a" target="_blank" href={`${site.url}`}>
                      Homepage
                    </Label>
                    <Label as="a" target="_blank" href={`${site.url}/manage`}>
                      ZMI
                    </Label>
                  </Item.Extra>
                </Item.Content>
              </Item>
            </Segment>
          );
        });

  return <Item.Group divided>{siteItems}</Item.Group>;
};

export default SitesList;
