import React, { ReactNode, useEffect } from 'react';
import tw from '../styles/classnames';

type PopoverProps = {
  children: ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};
export function Popover({ children, isOpen, setIsOpen }: PopoverProps) {
  const popoverClassName = tw(
    'top-8',
    'flex',
    'flex-col',
    'absolute',
    'shadow-lg',
    'rounded-md',
    'bg-white',
    'border',
    'px-4',
    'py-2',
    'text-sm',
    'z-50',
    { hidden: !isOpen }
  );

  useEffect(() => {
    function close() {
      setIsOpen(false);
    }
    if (isOpen) {
      document.addEventListener('click', close);

      return () => document.removeEventListener('click', close);
    }
  }, [isOpen, setIsOpen]);

  return (
    <div className={popoverClassName} onClick={(e) => e.stopPropagation()}>
      {children}
    </div>
  );
}
