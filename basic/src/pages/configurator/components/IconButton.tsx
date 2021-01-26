import React, { MouseEvent, ReactNode } from 'react';
import './IconButton.css';

type IconButtonProps = {
  title: string;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
};

/**
 * A button that is rendered as icon.
 *
 * You must provide the icon as `children`
 */
function IconButton({ title, children, onClick }: IconButtonProps) {
  return (
    <button className="icon-button" title={title} onClick={onClick}>
      {children}
    </button>
  );
}

export default IconButton;
