import React, { useContext, useEffect, useRef, useState } from 'react';
import priceAPI from '../../api/price';
import PriceSheet from './components/PriceSheet';
import { globalArguments } from '../../globalArguments';
import './index.css';
import PriceHeader from './components/PriceHeader';
import {
  PriceSheet as PriceSheetType,
  ValueWithUnit,
} from '../../api/types/configurator';
import { useParams } from 'react-router';
import { ProductSummaryContext } from '../ProductModel';
import pluralize from 'pluralize';
import { List } from '../../components/List';
import { Link } from 'react-router-dom';
import { Button } from '../../components/Button';

/**
 * Component shown if product Id and/or configuration id is missing from URL.
 */
function NoIdPage({ productId }: { productId: string }) {
  return (
    <div className="no-id-page">
      <h2>{!productId} Product id is missing</h2>
      <p>
        To start the specify a product id in the URL, for example{' '}
        <a href="/pricing/CBEER">/pricing/CBEER</a>
      </p>
      <p>
        If you don't know any product id, use the{' '}
        <a href="/product-search">product search</a> to find one.
      </p>
    </div>
  );
}

type PriceAssignmentLookup = { [key: string]: number };

/**
 * Example of how to use the `/price` endpoint to create a pricereport.
 *
 * The `<Pricing>` component is the top level component. It manages state and
 * pushes state changes from the `/price` endpoint down to sub component that
 * renders the pricereport.
 *
 * The pricing screen has the following structure.
 *
 * +--------------------------------------------------------------------------+
 * | Pricing                                                                  |
 * | +----------------------------------------------------------------------+ |
 * | | PriceHeader                                                          | |
 * | +----------------------------------------------------------------------+ |
 * | +----------------------------------------------------------------------+ |
 * | | PriceSheet                                                           | |
 * | | +------------------------------------------------------------------+ | |
 * | | | PriceLine+                                                       | | |
 * | | +------------------------------------------------------------------+ | |
 * | +----------------------------------------------------------------------+ |
 * +--------------------------------------------------------------------------+
 */
export function PricingPage() {
  const assignments = useRef<PriceAssignmentLookup>({});
  const quantity = useRef<ValueWithUnit>({ value: 1, unit: 'EA' });
  const { productId } = useParams<{ productId: string }>();

  const [error, setError] = useState('');
  const [priceSheet, setPriceSheet] = useState<PriceSheetType>();

  useEffect(() => {
    fetchAndUpdatePrice(quantity.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /**
   * Called when the price reports needs to be recalculated.
   *
   *  * When this component is mounted (to get initial configuration)
   *  * When users assign/unassign values to pricelines
   */
  async function fetchAndUpdatePrice(
    quantity: ValueWithUnit,
    assignments: PriceAssignmentLookup = {}
  ) {
    if (!productId) {
      return;
    }
    const packagePath = process.env.REACT_APP_PACKAGE_PATH;

    try {
      const result = await priceAPI({
        packagePath,
        date: new Date().toISOString(),
        language: 'EN',
        globalArguments,
        line: {
          quantity,
          productId,
          priceLineAssignments: Object.keys(assignments).map((k) => ({
            stepId: k,
            rateValue: assignments[k],
          })),
        },
      });
      if (result.priceSheet) {
        setPriceSheet(result.priceSheet);
      } else {
        setError(
          `Product with id '${productId}' doesn't have any prices defined ` +
            `in package with path '${packagePath}'`
        );
      }
    } catch (e) {
      if (e.type === 'CannotLoadPackage') {
        setError(
          `Product with id '${productId}' doesn't exist ` +
            `in package with path '${packagePath}'`
        );
      } else {
        throw e;
      }
    }
  }

  /**
   * Called when users make an assignment.
   */
  function handleOnAssign(stepId: string, rateValue: number) {
    assignments.current[stepId] = rateValue;
    fetchAndUpdatePrice(quantity.current, assignments.current);
  }

  /**
   * Called when users change the quantity in the `<LineSummary>` component.
   */
  function handleQuantityChange(newQuantity: ValueWithUnit) {
    quantity.current = newQuantity;
    fetchAndUpdatePrice(quantity.current, assignments.current);
  }

  if (!productId) {
    return <NoIdPage productId={productId} />;
  }
  if (error) {
    return <div>{error}</div>;
  }
  if (!priceSheet) {
    return <div>Loading…</div>;
  }

  return (
    <>
      <PriceHeader
        quantity={quantity.current}
        onQuantityChange={handleQuantityChange}
        productId={productId}
        totalPrice={priceSheet.totals?.total}
      />
      <PriceSheet priceSheet={priceSheet} onAssign={handleOnAssign} />
    </>
  );
}

export function PricingSummary() {
  const { productInfo, packageInfo } = useContext(ProductSummaryContext);

  if (!productInfo && !packageInfo) {
    return null;
  }
  return (
    <List>{pluralize('Variable', productInfo?.variables?.length, true)}</List>
  );
}

export function PricingActions() {
  const { productInfo } = useContext(ProductSummaryContext);

  return (
    <List>
      <Button to="/">All Products</Button>
      <Button variant="primary" to={`/${productInfo?.id}`}>
        Details
      </Button>
      <Button variant="primary" to={`/${productInfo?.id}/configurator`}>
        Configure
      </Button>
    </List>
  );
}
