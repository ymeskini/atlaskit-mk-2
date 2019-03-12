import * as React from 'react';
import { Messages } from 'react-intl';

import {
  SwitcherWrapper,
  SwitcherItem,
  Section,
  ManageButton,
  Skeleton,
  ExpandLink,
} from '../primitives';
import {
  getLicensedProductLinks,
  getAdministrationLinks,
  getCustomLinkItems,
  getRecentLinkItems,
  SuggestedProductItemType,
  getFixedProductLinks,
} from '../utils/links';
import { ChildrenProps } from '../providers/as-data-provider';

import {
  CustomLinksProviderDataStructure,
  LicenseInformationDataStructure,
} from '../providers/types';
import { RecentContainersDataStructure } from '../providers/instance-data-providers';
import {
  analyticsAttributes,
  NavigationAnalyticsContext,
  SWITCHER_SUBJECT,
  RenderTracker,
} from '../utils/analytics';
import now from '../utils/performance-now';
import FormattedMessage from '../primitives/formatted-message';
import TryLozenge from '../primitives/try-lozenge';
import { FeatureFlagProps } from '../types';

type SwitcherProps = {
  cloudId: string;
  triggerXFlow: (productKey: string, sourceComponent: string) => void;
  messages: Messages;
  enableUchiLink: boolean;
  customLinks: ChildrenProps<CustomLinksProviderDataStructure>;
  suggestedProductLink: SuggestedProductItemType;
  recentContainers: ChildrenProps<RecentContainersDataStructure>;
  licenseInformation: ChildrenProps<LicenseInformationDataStructure>;
  managePermission: ChildrenProps<boolean>;
  addProductsPermission: ChildrenProps<boolean>;
  isXFlowEnabled: ChildrenProps<boolean>;
} & FeatureFlagProps;

const getAnalyticsContext = (itemsCount: number) => ({
  ...analyticsAttributes({
    itemsCount,
  }),
});

const getItemAnalyticsContext = (
  index: number,
  id: string | null,
  type: string,
) => ({
  ...analyticsAttributes({
    groupItemIndex: index,
    itemId: id,
    itemType: type,
  }),
});

export default class Switcher extends React.Component<SwitcherProps> {
  mountedAt?: number;

  componentDidMount() {
    this.mountedAt = now();
  }

  timeSinceMounted() {
    return Math.round(now() - this.mountedAt!);
  }

  triggerXFlow = () => {
    const { triggerXFlow, suggestedProductLink } = this.props;
    if (suggestedProductLink) {
      triggerXFlow(suggestedProductLink.key, 'atlassian-switcher');
    }
  };

  getExpandHref = (hostname: string) => {
    const isStagingInstance = hostname.indexOf('.jira-dev.com') !== -1;
    return `//start.${isStagingInstance ? 'stg.' : ''}atlassian.com`;
  };

