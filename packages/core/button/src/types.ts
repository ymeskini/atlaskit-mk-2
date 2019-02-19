import * as React from 'react';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next-types';

export type ButtonAppearances =
  | 'default'
  | 'danger'
  | 'link'
  | 'primary'
  | 'subtle'
  | 'subtle-link'
  | 'warning'
  | 'help';

export type ButtonProps = {
  /** The base styling to apply to the button. */
  appearance?: ButtonAppearances;
  /** Add a classname to the button. */
  className?: string;
  /** A custom component to use instead of the default button. */
  component?: React.ComponentType;
  /** Name property of a linked form that the button submits when clicked. */
  form?: string;
  /** Provides a url for buttons being used as a link. */
  href?: string;
  /** Places an icon within the button, after the button's text. */
  iconAfter?: React.ReactChild;
  /** Places an icon within the button, before the button's text. */
  iconBefore?: React.ReactChild;
  /** Pass a reference on to the styled component */
  innerRef?: (element: HTMLElement) => void;
  /** Provide a unique id to the button. */
  id?: string;
  /** Set if the button is disabled. */
  isDisabled: boolean;
  /**
   * Set if the button is loading. When isLoading is true, text is hidden, and
   * a spinner is shown in its place. The button maintains the width that it
   * would have if the text were visible.
   */
  isLoading: boolean;
  /** Change the style to indicate the button is selected. */
  isSelected: boolean;
  /** Handler to be called on blur */
  onBlur?: React.FocusEventHandler<HTMLElement>;
  /** Handler to be called on click. The second argument can be used to track analytics data. See the tutorial in the analytics-next package for details. */
  onClick?: (
    e: React.MouseEvent<HTMLElement>,
    analyticsEvent: UIAnalyticsEvent,
  ) => void;
  onMouseDown?: React.MouseEventHandler<HTMLElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLElement>;
  onMouseUp?: React.MouseEventHandler<HTMLElement>;
  /** Handler to be called on focus */
  onFocus?: React.FocusEventHandler<HTMLElement>;
  /** Set the amount of padding in the button. */
  spacing: 'compact' | 'default' | 'none';
  /** Assign specific tabIndex order to the underlying html button. */
  tabIndex?: number;
  /** Pass target down to a link within the button component, if a href is provided. */
  target?: string;
  /** Set whether it is a button or a form submission. */
  type: 'button' | 'submit' | 'reset';
  /** Option to fit button width to its parent width */
  shouldFitContainer: boolean;
  /** Set the button to autofocus on mount. */
  autoFocus: boolean;
  theme: () => ThemeTokens;
  /** Forward refs */
};

export type DerivedButtonProps = {
  isActive: boolean;
  isFocus: boolean;
  isHover: boolean;
  fit: boolean;
} & ButtonProps;

export type ThemeMode = 'dark' | 'light';

export type ThemeTokens = {};

export type ThemeProps = {
  appearance: string;
  state: string;
  mode?: ThemeMode;
};

export type ButtonThemePropsList = {
  buttonStyles: ButtonThemeProps;
  iconStyles: ButtonThemeProps;
  spinnerStyles: ButtonThemeProps;
};

export interface ButtonThemeProps extends ButtonProps {
  state: string;
  mode?: ThemeMode;
  iconIsOnlyChild?: boolean;
}

export type IconProps = {
  spacing: string;
  styles: any;
  isOnlyChild: boolean;
  isLoading?: boolean;
  icon: React.ReactChild;
};

export type ThemeFallbacks = {
  [index: string]: { [index: string]: string };
};

export type AppearanceStates = {
  default: { light: string; dark?: string };
  hover?: { light: string; dark?: string };
  active?: { light: string; dark?: string };
  disabled?: { light: string; dark?: string };
  selected?: { light: string; dark?: string };
  focusSelected?: { light: string; dark?: string };
};
