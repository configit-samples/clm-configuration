import React, { ReactNode } from 'react';
import classnames from 'classnames';
import './Tabs.css';

const tabClassName = (index: number, activeTabIndex: number) =>
  classnames('tabs-tab', { 'tabs-tab-active': index === activeTabIndex });

type TabsProps = {
  tabs: ReactNode[];
  activeTabIndex: number;
  onTabChange: (index: number) => void;
  children: ReactNode;
};

/**
 * `<Tabs>` component renders tab items for each item in `tabs` props.
 */
function Tabs({ tabs, activeTabIndex, onTabChange, children }: TabsProps) {
  return (
    <>
      <div className="tabs">
        {tabs.map((tab, index) => (
          <button
            className={tabClassName(index, activeTabIndex)}
            key={tab + index.toString()}
            onClick={(_) => onTabChange(index)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="tab-content">{children}</div>
    </>
  );
}

export default Tabs;
