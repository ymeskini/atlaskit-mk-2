// @flow

import React, { Component } from 'react';
import DatePickerStateless from './DatePickerStateless';
import type { Handler } from '../types';
import { parseDate } from '../util';

type Props = {
  isDisabled: boolean,
  disabled: Array<string>,
  onChange: Handler,
};

type State = {
  value: ?string,
  displayValue: string,
  isOpen: boolean,
};

export default class DatePicker extends Component<Props, State> {
  props: Props;
  datepicker: any;

  static defaultProps = {
    isDisabled: false,
    disabled: [],
    onChange() {},
  }

  state = {
    value: null,
    displayValue: '',
    isOpen: false,
  };

  onChange = (value: string) => {
    if (value !== this.state.value) {
      this.props.onChange(value);
    }
  }

  handleInputBlur = (e: FocusEvent) => {
    if (e.target instanceof HTMLInputElement) {
      const date = e.target.value;

      const parsedDate = parseDate(date);

      if (parsedDate) {
        this.onChange(parsedDate.value);
        this.setState({
          value: parsedDate.value,
          displayValue: parsedDate.display,
        });
      } else {
        // TODO: Display error message for invalid date.
        this.setState({
          value: null,
          displayValue: '',
        });
      }
    }
  }

  handleInputChange = (e: Event) => {
    if (e.target instanceof HTMLInputElement) {
      this.setState({ displayValue: e.target.value });
    }
  }

  handleTriggerOpen = () => {
    this.setState({ isOpen: true });
  }

  handleTriggerClose = () => {
    this.setState({ isOpen: false });
    this.selectField();
  }

  handleIconClick = () => {
    if (this.state.isOpen) {
      this.setState({ isOpen: false });
      this.selectField();
    } else {
      this.setState({ isOpen: true });
    }
  }

  handlePickerBlur = () => {
    this.setState({ isOpen: false });
  }

  handleUpdate = (iso: string) => {
    const parsedDate = parseDate(iso);
    if (parsedDate) {
      this.onChange(parsedDate.value);
      this.setState({
        isOpen: false,
        displayValue: parsedDate.display,
        value: parsedDate.value,
      });
      this.selectField();
    }
  }

  selectField() {
    if (this.datepicker) {
      this.datepicker.selectField();
    }
  }

  render() {
    return (
      <DatePickerStateless
        isDisabled={this.props.isDisabled}
        isOpen={this.state.isOpen}
        shouldShowIcon
        displayValue={this.state.displayValue}
        value={this.state.value}
        disabled={this.props.disabled}

        onFieldBlur={this.handleInputBlur}
        onFieldChange={this.handleInputChange}
        onFieldTriggerOpen={this.handleTriggerOpen}
        onIconClick={this.handleIconClick}
        onPickerBlur={this.handlePickerBlur}
        onPickerTriggerClose={this.handleTriggerClose}
        onPickerUpdate={this.handleUpdate}

        ref={ref => { this.datepicker = ref; }}
      />
    );
  }
}
