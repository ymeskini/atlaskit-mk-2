import React, { RefObject } from 'react';

import Button from '@atlaskit/button';
import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
import Tooltip from '@atlaskit/tooltip';
import MentionSpotlightController from './MentionSpotlightController';

import {
  SpotlightTitle,
  SpotlightCloseTooltip,
  SpotlightDescription,
  SpotlightDescriptionLink,
} from '../../util/i18n';
import * as Styled from './styles';

export interface Props {
  createTeamLink?: string;
  /** Callback to track the event where user click on x icon */
  onClose: () => void;
}

export interface State {
  isSpotlightClosed: boolean;
}

const ICON_URL =
  'https://ptc-directory-sited-static.us-east-1.prod.public.atl-paas.net/teams/avatars/2.svg';

export default class MentionSpotlight extends React.Component<Props, State> {
  // Wrap whole dialog so we can catch events, see preventClickOnCard
  elWrapper: RefObject<HTMLDivElement>;
  // Wrap the close button, so we can still manually invoke onClose()
  elCloseWrapper: RefObject<HTMLDivElement>;
  // Wrap the create team link, so we can still manually invoke the analytics
  elCreateTeamWrapper: RefObject<HTMLDivElement>;

  static defaultProps = {
    createTeamLink: '/people/search#createTeam',
  };

  constructor(props: Props) {
    super(props);
    this.elWrapper = React.createRef();
    this.elCloseWrapper = React.createRef();
    this.elCreateTeamWrapper = React.createRef();
    this.state = {
      isSpotlightClosed: false,
    };
  }
  componentDidMount() {
    this.addEventHandler();
    MentionSpotlightController.registerRender();
  }

  componentWillUnmount() {
    this.removeEventHandler();
  }

  onCreateTeamLinkClick = () => {
    this.setState({ isSpotlightClosed: true });
    MentionSpotlightController.registerCreateLinkClick();
  };

  // This is to stop overly aggressive behaviour in tinyMCe editor where clicking anywhere in the spotlight would immediate close the entire
  // dropdown dialog. Note we were unable to test this behaviour in unit-tests, will need to be manually tested.
  // see TEAMS-611
  private preventClickOnCard = (event: any) => {
    // event is a MouseEvent

    // We stop the event from propagating, so we need to manually close
    const isClickOnCloseButton =
      this.elCloseWrapper.current &&
      this.elCloseWrapper.current.contains(event.target);
    if (isClickOnCloseButton) {
      this.onCloseClick();
    }

    // Manually perform on-click for the link, if the link was clicked.
    const isClickCreateTeamLink =
      this.elCreateTeamWrapper.current &&
      this.elCreateTeamWrapper.current.contains(event.target);
    if (isClickCreateTeamLink) {
      this.onCreateTeamLinkClick();
    }

    // Allow default so the link to create team still works, but prevent the rest
    event.stopPropagation();
    event.stopImmediatePropagation();
  };

  private addEventHandler(): void {
    this.elWrapper.current &&
      this.elWrapper.current.addEventListener('click', this.preventClickOnCard);
  }

  private removeEventHandler(): void {
    this.elWrapper.current &&
      this.elWrapper.current.removeEventListener(
        'click',
        this.preventClickOnCard,
      );
  }

  onCloseClick = () => {
    this.setState({ isSpotlightClosed: true });
    this.props.onClose();
  };

  render() {
    const { createTeamLink } = this.props;
    const { isSpotlightClosed } = this.state;

    if (isSpotlightClosed) {
      return null;
    }

    return (
      <div ref={this.elWrapper}>
        <Styled.Card>
          <Styled.Content>
            <Styled.Aside>
              <img src={ICON_URL} height={32} />
            </Styled.Aside>
            <Styled.Section>
              <Styled.Heading>
                <Styled.Title>
                  <SpotlightTitle />
                </Styled.Title>
              </Styled.Heading>
              <Styled.Body>
                <SpotlightDescription>
                  {description => (
                    <div>
                      {description}
                      <div
                        ref={this.elCreateTeamWrapper}
                        style={{ display: 'inline' }}
                      >
                        <SpotlightDescriptionLink>
                          {linkText => (
                            <a href={createTeamLink} target="_blank">
                              {' '}
                              {linkText}
                            </a>
                            // on click fired by preventClickOnCard, not here
                          )}
                        </SpotlightDescriptionLink>
                      </div>
                    </div>
                  )}
                </SpotlightDescription>
              </Styled.Body>
            </Styled.Section>
            <Styled.Actions>
              <div ref={this.elCloseWrapper}>
                <SpotlightCloseTooltip>
                  {tooltip => (
                    <Tooltip content={tooltip} position="bottom">
                      <Button
                        appearance="subtle"
                        iconBefore={
                          <EditorCloseIcon label="Close" size="medium" />
                        }
                        spacing="none"
                        // on click fired by preventClickOnCard, not here
                      />
                    </Tooltip>
                  )}
                </SpotlightCloseTooltip>
              </div>
            </Styled.Actions>
          </Styled.Content>
        </Styled.Card>
      </div>
    );
  }
}
