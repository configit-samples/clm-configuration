import React from 'react';
import { Button, Wrapper, Menu, MenuItem } from 'react-aria-menubutton';

const modes = {
  'no-help': {
    name: 'Manual',
    description: (
      <div>
        You are prevented from placing a queen in another’s path. The rest is up
        to you. <strong>Good luck!</strong>
      </div>
    ),
  },
  validation: {
    name: 'Validation',
    description: (
      <div>
        After you place a queen, her paths are blocked. Even so, it can be
        tricky to find a solution!
      </div>
    ),
  },
  configurator: {
    name: 'Configurator',
    description: (
      <div>
        The configurator blocks <em>all</em> squares that don't lead to a valid
        solution.
        <div>
          <strong>Puzzle solved, every time</strong>.
        </div>
      </div>
    ),
  },
};

export function ModesSelect({ value, onSelect }) {
  const valueData = modes[value];

  return (
    <div className="label-wrapper">
      <label>Game mode</label>
      <Wrapper className="select-wrapper" onSelection={onSelect}>
        <Button className="select">{valueData.name}</Button>
        <Menu className="options-menu">
          {Object.keys(modes).map((v) => (
            <MenuItem
              value={v}
              className={`option${value === v ? ' selected' : ''}`}
              key="v"
            >
              <div className="option-name">{modes[v].name}</div>
              <div className="option-description">{modes[v].description}</div>
            </MenuItem>
          ))}
        </Menu>
      </Wrapper>
    </div>
  );
}
