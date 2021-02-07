import React from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import ReactDOM from 'react-dom';

import './index.css';
import { ProductModelPage } from './pages/ProductModel';
import { ProductSearchPage } from './pages/ProductSearch';

/**
 * The application Root component which provides routing for authentication
 * and the different examples (from the ./examples folder)
 */
function Root() {
  return (
    <React.StrictMode>
      <Router>
        <Switch>
          <Route path="/:productId" component={ProductModelPage} />
          <Route path="/" component={ProductSearchPage} exact />
        </Switch>
      </Router>
    </React.StrictMode>
  );
}

ReactDOM.render(<Root />, document.getElementById('root'));
