import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import './TopNav.css';

function TopNav() {
  return (
    <div className="topnav">
      <Link to="/" className="topnav-home-link">
        <Logo /> — Ace API samples
      </Link>
    </div>
  );
}

export default TopNav;
