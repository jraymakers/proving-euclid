import * as React from 'react';

import { proofs } from '../../data';
import { cssClass } from '../../style';
import { ProofTextView } from './ProofTextView';

const rootClass = cssClass('AllProofsTextView', 'root', {
  padding: '12px',
});

export const AllProofsTextView: React.FC = () => {
  return (
    <div className={rootClass}>
      <div>Proofs</div>
      <div>
        {Object.keys(proofs).map(proofName => {
          const proof = proofs[proofName];
          if (!proof) {
            return null;
          }
          return (
            <ProofTextView key={proofName} proofName={proofName} proof={proof} />
          );
        })}
      </div>
    </div>
  );
};
AllProofsTextView.displayName = 'AllProofsTextView';
