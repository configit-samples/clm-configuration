import React from 'react';
import {
  ValueWithCurrency,
  ValueWithUnit,
} from '../../../api/types/configurator';
import Input from '../../../components/Input';
import './PriceHeader.css';

type PriceHeaderProps = {
  quantity: ValueWithUnit;
  onQuantityChange: (value: ValueWithUnit) => void;
  totalPrice?: ValueWithCurrency;
  productId: string;
};

/**
 * A header to the price sheet.
 *
 * Allows users to change the quantity value and unit
 */
export default function PriceHeader({
  quantity,
  onQuantityChange,
  totalPrice,
  productId,
}: PriceHeaderProps) {
  return (
    <div className="price-header">
      <div className="price-header-quantity-value">
        <Input
          showEditMarker
          value={quantity.value?.toString() || ''}
          onChange={(value) =>
            onQuantityChange({
              value: Number(value) || 1,
              unit: quantity.unit,
            })
          }
        />
      </div>
      <div className="price-header-quantity-unit">
        <Input
          value={quantity?.unit || ''}
          onChange={(unit) =>
            onQuantityChange({
              value: quantity.value,
              unit,
            })
          }
        />
      </div>
      <div className="price-header-product-id">{productId}</div>
      <div className="price-header-price">
        {totalPrice?.value} {totalPrice?.currency}
      </div>
    </div>
  );
}
