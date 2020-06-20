import * as React from 'react';

import { Proof } from '../../data/types/Proof';
import { cssClass } from '../../style';
import { ProofStepTextView } from './ProofStepTextView';
import { assertNever } from '../../typescript';
import { ProofStep } from '../../data/types/ProofStep';

const rootClass = cssClass('ProofTextView', 'root', {
  padding: '12px',
});

function indentChangeForProofStep(proofStep: ProofStep) {
  switch (proofStep.kind) {
    case 'known':
      return 0;
    case 'justified':
      return 0;
    case 'unjustified':
      return 0;
    case 'assumption':
      return +1;
    case 'reductio':
      return -1;
    case 'cases_start':
      return +1;
    case 'case':
      return +1;
    case 'qedcase':
      return -1;
    case 'cases_end':
      return -1;
    case 'comment':
      return 0;
    default:
      assertNever(proofStep);
      return 0;
  }
}

export const ProofTextView: React.FC<{
  proofName: string;
  proof: Proof;
}> = ({
  proofName,
  proof,
}) => {
  let indent = 0;
  const steps: React.ReactNode[] = [];
  proof.forEach((proofStep, index) => {
    const indentChange = indentChangeForProofStep(proofStep);
    if (indentChange < 0) {
      indent += indentChange;
    }
    steps.push(<div key={index} style={{ paddingLeft: indent*12 }}><ProofStepTextView proofStep={proofStep} /></div>);
    if (indentChange > 0) {
      indent += indentChange;
    }
  });
  return (
    <div className={rootClass}>
      <div>{proofName}</div>
      <div>
        {steps}
      </div>
    </div>
  );
};
ProofTextView.displayName = 'ProofTextView';
