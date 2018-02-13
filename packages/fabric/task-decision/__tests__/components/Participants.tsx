import * as React from 'react';
import { mount } from 'enzyme';
import Avatar, { AvatarGroup } from '@atlaskit/avatar';

import Participants from '../../src/components/Participants';
import { getParticipants } from '../../src/support/test-data';

describe('<Participants/>', () => {
  it('AvatarGroup created with participants', () => {
    const participants = getParticipants(2);
    const component = mount(<Participants participants={participants} />);
    expect(component.find(AvatarGroup).length).toEqual(1);
    const avatars = component.find(Avatar);
    expect(avatars.length).toEqual(2);
    expect(avatars.at(0).prop('src')).toBe(participants[0].avatarUrl);
    expect(avatars.at(0).prop('name')).toBe(participants[0].displayName);
    expect(avatars.at(1).prop('src')).toBe(participants[1].avatarUrl);
    expect(avatars.at(1).prop('name')).toBe(participants[1].displayName);
  });
});
