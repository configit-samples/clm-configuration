import React, { MouseEvent, ReactNode } from 'react';

type ToolbarButtonProps = {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
};

export function ToobarButton({ children, onClick }: ToolbarButtonProps) {
  return (
    <button className="toolbar-button" onClick={onClick}>
      {children}
    </button>
  );
}

type ToolbarProps = {
  children: ReactNode;
};

export default function Toolbar({ children }: ToolbarProps) {
  return <div className="toolbar">{children}</div>;
}
