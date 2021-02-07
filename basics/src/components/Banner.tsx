import { tw } from '../styles/classnames';
import React, { ReactNode } from 'react';

type BannerProps = {
  children: ReactNode;
  variant: 'error' | 'info' | 'warning';
};

/**
 * Show a top banner
 */
export default function Banner({ children, variant }: BannerProps) {
  const className = tw(
    'sticky',
    'top-0',
    'left-0',
    'p-4',
    'font-semibold',
    'shadow-sm',
    'w-screen',
    {
      'text-red-900': variant === 'error',
      'bg-red-100': variant === 'error',
      'text-yellow-900': variant === 'warning',
      'bg-yellow-100': variant === 'warning',
      'text-blue-900': variant === 'info',
      'bg-blue-100': variant === 'info',
    }
  );
  return <div className={className}>{children}</div>;
}