  render() {
    const {
      cloudId,
      enableSplitJira,
      suggestedProductLink,
      messages,
      enableUchiLink,
      customLinks: { isLoading: isLoadingCustomLinks, data: customLinksData },
      recentContainers: {
        isLoading: isLoadingRecentContainers,
        data: recentContainersData,
      },
      licenseInformation: {
        isLoading: isLoadingLicenseInformation,
        data: licenseInformationData,
      },
      managePermission: {
        isLoading: isLoadingManagePermission,
        data: managePermissionData,
      },
      addProductsPermission: {
        isLoading: isLoadingAddProductsPermission,
        data: addProductsPermissionData,
      },
      isXFlowEnabled: {
        isLoading: isLoadingIsXFlowEnabled,
        data: isXFlowEnabledData,
      },
    } = this.props;

    const isLoading =
      isLoadingCustomLinks ||
      isLoadingRecentContainers ||
      isLoadingLicenseInformation ||
      isLoadingManagePermission ||
      isLoadingAddProductsPermission ||
      isLoadingIsXFlowEnabled;

    if (isLoading) {
      return <Skeleton />;
    }

    const isAdmin = managePermissionData;
    const hasAdminLinks = managePermissionData || addProductsPermissionData;
    const hasSuggestedLinks = !!(isXFlowEnabledData && suggestedProductLink);
    const shouldShowManageListButton =
      isAdmin && customLinksData && customLinksData[0];

    const fixedProductLinks = getFixedProductLinks();
    const licensedProductLinks = getLicensedProductLinks(
      licenseInformationData!,
      enableSplitJira,
    );

    const adminLinks = hasAdminLinks
      ? getAdministrationLinks(cloudId, managePermissionData!)
      : [];

    const suggestedLinks = hasSuggestedLinks ? [suggestedProductLink!] : [];
    const recentLinks = getRecentLinkItems(recentContainersData!.data);
    const customLinks = customLinksData
      ? getCustomLinkItems(customLinksData[0], licenseInformationData!)
      : [];

    /**
     * It is essential that switchToLinks reflects the order corresponding nav items
     * are rendered below in the 'Switch to' section.
     */
    const switchToLinks = [
      ...licensedProductLinks,
      ...suggestedLinks,
      ...fixedProductLinks,
      ...adminLinks,
    ];

    const itemsCount =
      switchToLinks.length + recentLinks.length + customLinks.length;

    return (
      <NavigationAnalyticsContext data={getAnalyticsContext(itemsCount)}>
        <SwitcherWrapper>
          <RenderTracker
            subject={SWITCHER_SUBJECT}
            data={{ duration: this.timeSinceMounted() }}
          />
          <Section
            sectionId="switchTo"
            title={
              enableUchiLink ? (
                <ExpandLink
                  href={this.getExpandHref(licenseInformationData!.hostname)}
                  title={<FormattedMessage {...messages.switchTo} />}
                />
              ) : (
                <FormattedMessage {...messages.switchTo} />
              )
            }
          >
            {licensedProductLinks.map(item => (
              <NavigationAnalyticsContext
                key={item.key}
                data={getItemAnalyticsContext(
                  switchToLinks.indexOf(item),
                  item.key,
                  'product',
                )}
              >
                <SwitcherItem
                  icon={<item.Icon theme="product" />}
                  href={item.href}
                >
                  {item.label}
                </SwitcherItem>
              </NavigationAnalyticsContext>
            ))}
            {suggestedLinks.map(item => (
              <NavigationAnalyticsContext
                key={item.key}
                data={getItemAnalyticsContext(
                  switchToLinks.indexOf(item),
                  item.key,
                  'try',
                )}
              >
                <SwitcherItem
                  icon={<item.Icon theme="product" />}
                  onClick={this.triggerXFlow}
                >
                  {item.label}
                  <TryLozenge>
                    <FormattedMessage {...messages.try} />
                  </TryLozenge>
                </SwitcherItem>
              </NavigationAnalyticsContext>
            ))}
            {fixedProductLinks.map(item => (
              <NavigationAnalyticsContext
                key={item.key}
                data={getItemAnalyticsContext(
                  switchToLinks.indexOf(item),
                  item.key,
                  'product',
                )}
              >
                <SwitcherItem
                  icon={<item.Icon theme="product" />}
                  href={item.href}
                >
                  {item.label}
                </SwitcherItem>
              </NavigationAnalyticsContext>
            ))}
            {adminLinks.map(item => (
              <NavigationAnalyticsContext
                key={item.key}
                data={getItemAnalyticsContext(
                  switchToLinks.indexOf(item),
                  item.key,
                  'admin',
                )}
              >
                <SwitcherItem
                  icon={<item.Icon theme="admin" />}
                  href={item.href}
                >
                  {item.label}
                </SwitcherItem>
              </NavigationAnalyticsContext>
            ))}
          </Section>
          <Section
            sectionId="recent"
            title={<FormattedMessage {...messages.recent} />}
          >
            {recentLinks.map(
              ({ key, label, href, type, description, Icon }, idx) => (
                <NavigationAnalyticsContext
                  key={key}
                  data={getItemAnalyticsContext(idx, type, 'recent')}
                >
                  <SwitcherItem
                    icon={<Icon theme="recent" />}
                    description={description}
                    href={href}
                  >
                    {label}
                  </SwitcherItem>
                </NavigationAnalyticsContext>
              ),
            )}
          </Section>
          <Section
            sectionId="customLinks"
            title={<FormattedMessage {...messages.more} />}
          >
            {customLinks.map(({ label, href, Icon }, idx) => (
              // todo: id in SwitcherItem should be consumed from custom link resolver
              <NavigationAnalyticsContext
                key={idx + '.' + label}
                data={getItemAnalyticsContext(idx, null, 'customLink')}
              >
                <SwitcherItem icon={<Icon theme="custom" />} href={href}>
                  {label}
                </SwitcherItem>
              </NavigationAnalyticsContext>
            ))}
          </Section>
          {shouldShowManageListButton && (
            <ManageButton href={customLinksData![1]} />
          )}
        </SwitcherWrapper>
      </NavigationAnalyticsContext>
    );
  }
}
