import * as React from 'react';
import DiscoverFilledGlyph from '@atlaskit/icon/glyph/discover-filled';
import SettingsGlyph from '@atlaskit/icon/glyph/settings';

import {
  ConfluenceIcon,
  JiraSoftwareIcon,
  JiraServiceDeskIcon,
  JiraCoreIcon,
} from '@atlaskit/logo';
import { LicenseInformationResponse } from '../types';
import JiraOpsLogo from './assets/jira-ops-logo';
import PeopleLogo from './assets/people';
import { CustomLink, RecentContainer } from '../types';
import WorldIcon from '@atlaskit/icon/glyph/world';
import { createIcon, createImageIcon, IconType } from './icon-themes';

enum ProductActivationStatus {
  ACTIVE = 'ACTIVE',
  DEACTIVATED = 'DEACTIVATED',
}

enum ProductKey {
  CONFLUENCE = 'confluence.ondemand',
  JIRA_CORE = 'jira-core.ondemand',
  JIRA_SOFTWARE = 'jira-software.ondemand',
  JIRA_SERVICE_DESK = 'jira-servicedesk.ondemand',
  JIRA_OPS = 'jira-incident-manager.ondemand',
}

interface StringDict {
  [index: string]: string;
}

export type SwitcherItemType = {
  key: string;
  label: string;
  Icon: IconType;
  href: string;
};

export type RecentItemType = SwitcherItemType & {
  type: string;
  description: string;
};

export const OBJECT_TYPE_TO_LABEL_MAP: StringDict = {
  'jira-project': 'Jira project',
  'confluence-space': 'Confluence space',
};

export const PRODUCT_DATA_MAP: {
  [productKey: string]: {
    label: string;
    Icon: React.ComponentType<any>;
    href: string;
  };
} = {
  [ProductKey.CONFLUENCE]: {
    label: 'Confluence',
    Icon: createIcon(ConfluenceIcon, { size: 'small' }),
    href: '/wiki',
  },
  [ProductKey.JIRA_CORE]: {
    label: 'Jira Core',
    Icon: createIcon(JiraCoreIcon, { size: 'small' }),
    href: '/secure/BrowseProjects.jspa?selectedProjectType=business',
  },
  [ProductKey.JIRA_SOFTWARE]: {
    label: 'Jira Software',
    Icon: createIcon(JiraSoftwareIcon, { size: 'small' }),
    href: '/secure/BrowseProjects.jspa?selectedProjectType=software',
  },
  [ProductKey.JIRA_SERVICE_DESK]: {
    label: 'Jira Service Desk',
    Icon: createIcon(JiraServiceDeskIcon, { size: 'small' }),
    href: '/secure/BrowseProjects.jspa?selectedProjectType=service_desk',
  },
  [ProductKey.JIRA_OPS]: {
    label: 'Jira Ops',
    Icon: createIcon(JiraOpsLogo, { size: 'small' }),
    href: '/secure/BrowseProjects.jspa?selectedProjectType=ops',
  },
};

export const getObjectTypeLabel = (type: string): string => {
  return OBJECT_TYPE_TO_LABEL_MAP[type] || type;
};

export const getFixedProductLinks = (): SwitcherItemType[] => [
  {
    key: 'people',
    label: 'People',
    Icon: createIcon(PeopleLogo, { size: 'small' }),
    href: `/people`,
  },
];

export const getProductLink = (productKey: string): SwitcherItemType => ({
  key: productKey,
  ...PRODUCT_DATA_MAP[productKey],
});

export const getProductIsActive = (
  { products }: LicenseInformationResponse,
  productKey: string,
): boolean =>
  products.hasOwnProperty(productKey) &&
  products[productKey].state === ProductActivationStatus.ACTIVE;

export const getLicensedProductLinks = (
  licenseInformationData: LicenseInformationResponse,
): SwitcherItemType[] => {
  return [
    ProductKey.JIRA_SOFTWARE,
    ProductKey.JIRA_SERVICE_DESK,
    ProductKey.JIRA_CORE,
    ProductKey.JIRA_OPS,
    ProductKey.CONFLUENCE,
  ]
    .filter((productKey: string) =>
      getProductIsActive(licenseInformationData, productKey),
    )
    .map((productKey: string) => getProductLink(productKey));
};

export const getAdministrationLinks = (
  cloudId: string,
  isAdmin: boolean,
): SwitcherItemType[] => {
  const adminBaseUrl = isAdmin ? `/admin/s/${cloudId}` : '/trusted-admin';
  return [
    {
      key: 'discover-applications',
      label: 'Discover more',
      Icon: createIcon(DiscoverFilledGlyph, { size: 'medium' }),
      href: `${adminBaseUrl}/billing/addapplication`,
    },
    {
      key: 'administration',
      label: 'Administration',
      Icon: createIcon(SettingsGlyph, { size: 'medium' }),
      href: adminBaseUrl,
    },
  ];
};

export const getSuggestedProductLink = (
  licenseInformationData: LicenseInformationResponse,
): SwitcherItemType[] => {
  if (!getProductIsActive(licenseInformationData, ProductKey.CONFLUENCE)) {
    return [getProductLink(ProductKey.CONFLUENCE)];
  }
  if (
    !getProductIsActive(licenseInformationData, ProductKey.JIRA_SERVICE_DESK)
  ) {
    return [getProductLink(ProductKey.JIRA_SERVICE_DESK)];
  }

  return [];
};

export const getCustomLinkItems = (
  list: Array<CustomLink>,
): SwitcherItemType[] =>
  list.map(customLink => ({
    key: customLink.key,
    label: customLink.label,
    Icon: createIcon(WorldIcon),
    href: customLink.link,
  }));

export const getRecentLinkItems = (
  list: Array<RecentContainer>,
): RecentItemType[] =>
  list.map(customLink => ({
    key: customLink.objectId,
    label: customLink.name,
    Icon: createImageIcon(customLink.iconUrl),
    href: customLink.url,
    type: customLink.type,
    description: getObjectTypeLabel(customLink.type),
  }));
