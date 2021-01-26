import React from 'react';
import { PriceLine } from '../../../api/types/configurator';
import Input from '../../../components/Input';
import './PriceLineInput.css';

type PriceLineInputProps = {
  priceLine: PriceLine;
  onAssign: (stepId: string, value: number) => void;
};

/**
 * Component for editing the rate of a priceline
 *
 * Deals with positive and negative sign constraints, such the the user doesn't
 * have to.
 */
function PriceLineInput({ priceLine, onAssign }: PriceLineInputProps) {
  function handleOnChange(value: string) {
    const nValue = Number(value);
    if (priceLine.stepId) {
      if (priceLine.rate?.signConstraint === 'Negative') {
        onAssign(
          priceLine.stepId,
          Math.sign(nValue) <= 0 ? nValue : nValue * -1
        );
      } else if (priceLine.rate?.signConstraint === 'Positive') {
        onAssign(
          priceLine.stepId,
          Math.sign(nValue) >= 0 ? nValue : nValue * -1
        );
      } else {
        onAssign(priceLine.stepId, nValue);
      }
    }
  }

  return (
    <Input
      showEditMarker
      className="price-line-input"
      value={priceLine.rate?.value?.toString() || ''}
      onChange={(v) => handleOnChange(v)}
    />
  );
}

export default PriceLineInput;
