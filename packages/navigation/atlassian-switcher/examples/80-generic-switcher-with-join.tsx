import * as React from 'react';
import Button from '@atlaskit/button';
import Drawer from '@atlaskit/drawer';
import { mockEndpoints } from '@atlaskit/atlassian-switcher-test-utils';
import { withAnalyticsLogger, withIntlProvider } from './helpers';
import AtlassianSwitcher from '../src';
import {
  createJoinableSitesProvider,
  defaultJoinableSitesFetch,
} from '../src/index';

const onJoinableSiteClicked = (returnUrl?: string) => {
  console.log('joinable site clicked');
};

const joinableSitesDataProvider = createJoinableSitesProvider(
  defaultJoinableSitesFetch('/gateway/api'),
);

class GenericSwitcherWithJoinExample extends React.Component {
  state = {
    isDrawerOpen: false,
  };

  componentDidMount() {
    this.openDrawer();
  }

  openDrawer = () => {
    mockEndpoints('confluence', originalMockData => originalMockData, {
      containers: 1000,
      xflow: 500,
      permitted: 2000,
      appswitcher: 1500,
    });
    this.setState({
      isDrawerOpen: true,
    });
  };

  onClose = () => {
    this.setState({
      isDrawerOpen: false,
    });
  };

  onTriggerXFlow = (productKey: string, sourceComponent: string) => {
    console.log(
      `Triggering xflow for => ${productKey} from ${sourceComponent}`,
    );
  };

  render() {
    return (
      <div style={{ padding: '2rem' }}>
        <Drawer onClose={this.onClose} isOpen={this.state.isDrawerOpen}>
          <AtlassianSwitcher
            product="generic-product"
            cloudId="some-cloud-id"
            joinableSitesDataProvider={joinableSitesDataProvider}
            onJoinableSiteClicked={onJoinableSiteClicked}
          />
        </Drawer>
        <Button type="button" onClick={this.openDrawer}>
          Open drawer
        </Button>
      </div>
    );
  }
}

export default withIntlProvider(
  withAnalyticsLogger(GenericSwitcherWithJoinExample),
);
