import React from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import ReactDOM from 'react-dom';

import Toc from './Toc';

import ProductSearchExample from './pages/product-search';
import ConfiguratorExample from './pages/configurator';
import PricingExample from './pages/pricing';

import './index.css';

/**
 * The application Root component which provides routing for authentication
 * and the different examples (from the ./examples folder)
 */
function Root() {
  return (
    <React.StrictMode>
      <Router>
        <div className="container mx-auto px-6 bg-white">
          <main>
            {/* Home page with TOC */}
            <Route exact path="/" component={Toc} />

            {/* examples */}
            <Route path="/product-search" component={ProductSearchExample} />
            <Route
              path="/configurator/:productId?"
              component={ConfiguratorExample}
            />
            <Route path="/pricing/:productId?" component={PricingExample} />
          </main>
        </div>
      </Router>
    </React.StrictMode>
  );
}

ReactDOM.render(<Root />, document.getElementById('root'));
