// @flow
import React, { Component } from 'react';
import { Item, Label, Segment, Icon, Loader } from 'semantic-ui-react';
import type { Site, AppState } from '../../types';
import ModalContainer from '../../misc/ModalContainer';
import LookupContext from '../../Context/LookupContext';
import SiteProductsOverview from '../SiteProductsOverview';
import { getSiteProducts } from '../../helpers/apiFetcher';

type Props = {
  site: Site,
  context: $FlowFixMe,
};

type State = { isFetchingData: boolean };

class SiteWrapper extends Component<Props, State> {
  state = {
    isFetchingData: false,
  };

  componentDidMount() {
    const { site, context } = this.props;
    if (!site || !context) {
      return;
    }
    this.setState({ isFetchingData: true });
    getSiteProducts({ siteId: site.id }).then(data => {
      context.updateSiteProducts({ siteId: site.id, products: data });
      this.setState({ isFetchingData: false });
    });
  }

  render() {
    const { site, context } = this.props;
    const { isFetchingData } = this.state;
    const showUpdate = false;
    const styles = showUpdate
      ? {
          color: showUpdate ? 'orange' : '',
        }
      : {};
    let productsButton = (
      <Label>
        Products {isFetchingData ? <Loader active size="mini" inline /> : ''}
      </Label>
    );
    if (!isFetchingData && site.products) {
      productsButton = (
        <ModalContainer
          buttonLabel="Products"
          labelProps={styles}
          headerLabel={`Products for ${site.title}`}
        >
          <SiteProductsOverview site={site} context={context} />
        </ModalContainer>
      );
    }
    return (
      <LookupContext.Consumer>
        {(context: AppState) => {
          return (
            <Segment {...styles} key={site.id}>
              {showUpdate ? (
                <Label attached="top right" color="orange">
                  <Icon name="warning sign" /> Some products needs an upgrade
                </Label>
              ) : null}
              <Item key={site.id}>
                <Item.Content>
                  <Item.Header as="a">{site.title}</Item.Header>
                  <Item.Extra>
                    {productsButton}
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
        }}
      </LookupContext.Consumer>
    );
  }
}
// const SiteWrapper = ({ site }: Props) => {

export default SiteWrapper;
