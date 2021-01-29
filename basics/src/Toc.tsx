import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import AceLogo from './components/AceLogo';

function Examples({ children }: { children: ReactNode }) {
  return (
    <nav className="mt-10">
      <dl className="space-y-0 grid grid-cols-3 gap-x-12 gap-y-10">
        {children}
      </dl>
    </nav>
  );
}

type ExampleProps = {
  href: string;
  title: ReactNode;
  children: ReactNode;
};

function Example({ href, title, children }: ExampleProps) {
  return (
    <div className="flex max-w-sm e">
      <Link
        to={href}
        className="bg-white flex-grow p-4 border shadow-md rounded-lg hover:shadow-lg transition-colors"
      >
        <div className="text-lg leading-6 font-medium font-semibold">
          {title}
        </div>
        <div className="mt-2 text-base text-gray-500">{children}</div>
      </Link>
    </div>
  );
}

/**
 * Table of Contents, displays a list of examples.
 */
function Toc() {
  return (
    <div className="mt-10 p-20 pt-10 border rounded shadow-sm bg-blue-50">
      <div className="flex mt-10">
        <AceLogo width={128} height={128} />
        <div className="flex-1 ml-12">
          <h1 className="text-3xl leading-8 font-bold tracking-tight text-gray-900">
            Ace basics code samples
          </h1>
          <p className="mt-4 text-xl text-gray-500">
            Sample code that illustrate how to build web applications with
            Configit Ace APIs.
          </p>
        </div>
      </div>
      <Examples>
        <Example href="/product-search" title="Product search">
          Use the <code className="font-semibold text-gray-900">/products</code>{' '}
          endpoint to find products in a package
        </Example>

        <Example href="/configurator" title="Configurator">
          Use the{' '}
          <code className="font-semibold text-gray-900">/configure</code>{' '}
          endpoint to create an interactive configurator
        </Example>

        <Example href="/pricing" title="Pricing">
          Use the <code className="font-semibold text-gray-900">/price</code>{' '}
          endpoint to show a price report
        </Example>
      </Examples>
    </div>
  );
}
export default Toc;
