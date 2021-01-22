import React from 'react';

export function QueenIcon({
  width = '64',
  height = '64',
  opacity = 1,
  outline = false,
}) {
  return (
    <svg
      version="1.1"
      viewBox="0 0 64 64"
      width={width}
      height={height}
      opacity={opacity}
    >
      <g transform="matrix(4.571428571428571,0,0,4.571428571428571,0,0)">
        <path
          d="M13.691,4.031a.5.5,0,0,0-.545.109L10.779,6.508a.25.25,0,0,1-.2.072.246.246,0,0,1-.183-.106L7.41,2.207a.519.519,0,0,0-.82,0L3.6,6.474a.246.246,0,0,1-.183.106.25.25,0,0,1-.2-.072L.854,4.14A.5.5,0,0,0,0,4.493v7a.5.5,0,0,0,.5.5h13a.5.5,0,0,0,.5-.5v-7A.5.5,0,0,0,13.691,4.031Z"
          fill={outline ? 'none' : 'currentColor'}
          stroke={outline ? 'currentColor' : 'none'}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={outline ? 1 : '0'}
        />
      </g>
    </svg>
  );
}
