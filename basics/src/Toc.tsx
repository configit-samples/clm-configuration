import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Logo from './components/Logo';
import './Toc.css';

function Examples({ children }: { children: ReactNode }) {
  return <nav className="toc-examples">{children}</nav>;
}

type ExampleProps = {
  href: string;
  title: ReactNode;
  children: ReactNode;
};

function Example({ href, title, children }: ExampleProps) {
  return (
    <Link to={href} className="toc-example">
      <div className="toc-example-link">{title}</div>
      <div className="toc-example-description">{children}</div>
    </Link>
  );
}

/**
 * Table of Contents, displays a list of examples.
 */
function Toc() {
  return (
    <div className="toc">
      <h1 className="toc-title">
        <Logo height="42px" /> — Ace Configuration samples
      </h1>
      <p className="toc-lead">
        Examples that illustrate how to build web applications with Ace
        Platform's Configuration API.
      </p>
      <Examples>
        <Example href="/product-search" title="Product search">
          Use the <code>/products</code> endpoint to find products in a package
        </Example>

        <Example href="/configurator" title="Configurator">
          Use the <code>/configure</code> endpoint to create an interactive
          configurator
        </Example>

        <Example href="/pricing" title="Pricing">
          Use the <code>/price</code> endpoint to show a price report
        </Example>
      </Examples>
    </div>
  );
}
export default Toc;
