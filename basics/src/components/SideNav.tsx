import React, { ReactNode } from 'react';
import tw from '../styles/classnames';

type SideNavProps = {
  items: ReactNode[];
  activeTabIndex: number;
  onTabChange: (index: number) => void;
  children: ReactNode;
};

/**
 * `<Tabs>` component renders tab items for each item in `tabs` props.
 */
function SideNav({
  items,
  activeTabIndex,
  onTabChange,
  children,
}: SideNavProps) {
  return (
    <div className="flex">
      <aside className="w-80 text-lg block pr-4 sticky h-full pt-2 top-32 z-0">
        <ul className="flex flex-col">
          {items.map((item, index) => (
            <li key={index}>
              <NavItem
                isActive={index === activeTabIndex}
                onActive={() => onTabChange(index)}
              >
                {item}
              </NavItem>
            </li>
          ))}
        </ul>
      </aside>
      <div className="min-w-0 w-full flex-auto pl-4 border-l">{children}</div>
    </div>
  );
}

type NavItemProps = {
  children: ReactNode;
  isActive: boolean;
  onActive: () => void;
};

function NavItem({ children, isActive, onActive }: NavItemProps) {
  const base = tw(
    'px-3',
    'py-2',
    'transition-colors',
    'duration-200',
    'block',
    'hover:text-gray-900',
    'focus:outline-none',
    'rounded',
    'text-gray-500',
    'w-full',
    'text-left',
    'font-semibold'
  );

  const active = tw(base, 'bg-blue-100', 'text-blue-900', 'bg-opacity-50');

  const className = isActive ? active : base;

  return (
    <button className={className} onClick={onActive}>
      {children}
    </button>
  );
}

export default SideNav;
