import React from 'react';

export function Reset({ width = '24px', height = '24px' }) {
  return (
    <svg viewBox="0 0 24 24" height={height} width={width}>
      <g transform="matrix(1,0,0,1,0,0)">
        <path
          d="M 13.5,21.747c5.385,0,9.75-4.365,9.75-9.75s-4.365-9.75-9.75-9.75s-9.75,4.365-9.75,9.75 c0,0.001,0,0.002,0,0.003v0.75 "
          fill="none"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="currentColor"
        />
        <path
          d="M 0.75,9.747l3,3l3-3"
          fill="none"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="currentColor"
        />
        <g transform="scale(0.5) translate(15,12)">
          <path
            d="M 4.5,19.5l15-15 "
            fill="none"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            stroke="currentColor"
          />
          <path
            d="M 4.5,4.5l15,15"
            fill="none"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            stroke="currentColor"
          />
        </g>
      </g>
    </svg>
  );
}

export function Clear({ width = '24px', height = '24px' }) {
  return (
    <svg
      width={width}
      height={height}
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <g transform="matrix(1,0,0,1,0,0)">
        <path
          d="M 4.5,19.5l15-15"
          fill="none"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 4.5,4.5l15,15"
          fill="none"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
