import React, { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';
import { Link } from 'react-router-dom';
import tw from '../styles/classnames';

type ButtonOrAnchorProps =
  | ButtonHTMLAttributes<HTMLButtonElement>
  | AnchorHTMLAttributes<HTMLAnchorElement>;

type ButtonProps = {
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium';
  to?: string;
} & ButtonOrAnchorProps;

const base = tw(
  'text-base',
  'flex',
  'items-center',
  'shadow-sm',
  'border',
  'rounded-md',
  'focus:outline-none',
  'focus:ring',
  'focus:ring-blue-300',
  'focus:ring-opacity-50',
  'disabled:opacity-50'
);
const medium = tw('py-3', 'px-5');
const small = tw('py-1', 'px-4');

const primary = tw(
  base,
  'bg-blue-500',
  'border-blue-600',
  'text-white',
  'hover:bg-blue-600',
  'active:bg-blue-700'
);
const secondary = tw(
  base,
  'bg-gray-50',
  'border-gray-300',
  'text-black',
  'hover:bg-gray-200',
  'active:bg-gray-300'
);
const styles = { primary, secondary };
const sizes = { small, medium };

export function Button({
  variant = 'secondary',
  size = 'medium',
  className,
  to,
  type = 'button',
  ...props
}: ButtonProps) {
  const cn = `${styles[variant]} ${sizes[size]} ${
    className ? `${className} ` : ''
  }`;

  return isLink(props, to) ? (
    <Link className={cn} to={to} {...props} />
  ) : isButton(props, to) ? (
    <button className={cn} {...props} />
  ) : null;
}

function isLink(
  _: ButtonOrAnchorProps,
  to?: string
): _ is AnchorHTMLAttributes<HTMLAnchorElement> {
  return !!to;
}

function isButton(
  _: ButtonOrAnchorProps,
  to?: string
): _ is ButtonHTMLAttributes<HTMLButtonElement> {
  return !to;
}
