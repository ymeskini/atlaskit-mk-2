import Button from '@atlaskit/button';
import Form, { FormFooter, FormSection } from '@atlaskit/form';
import { LoadOptions } from '@atlaskit/user-picker';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { messages } from '../i18n';
import { CommentField } from './CommentField';
import { ShareHeader } from './ShareHeader';
import { UserPickerField } from './UserPickerField';
import { CopyLinkButton } from './CopyLinkButton';

const LeftAlignmentContainer = styled.div`
  margin-right: auto;
`;

export type Props = {
  title?: React.ReactNode;
  loadOptions: LoadOptions;
  onLinkCopy?: (link: string) => void;
  onShareClick?: Function;
  shareLink: string;
  submitButtonLabel?: React.ReactNode;
};

export const ShareForm: React.StatelessComponent<Props> = props => (
  <Form onSubmit={props.onShareClick}>
    {({ formProps }) => (
      <form {...formProps}>
        <ShareHeader title={props.title} />
        <FormSection>
          <UserPickerField loadOptions={props.loadOptions} />
          <CommentField />
        </FormSection>
        <FormFooter>
          <LeftAlignmentContainer>
            <CopyLinkButton
              onLinkCopy={props.onLinkCopy}
              shareLink={props.shareLink}
            />
          </LeftAlignmentContainer>
          <Button appearance="primary" type="submit">
            {props.submitButtonLabel || (
              <FormattedMessage {...messages.formSend} />
            )}
          </Button>
        </FormFooter>
      </form>
    )}
  </Form>
);

ShareForm.defaultProps = {
  onShareClick: () => {},
};
