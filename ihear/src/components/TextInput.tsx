import React from 'react';
import classnames from 'classnames';
import * as theme from './theme';
import css from 'styled-jsx/css';

const transition = `background-color ${theme.COLOR_TRANSITION_DURATION},
color ${theme.COLOR_TRANSITION_DURATION}`;

const textInputStyle = css`
  input {
    background-color: ${theme.NORMAL_BG};
    border: none;
    border-radius: 4px;
    font-size: 13px;
    color: ${theme.BRAND_COLOR};
    transition: ${transition};
    width: 100%;
    height: ${theme.BUTTON_HEIGHT};
    line-height: ${theme.BUTTON_HEIGHT};
    padding: 0 ${theme.INPUT_PADDING};
    vertical-align: middle;
  }
  input:hover,
  input:focus {
    outline: none;
    font-size: 13px;
    background-color: ${theme.NORMAL_BG_HOVER};
  }
  input:disabled {
    cursor: default;
    background-color: ${theme.NORMAL_BG_DISABLED};
  }
  input.success {
    background-color: ${theme.SUCCESS_BG};
  }
  input.success:hover,
  input.success:focus {
    background-color: ${theme.SUCCESS_BG_HOVER};
  }
  input.success:disabled {
    background-color: ${theme.SUCCESS_BG_DISABLED};
  }
  input.warning {
    background-color: ${theme.WARNING_BG};
  }
  input.warning:hover,
  input.warning:focus {
    background-color: ${theme.WARNING_BG_HOVER};
  }
  input.warning:disabled {
    background-color: ${theme.WARNING_BG_DISABLED};
  }
  input.error {
    background-color: ${theme.ERROR_BG};
  }
  input.error:hover,
  input.error:focus {
    background-color: ${theme.ERROR_BG_HOVER};
  }
  input.error:disabled {
    background-color: ${theme.ERROR_BG_DISABLED};
  }
  .tight {
    line-height: 32px;
    height: 32px;
  }
`;

type TextInputPropTypes = {
  /**
   * Size of text input can be normal or tight. Influences padding and height
   */
  size?: 'normal' | 'tight';

  /**
   * The current value of the input. Must be updated in onChange
   */
  value?: string;
  /**
   * A placeholder to shown when value is empty
   */
  placeholder?: string;
  /**
   * Type of input
   */
  type?: 'text' | 'email' | 'password' | 'url' | 'number';
  /**
   * onChange handler is called everytime the value is changed by the user.
   * Use it to update `value` prop. For details about controlled from component
   * see https://reactjs.org/docs/forms.html#controlled-components.
   */
  onChange?: React.ReactEventHandler;
  /**
   * onBlur handler is called when the input is blurred or the user hits the
   * Enter key. Use the onBlur handler to update your local store state.
   */
  onBlur?: React.ReactEventHandler;
  /**
   * onBlur handler is called when the input is blurred or the user hits the
   * Enter key. Use the onBlur handler to update your local store state.
   */
  onKeyDown?: React.ReactEventHandler;
  /**
   * The current name of the input field. Useful in combinations with
   * form frameworks such as https://github.com/jaredpalmer/formik
   */
  name?: string;
  /**
   * Current state of validation
   */
  validation?: 'success' | 'error' | 'warning';
};

/**
 * Controlled text input.
 *
 * Provide onChange and onBlur handlers as props.
 *
 * * onChange handler must update the value prop with the provided value.
 * * onBlur handler is called with the value and bool flag representing if the
 *   value was submitted (value are submitted onBlur and key == Enter).
 */
class TextInput extends React.Component<TextInputPropTypes> {
  static defaultProps = {
    type: 'text',
  };

  input: HTMLInputElement | undefined;

  focus = () => {
    this.input && this.input.focus();
  };

  handleKeyDown = (e) => {
    if (this.props.onKeyDown) {
      this.props.onKeyDown(e);
    }
    if (this.props.onBlur && e.key === 'Enter') {
      this.props.onBlur(e);
    }
  };

  render = () => {
    const { validation, size = 'normal', ...props } = this.props;

    const className = classnames(validation, size);

    return (
      <React.Fragment>
        <input
          {...props}
          onKeyDown={this.handleKeyDown}
          className={className}
          ref={(el) => (this.input = el as HTMLInputElement)}
        />

        <style jsx>{textInputStyle}</style>
      </React.Fragment>
    );
  };
}

export default TextInput;
