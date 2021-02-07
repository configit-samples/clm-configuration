import React, { ReactNode } from 'react';
import { tw } from '../styles/classnames';

const list = tw('list-none', 'space-x-6', 'text-lg', 'text-gray-700');

type ListProps = {
  children: ReactNode;
  className?: string;
};
export function List({ children, className }: ListProps) {
  return (
    <ul className={`${list} ${className}`}>
      {React.Children.map(
        children,
        (c) => c && <li className="inline-block">{c}</li>
      )}
    </ul>
  );
}
