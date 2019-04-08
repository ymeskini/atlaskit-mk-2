import { ErrorMessage, Field, HelperMessage } from '@atlaskit/form';
import UserPicker, {
  LoadOptions,
  OptionData,
  Value,
} from '@atlaskit/user-picker';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { messages } from '../i18n';
import { ConfigResponse, FieldChildrenArgs } from '../types';
import {
  allowEmails,
  isValidEmailUsingConfig,
  showInviteWarning,
} from './utils';

export const REQUIRED = 'REQUIRED';
const validate = (value: OptionData[]) =>
  value && value.length > 0 ? undefined : REQUIRED;

export type Props = {
  loadOptions?: LoadOptions;
  defaultValue?: OptionData[];
  config?: ConfigResponse;
  capabilitiesInfoMessage?: React.ReactNode;
};

const noOptionsMessageProps = (inputValue?: string) =>
  inputValue && inputValue.length > 0
    ? messages.userPickerNoOptionsMessage
    : messages.userPickerNoOptionsMessageEmptyQuery;

const getNoOptionsMessage = ({
  inputValue,
}: {
  inputValue: string;
}): any | null =>
  inputValue && inputValue.trim().length > 0
    ? ((
        <FormattedMessage
          {...noOptionsMessageProps(inputValue)}
          values={{ inputValue }}
        />
      ) as any)
    : null;

export const UserPickerField: React.StatelessComponent<Props> = props => (
  <Field name="users" validate={validate} defaultValue={props.defaultValue}>
    {({ fieldProps, error, meta: { valid } }: FieldChildrenArgs<Value>) => (
      <>
        <FormattedMessage {...messages.userPickerAddMoreMessage}>
          {addMore => (
            <UserPicker
              {...fieldProps}
              fieldId="share"
              loadOptions={props.loadOptions}
              isMulti
              width="100%"
              placeholder={
                <FormattedMessage {...messages.userPickerPlaceholder} />
              }
              addMoreMessage={addMore as string}
              allowEmail={allowEmails(props.config)}
              isValidEmail={isValidEmailUsingConfig(props.config)}
              noOptionsMessage={getNoOptionsMessage}
            />
          )}
        </FormattedMessage>
        {showInviteWarning(props.config, fieldProps.value) && (
          <HelperMessage>
            {props.capabilitiesInfoMessage || (
              <FormattedMessage {...messages.capabilitiesInfoMessage} />
            )}
          </HelperMessage>
        )}
        {!valid && error === REQUIRED && (
          <ErrorMessage>
            <FormattedMessage {...messages.userPickerRequiredMessage} />
          </ErrorMessage>
        )}
      </>
    )}
  </Field>
);
