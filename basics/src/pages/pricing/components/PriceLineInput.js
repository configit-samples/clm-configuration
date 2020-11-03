import React from 'react';
import Input from '../../../components/Input';
import './PriceLineInput.css';

/**
 * Component for editing the rate of a priceline
 *
 * Deals with positive and negative sign constraints so that the user doesn't
 * have to.
 */
function PriceLineInput({ priceLine, onAssign }) {
  function handleOnChange(value) {
    const nValue = Number(value);
    if (priceLine.rate.signConstraint === 'Negative') {
      onAssign(priceLine.stepId, Math.sign(nValue) <= 0 ? nValue : nValue * -1);
    } else if (priceLine.rate.signConstraint === 'Positive') {
      onAssign(priceLine.stepId, Math.sign(nValue) >= 0 ? nValue : nValue * -1);
    } else {
      onAssign(priceLine.stepId, nValue);
    }
  }

  return (
    <Input
      showEditMarker
      className="price-line-input"
      value={priceLine.rate.value}
      onChange={handleOnChange}
    />
  );
}

export default PriceLineInput;
