import * as React from 'react';
import { mountWithIntl } from '@atlaskit/editor-test-helpers';
import { noop } from '@babel/types';
import Button from '@atlaskit/button';
import MentionSpotlight, { Props } from '../../../components/MentionSpotlight';
import * as SpotlightAnalytics from '../../../util/analytics';
function render(props: Partial<Props>) {
  return mountWithIntl(
    <MentionSpotlight
      createTeamLink="somelink"
      onClose={() => noop}
      {...props}
    />,
  );
}

let mockRegisterRender = jest.fn();
let mockRegisterCreateLinkClick = jest.fn();
let mockFireAnalyticsSpotlightMentionEvent = jest.fn();
let mockIsSpotlightEnabled = true;

jest.mock(
  '../../../components/MentionSpotlight/MentionSpotlightController',
  () => ({
    __esModule: true,
    default: {
      registerRender: () => mockRegisterRender(),
      registerCreateLinkClick: () => mockRegisterCreateLinkClick(),
      isSpotlightEnabled: () => mockIsSpotlightEnabled,
    },
  }),
);

jest.mock('../../../util/analytics', () => {
  const mockActualAnalytics = require.requireActual('../../../util/analytics');

  return {
    Actions: mockActualAnalytics.Actions,
    ComponentNames: mockActualAnalytics.ComponentNames,
    fireAnalyticsSpotlightMentionEvent: () =>
      mockFireAnalyticsSpotlightMentionEvent,
  };
});

describe('MentionSpotlight', () => {
  beforeEach(() => {
    mockIsSpotlightEnabled = true;
    mockRegisterRender.mockReset();
  });

  it('Should call onCall callback when the x is clicked', () => {
    const onClose = jest.fn();
    const spotlight = render({ onClose: onClose });

    spotlight.find(Button).simulate('click');
    expect(onClose).toHaveBeenCalled();
  });

  it('Should register render on mount', () => {
    render({});
    expect(mockRegisterRender).toHaveBeenCalled();
  });

  it('should not call registerRender if Spotlight Controller asked not to render spotlight', () => {
    mockIsSpotlightEnabled = false;
    render({});
    expect(mockRegisterRender).toHaveBeenCalledTimes(0);
  });

  it('Should register link on click', () => {
    mockRegisterCreateLinkClick = jest.fn();
    const spotlight = render({});

    spotlight.find('a').simulate('click');

    expect(mockRegisterCreateLinkClick).toHaveBeenCalled();
  });

  it('should not show the highlight if the spotlight has been closed by the user', () => {
    const onClose = jest.fn();
    const spotlight = render({ onClose: onClose });
    expect(spotlight.html()).not.toBeNull();
    spotlight.find(Button).simulate('click');
    expect(spotlight.html()).toBeNull();
  });

  it('should send analytics data if the spotlight has been closed by the user', () => {
    const onClose = jest.fn();
    const spotlight = render({ onClose: onClose });
    expect(spotlight.html()).not.toBeNull();
    spotlight.find(Button).simulate('click');
    expect(mockFireAnalyticsSpotlightMentionEvent).toHaveBeenCalledWith(
      SpotlightAnalytics.ComponentNames.SPOTLIGHT,
      SpotlightAnalytics.Actions.CLOSED,
      SpotlightAnalytics.ComponentNames.MENTION,
      'closeButton',
    );
  });

  it('should send analytics data if user clicks on spotlight link', () => {
    const spotlight = render({ onClose: jest.fn() });
    expect(spotlight.html()).not.toBeNull();
    spotlight.find('a').simulate('click');
    expect(mockFireAnalyticsSpotlightMentionEvent).toHaveBeenCalledWith(
      SpotlightAnalytics.ComponentNames.SPOTLIGHT,
      SpotlightAnalytics.Actions.CLICKED,
      SpotlightAnalytics.ComponentNames.MENTION,
      'createTeamLink',
    );
  });

  it('should not show spotlight after re-render if the Spotlight Controller asked not to render it at the first mount', () => {
    mockIsSpotlightEnabled = false;
    const spotlight = render({});

    expect(spotlight.html()).toBeNull();

    // after first render, ask controller to show it
    mockIsSpotlightEnabled = true;

    //should still hide the spotlight after re-render
    spotlight.render();
    expect(spotlight.html()).toBeNull();
  });

  it('should show spotlight after re-render if the Spotlight Controller asked to render it at the first mount', () => {
    const spotlight = render({});

    // Should render in the first time
    expect(spotlight.html()).not.toBeNull();

    //after first render, ask controller to hide it
    mockIsSpotlightEnabled = false;

    //should still show the spotlight after re-render
    spotlight.render();
    expect(spotlight.html()).not.toBeNull();
  });
});
