import { uid } from 'react-uid';
import React, { Component } from 'react';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import CloseIcon from '@atlaskit/icon/glyph/cross';
import ConfirmIcon from '@atlaskit/icon/glyph/check';
import { name as packageName, version as packageVersion } from './version.json';
import { Handle, IconWrapper, Inner, Input, Label, Slide } from './styled';
import defaultBaseProps from './defaultBaseProps';
import { StatelessProps, DefaultBaseProps } from './types';

type State = {
  // not controlled by props but by browser focus
  isFocused: boolean;
};

interface DefaultProps extends DefaultBaseProps {
  isChecked: boolean;
}

class ToggleStateless extends Component<StatelessProps, State> {
  static defaultProps: DefaultProps = {
    ...defaultBaseProps,
    isChecked: false,
  };

  state: State = {
    isFocused: false,
  };

  handleBlur: React.FocusEventHandler<HTMLInputElement> = event => {
    this.setState({
      isFocused: false,
    });
    this.props.onBlur(event);
  };

  handleFocus: React.FocusEventHandler<HTMLInputElement> = event => {
    this.setState({ isFocused: true });
    this.props.onFocus(event);
  };

  handleChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    if (this.props.isDisabled) {
      return;
    }
    this.props.onChange(event);
  };

  render() {
    const { isChecked, isDisabled, label, name, size, value } = this.props;
    const { isFocused } = this.state;

    const styledProps = {
      isChecked,
      isDisabled,
      isFocused,
      size,
    };
    const Icon = isChecked ? ConfirmIcon : CloseIcon;
    const id = uid({ id: this.constructor.name });

    return (
      <Label htmlFor={id}>
        <Input
          checked={isChecked}
          disabled={isDisabled}
          id={id}
          name={name}
          onBlur={this.handleBlur}
          onChange={this.handleChange}
          onFocus={this.handleFocus}
          type="checkbox"
          value={value}
        />
        <Slide {...styledProps}>
          <Inner {...styledProps}>
            <Handle isChecked={isChecked} isDisabled={isDisabled} size={size} />
            <IconWrapper isChecked={isChecked} size={size}>
              <Icon
                label={label || (isChecked ? 'Uncheck' : 'Check')}
                size={size === 'large' ? undefined : 'small'}
                primaryColor="inherit"
              />
            </IconWrapper>
          </Inner>
        </Slide>
      </Label>
    );
  }
}

export { ToggleStateless as ToggleStatelessWithoutAnalytics };
const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export default withAnalyticsContext({
  componentName: 'toggle',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents({
    onBlur: createAndFireEventOnAtlaskit({
      action: 'blurred',
      actionSubject: 'toggle',

      attributes: {
        componentName: 'toggle',
        packageName,
        packageVersion,
      },
    }),

    onChange: createAndFireEventOnAtlaskit({
      action: 'changed',
      actionSubject: 'toggle',

      attributes: {
        componentName: 'toggle',
        packageName,
        packageVersion,
      },
    }),

    onFocus: createAndFireEventOnAtlaskit({
      action: 'focused',
      actionSubject: 'toggle',

      attributes: {
        componentName: 'toggle',
        packageName,
        packageVersion,
      },
    }),
  })(ToggleStateless),
);
