import pluralize from 'pluralize';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/Button';
import { List } from '../../components/List';
import { ProductSummaryContext, ProductSummaryProps } from '../ProductModel';

export function ProductDetailsSummary() {
  const { productInfo, packageInfo } = useContext(ProductSummaryContext);

  if (!productInfo && !packageInfo) {
    return null;
  }
  return (
    <List>
      {pluralize('Language', packageInfo?.languages?.length, true)}
      {pluralize('View', productInfo?.views?.length, true)}
      {pluralize('Variable', productInfo?.variables?.length, true)}
      {pluralize('Price procedure', packageInfo?.priceProcedures?.length, true)}
    </List>
  );
}

export function ProductDetailsActions() {
  const { productInfo } = useContext(ProductSummaryContext);

  return (
    <List>
      <Button to="/">All Products</Button>
      <Button variant="primary" to={`/${productInfo?.id}/configurator`}>
        Configure
      </Button>
    </List>
  );
}

export function ProductDetailsPage() {
  const { productInfo } = useContext(ProductSummaryContext);

  return <div>{productInfo?.id}</div>;
}
