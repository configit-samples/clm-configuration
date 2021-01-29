import React, { ReactNode } from 'react';
import classnames from 'classnames';
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
      <ul className="flex border-b">
        {tabs.map((tab, index) => (
          <li className="-mb-px">
            <button
              className="p-3 border border-gray-300 rounded-md rounded-b-none ml-1 bg-white focus:outline-none
                focus:ring-1"
              style={{
                borderBottomColor:
                  activeTabIndex === index ? 'white' : 'inherit',
              }}
              key={tab + index.toString()}
              onClick={(_) => onTabChange(index)}
            >
              {tab}
            </button>
          </li>
        ))}
      </ul>
      <div className="tab-content">{children}</div>
    </>
  );
}

export default Tabs;
