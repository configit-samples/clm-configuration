import React, { ButtonHTMLAttributes } from 'react';
import css from 'styled-jsx/css';
import classnames from 'classnames';
import { tint, darken } from './color';
import * as theme from './theme';

const transition = `background-color ${theme.COLOR_TRANSITION_DURATION}, color ${theme.COLOR_TRANSITION_DURATION}`;

const styles = css`
  .button {
    display: inline-block;
    vertical-align: middle;
    padding: 0 30px;
    border: none;
    border-radius: 4px;
    transition: ${transition};
    cursor: pointer;
    white-space: nowrap;
    text-decoration: none;
  }

  .normal {
    line-height: ${theme.BUTTON_HEIGHT};
  }

  .tight {
    line-height: ${theme.BUTTON_HEIGHT_TIGHT};
  }

  .button:focus {
    outline: none;
    box-shadow: 0px 3px 4px ${theme.BLUEGRAY_COLOR_MEDIUM};
  }
  .button:disabled,
  .button.disabled {
    opacity: 0.4;
    cursor: default;
  }
  .button.disabled {
    pointer-events: none;
    cursor: default;
  }
  .light {
    background-color: ${tint(theme.BRAND_COLOR, 90)};
    color: ${theme.LINK_COLOR};
  }
  .light:hover:enabled,
  .light:focus:enabled {
    background-color: ${tint(theme.BRAND_COLOR, 80)};
  }
  .light:active:enabled,
  .light.selected:focus:enabled,
  .light.selected {
    background-color: ${tint(theme.BRAND_COLOR, 70)};
  }
  .dark {
    background-color: ${theme.BRAND_COLOR};
    color: ${theme.ALT_TEXT_COLOR};
  }
  .dark:focus:enabled {
    background-color: ${darken(theme.BRAND_COLOR, 10)};
  }
  .dark:hover:enabled {
    background-color: ${darken(theme.BRAND_COLOR, 5)};
  }
  .dark:active:enabled,
  .dark.selected:focus:enabled,
  .dark.selected {
    background-color: ${darken(theme.BRAND_COLOR, 8)};
  }

  .danger {
    background-color: ${theme.ERROR_COLOR};
    color: ${theme.ALT_TEXT_COLOR};
  }
  .danger:focus:enabled {
    background-color: ${darken(theme.ERROR_COLOR, 20)};
  }
  .danger:hover:enabled {
    background-color: ${darken(theme.ERROR_COLOR, 8)};
  }
  .danger:active:enabled,
  .danger.selected:focus:enabled,
  .danger.selected {
    background-color: ${darken(theme.ERROR_COLOR, 15)};
  }
  .transparent {
    background-color: ${theme.WHITE_TRANS_2};
    color: ${theme.ALT_TEXT_COLOR};
  }
  .transparent:focus:enabled {
    background-color: ${theme.WHITE_TRANS_3};
  }
  .transparent:hover:enabled {
    background-color: ${theme.WHITE_TRANS_1};
  }
  .transparent:active:enabled,
  .transparent.selected:focus:enabled,
  .transparent.selected {
    background-color: ${theme.WHITE_TRANS_05};
  }
`;

interface ButtonProps extends ButtonHTMLAttributes<HTMLElement> {
  color?: 'light' | 'dark' | 'danger' | 'transparent';
  size?: 'normal' | 'tight';
  href?: string;
  isSelected?: boolean;
  onClick: React.ReactEventHandler;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      href,
      type = 'button',
      color = 'transparent',
      size = 'normal',
      isSelected = false,
      ...props
    },
    ref
  ) =>
    href ? (
      <a
        href={href}
        className={classnames('button', color, size, {
          disabled: props.disabled,
          selected: isSelected,
        })}
      >
        {children}
        <style jsx>{styles}</style>
      </a>
    ) : (
      <button
        ref={ref}
        {...props}
        className={classnames('button', color, size, {
          disabled: props.disabled,
          selected: isSelected,
        })}
      >
        {children}
        <style jsx>{styles}</style>
      </button>
    )
);

export default Button;
