import React, { ChangeEvent, KeyboardEvent, AllHTMLAttributes } from 'react';

type InputProps = {
  value: string;
  showEditMarker?: boolean;
  onChange: (value: string) => void;
} & Omit<AllHTMLAttributes<HTMLInputElement>, 'onChange'>;

type InputState = {
  displayValue: string;
};

/**
 * Wrapper around `<input>`. Calls `onChange` prop
 * when the input field loose or when the `Enter` key is pressed
 */
class Input extends React.Component<InputProps, InputState> {
  constructor(props: InputProps) {
    super(props);

    this.state = { displayValue: props.value };
  }

  componentWillReceiveProps(props: InputProps) {
    // eslint-disable-next-line eqeqeq
    if (this.state.displayValue != props.value) {
      this.setState({ displayValue: props.value });
    }
  }

  handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ displayValue: e.target.value });
  };

  handleOnKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const { onChange } = this.props;

    if (e.key === 'Enter') {
      onChange(this.state.displayValue);
    }
  };

  handleOnBlur = () => {
    const { onChange, value } = this.props;
    // eslint-disable-next-line eqeqeq
    if (value !== this.state.displayValue) {
      onChange(this.state.displayValue);
    }
  };

  render() {
    const { value, showEditMarker, ...inputProps } = this.props;
    const { displayValue } = this.state;

    const inputElm = (
      <input
        {...inputProps}
        value={displayValue}
        onChange={this.handleOnChange}
        onKeyDown={this.handleOnKeyDown}
        onBlur={this.handleOnBlur}
      />
    );

    if (showEditMarker) {
      return <div>{inputElm}</div>;
    }

    return inputElm;
  }
}

export default Input;
