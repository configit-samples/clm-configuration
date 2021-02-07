import React, { ReactNode } from 'react';

export function Page({ children }: { children: ReactNode }) {
  return <div className="min-h-screen flex flex-col">{children}</div>;
}
export function Header({ children }: { children: ReactNode }) {
  return (
    <div className="sticky z-20 top-0 py-6 left-0 h-24 md:h-32 bg-gray-50 border-b">
      <div className="flex inner-content">{children}</div>
    </div>
  );
}
export function Footer({ children }: { children: ReactNode }) {
  return <div className="">{children}</div>;
}
export function Content({ children }: { children: ReactNode }) {
  return (
    <div className="flex-1">
      <div className="inner-content">{children}</div>
    </div>
  );
}
