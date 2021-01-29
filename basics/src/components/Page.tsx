import React, { ReactNode } from 'react';
import './Page.css';

type PageProps = {
  variant?: 'normal' | 'transparent';
  children: ReactNode;
};

/**
 * Provide consistent styling for a page
 */
function Page({ variant = 'normal', children }: PageProps) {
  return <div className={`page page-${variant}`}>{children}</div>;
}

export default Page;
