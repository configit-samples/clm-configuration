import React, { FormEvent, useRef, useState } from 'react';
import Page from '../../components/Page';
import products from '../../api/products';
import './index.css';
import { ProductDetails as ProductDetailsType } from '../../api/types/configurator';

type SearchInputProps = {
  isSearching: boolean;
  onSearch: (value: string) => void;
};
/**
 * Component with an input field and a button.
 *
 * Calls the `onSearch` prop when the button is clicked
 */
function SearchInput({ isSearching, onSearch }: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <form
      onSubmit={(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSearch(inputRef.current?.value || '');
      }}
      autoComplete="off"
      className="product-search-input"
    >
      <input
        type="text"
        name="searchInput"
        placeholder="Search for products"
        ref={inputRef}
        disabled={isSearching}
      />
      <button type="submit" disabled={isSearching}>
        <span>⚲</span>
      </button>
    </form>
  );
}

type ProductDetailsProps = {
  product: ProductDetailsType;
};

/**
 * Display details (properties) of a product
 */
function ProductDetails({ product }: ProductDetailsProps) {
  return (
    <div className="product-details">
      {product.properties?.map((property) => (
        <React.Fragment key={property.id}>
          <div>{property.id}</div>
          <div>{property.value}</div>
        </React.Fragment>
      ))}
    </div>
  );
}

type ProductSummaryProps = {
  product: ProductDetailsType;
  showDetails: boolean;
  onToggleDetails: () => void;
};

/**
 * Display the product summary:
 *
 * * name
 * * description
 * * configurable or standard
 *
 * and a link to toggle the details
 */
function ProductSummary({
  product,
  showDetails,
  onToggleDetails,
}: ProductSummaryProps) {
  return (
    <div className="product-summary">
      <div>
        <div>{product.name}</div>
        <div>
          <em>{product.description}</em>
        </div>
      </div>
      <div>
        <div>
          <em>
            {product.isConfigurable ? (
              <a href={`/configurator/${product.id}`}>Configure</a>
            ) : (
              'Standard'
            )}
          </em>
          {', '}
          <em>
            <a href={`/pricing/${product.id}`}>Price</a>
          </em>
        </div>
        <div>
          {product.properties?.length ? (
            <button
              onClick={onToggleDetails}
              className="product-summary-toggle-details"
              type="button"
            >
              {showDetails ? 'Hide details' : 'Show details'}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

type ProductListItemProps = {
  product: ProductDetailsType;
};

/**
 * Display a single product in the `ProductList`
 *
 * Manages the state for show/hide of product details
 */
function ProductListItem({ product }: ProductListItemProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="products-list-item">
      <ProductSummary
        showDetails={showDetails}
        onToggleDetails={() => setShowDetails(!showDetails)}
        product={product}
      />
      {showDetails ? <ProductDetails product={product} /> : null}
    </div>
  );
}

type ProductListProps = {
  products: ProductDetailsType[];
};

/**
 * Displays a list of products found by the product service
 */
function ProductList({ products }: ProductListProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <div className="products-list">
      {products.map((product) => (
        <ProductListItem key={product.id} product={product} />
      ))}
    </div>
  );
}

/**
 * Example of how to use the product search api to find
 * products in a package.
 */
function ProductSearch() {
  const [isSearching, setIsSearching] = useState(false);
  const [loadedProducts, setLoadedProducts] = useState<ProductDetailsType[]>(
    []
  );

  /**
   * Called when the search button is clicked
   *
   * * call the product service with entered search term
   * * update the state with the result
   */
  async function handleSearch(searchTerm: string) {
    setIsSearching(true);
    const result = await products(searchTerm);
    setIsSearching(false);
    setLoadedProducts(result.products || []);
  }

  return (
    <Page>
      <div className="product-search">
        <SearchInput isSearching={isSearching} onSearch={handleSearch} />
        {isSearching ? (
          'Searching...'
        ) : (
          <ProductList products={loadedProducts} />
        )}
      </div>
    </Page>
  );
}

export default ProductSearch;
