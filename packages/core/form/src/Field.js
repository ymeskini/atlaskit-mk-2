// @flow
import React, { type Node } from 'react';
import { type FieldState, type FieldSubscription } from 'final-form';
import { FormContext, IsDisabledContext } from './Form';
import FieldWrapper, { Label, RequiredIndicator } from './styled/Field';
import translateEvent from './utils/translateEvent';

type FieldProps = {
  isRequired: boolean,
  isInvalid: boolean,
  onChange: any => any,
  onBlur: () => any,
  onFocus: () => any,
  value: any,
};

type Meta = {
  dirty: boolean,
  touched: boolean,
  valid: boolean,
  error: any,
  submitError: any,
};

type Props = {
  /* Children to render in the field. Called with form information. */
  children: ({ fieldProps: FieldProps, error: any, meta: Meta }) => Node,
  /* The default value of the field */
  defaultValue: any,
  /* Whether the field is required for submission */
  isRequired?: boolean,
  /* Whether the field is disabled. Internal prop - gets set through context. */
  isDisabled: boolean,
  /* Label displayed above the field */
  label?: Node,
  /* The name of the field */
  name: string,
  /* Register the Field with the Form. Internal prop - gets set through context. */
  registerField: (
    string,
    any,
    (FieldState) => any,
    FieldSubscription,
    Object,
  ) => any,
  /* validates the current value of field */
  validate?: any => string | void | Promise<string | void>,
};

type State = {
  onChange: any => any,
  onBlur: () => any,
  onFocus: () => any,
  dirty: boolean,
  touched: boolean,
  valid: boolean,
  value: any,
  error: any,
  submitError: any,
  registered: boolean,
};

class FieldInner extends React.Component<Props, State> {
  unregisterField = () => {};
  state = {
    onChange: () => {},
    onBlur: () => {},
    onFocus: () => {},
    dirty: false,
    touched: false,
    valid: true,
    value: undefined,
    error: undefined,
    submitError: undefined,
    registered: false,
  };

  register = () => {
    const { defaultValue, name, registerField, validate } = this.props;
    return registerField(
      name,
      defaultValue,
      ({
        change,
        blur,
        focus,
        dirty,
        touched,
        valid,
        value,
        error,
        submitError,
      }) => {
        this.setState({
          registered: true,
          onChange: translateEvent(change),
          onBlur: blur,
          onFocus: focus,
          dirty,
          touched,
          valid,
          value,
          error,
          submitError,
        });
      },
      {
        dirty: true,
        touched: true,
        valid: true,
        value: true,
        error: true,
        submitError: true,
      },
      {
        getValidator: () => validate,
      },
    );
  };

  componentDidUpdate(prevProps: Props) {
    const { defaultValue, name } = this.props;
    if (prevProps.defaultValue !== defaultValue || prevProps.name !== name) {
      this.unregisterField();
      this.unregisterField = this.register();
    }
  }

  componentDidMount() {
    this.unregisterField = this.register();
  }

  componentWillUnmount() {
    this.unregisterField();
  }

  render() {
    const { children, isRequired, isDisabled, label, name } = this.props;
    const {
      registered,
      onChange,
      onBlur,
      onFocus,
      value,
      ...rest
    } = this.state;
    const error =
      rest.submitError || ((rest.touched || rest.dirty) && rest.error);
    const fieldProps = {
      onChange,
      onBlur,
      onFocus,
      value,
      name,
      isDisabled,
      isInvalid: Boolean(error),
      isRequired: Boolean(isRequired),
    };
    return (
      <FieldWrapper>
        {label && (
          <Label htmlFor={name}>
            {label}
            {isRequired && (
              <RequiredIndicator role="presentation">*</RequiredIndicator>
            )}
          </Label>
        )}
        {registered && children({ fieldProps, error, meta: rest })}
      </FieldWrapper>
    );
  }
}

// Make it easier to reference context value in lifecycle methods
const Field = (props: Props) => (
  <FormContext.Consumer>
    {registerField => (
      <IsDisabledContext.Consumer>
        {isDisabled => (
          <FieldInner
            {...props}
            registerField={registerField}
            isDisabled={isDisabled}
          />
        )}
      </IsDisabledContext.Consumer>
    )}
  </FormContext.Consumer>
);

Field.defaultProps = {
  defaultValue: undefined,
  isDisabled: false,
  registerField: () => {},
};

export default Field;
