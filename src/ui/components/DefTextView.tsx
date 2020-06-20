import * as React from 'react';

import { Theorem } from '../../data/types/Theorem';
import { cssClass } from '../../style';

const rootClass = cssClass('DefTextView', 'root', {
  padding: '12px',
});

export const DefTextView: React.FC<{
  def: Theorem
}> = ({
  def,
}) => {
  return (
    <div className={rootClass}>
      <div>{def.kind}:{def.name}</div>
      <div>{def.formula}</div>
    </div>
  );
};
DefTextView.displayName = 'DefTextView';
