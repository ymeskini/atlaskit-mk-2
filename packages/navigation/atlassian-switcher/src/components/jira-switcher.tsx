import React from 'react';
import { Messages } from 'react-intl';
import Switcher from './switcher';
import {
  CustomLinksProvider,
  MANAGE_HREF,
} from '../providers/jira-data-providers';
import CommonDataProvider from '../providers/common-data-provider';
import { resolveSwitcherLinks } from '../providers/resolve-switcher-links';
import { FeatureFlagProps } from '../types';

type JiraSwitcherProps = {
  cloudId: string;
  messages: Messages;
  triggerXFlow: (productKey: string, sourceComponent: string) => void;
} & FeatureFlagProps;

export default (props: JiraSwitcherProps) => (
  <CustomLinksProvider>
    {customLinks => (
      <CommonDataProvider cloudId={props.cloudId}>
        {providerResults => {
          const { showManageLink, ...switcherLinks } = resolveSwitcherLinks(
            props.cloudId,
            { customLinks, ...providerResults },
            { xflow: true, enableSplitJira: props.enableSplitJira },
          );

          return (
            <Switcher
              {...props}
              {...switcherLinks}
              manageLink={showManageLink ? MANAGE_HREF : undefined}
            />
          );
        }}
      </CommonDataProvider>
    )}
  </CustomLinksProvider>
);
