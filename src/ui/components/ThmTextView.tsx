import * as React from 'react';

import { Theorem } from '../../data/types/Theorem';
import { cssClass } from '../../style';

const rootClass = cssClass('ThmTextView', 'root', {
  padding: '12px',
});

export const ThmTextView: React.FC<{
  thm: Theorem
}> = ({
  thm,
}) => {
  return (
    <div className={rootClass}>
      <div>{thm.kind}:{thm.name}</div>
      <div>{thm.formula}</div>
      {thm.proofRef ? <div>{thm.proofRef}</div> : null}
    </div>
  );
};
ThmTextView.displayName = 'ThmTextView';
