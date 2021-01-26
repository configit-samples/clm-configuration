import React from 'react';
import './Button.css';

/**
 * A styled button
 */
export default function Button({ variant = 'normal', ...props }) {
  return <button className={`button button-${variant}`} {...props} />;
}
