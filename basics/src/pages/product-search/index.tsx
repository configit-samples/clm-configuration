import React, { FormEvent, useRef, useState } from 'react';
import Page from '../../components/Page';
import products from '../../api/products';
import { ProductDetails as ProductDetailsType } from '../../api/types/configurator';
import { ReactComponent as DownArrowIcon } from 'heroicons/solid/chevron-down.svg';
import { ReactComponent as RightArrowIcon } from 'heroicons/solid/chevron-right.svg';
import { Spinner } from '../../components/Spinner';

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
      className="flex"
    >
      <input
        type="text"
        name="searchInput"
        placeholder="Search for products"
        ref={inputRef}
        disabled={isSearching}
        className="flex-1 block w-full input mr-1"
      />
      <button
        type="submit"
        disabled={isSearching}
        className="btn btn-primary w-24 h-12 text-center"
      >
        {isSearching ? <Spinner /> : 'Search'}
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
    <>
      <tr className="bg-gray-50 shadow-inner text-sm">
        <td className="td border-none font-semibold pl-8" colSpan={3}>
          <div className="pt-2 float-right text-lg text-gray-800 text-opacity-25">
            Properties
          </div>
          {product.properties?.map((property) => (
            <div className="p-2" key={property.id}>
              <div className="text-gray-500">{property.id}:</div>
              <div>{property.value}</div>
            </div>
          ))}
        </td>
      </tr>
    </>
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
    <tr>
      <td className="td">
        {product.properties?.length ? (
          <button
            className="outline-none text-base focus:outline-none flex items-center"
            onClick={onToggleDetails}
          >
            <div className="text-gray-500">
              {showDetails ? (
                <DownArrowIcon width={20} height={20} />
              ) : (
                <RightArrowIcon width={20} height={20} />
              )}
            </div>
            {product.name}
          </button>
        ) : (
          product.name
        )}
      </td>
      <td className="td">{product.description}</td>
      <td className="td text-right">
        {product.isConfigurable ? (
          <a
            href={`/configurator/${product.id}`}
            className="hover:underline text-blue-600"
          >
            Configure
          </a>
        ) : (
          'Standard'
        )}
        <span className="px-2 text-gray-300">|</span>
        <a
          href={`/pricing/${product.id}`}
          className="hover:underline text-blue-600"
        >
          Price
        </a>
      </td>
    </tr>
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
    <>
      <ProductSummary
        showDetails={showDetails}
        onToggleDetails={() => setShowDetails(!showDetails)}
        product={product}
      />
      {showDetails ? <ProductDetails product={product} /> : null}
    </>
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
    <table className="table table-fixed mt-3">
      <thead className=" text-left text-gray-700 bg-gray-50">
        <tr>
          <th className="font-normal td w-1/4">Name</th>
          <th className="font-normal td w-1/2">Description</th>
          <th className="font-normal td w-1/4">&nbsp;</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <ProductListItem key={product.id} product={product} />
        ))}
      </tbody>
    </table>
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
      <div>
        <SearchInput isSearching={isSearching} onSearch={handleSearch} />
        {!isSearching ? <ProductList products={loadedProducts} /> : null}
      </div>
    </Page>
  );
}

export default ProductSearch;
