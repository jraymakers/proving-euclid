import * as React from 'react';

import {
  AssumptionProofStep,
  CaseProofStep,
  CasesEndProofStep,
  CasesStartProofStep,
  CommentProofStep,
  JustifiedProofStep,
  KnownProofStep,
  ProofStep,
  ReductioProofStep,
  UnjustifiedProofStep,
} from '../../data/types/ProofStep';
import { cssClass } from '../../style';
import { assertNever } from '../../typescript';

const rootClass = cssClass('ProofTextView', 'root', {
});

export const ProofStepTextView: React.FC<{
  proofStep: ProofStep;
}> = ({
  proofStep,
}) => {
  return (
    <div className={rootClass}>
      <ProofStepTextViewContents proofStep={proofStep} />
    </div>
  );
};
ProofStepTextView.displayName = 'ProofStepTextView';

const ProofStepTextViewContents: React.FC<{
  proofStep: ProofStep;
}> = ({
  proofStep,
}) => {
  switch (proofStep.kind) {
    case 'known':
      return <KnownProofStepTextView proofStep={proofStep} />;
    case 'justified':
      return <JustifiedProofStepTextView proofStep={proofStep} />;
    case 'unjustified':
      return <UnjustifiedProofStepTextView proofStep={proofStep} />;
    case 'assumption':
      return <AssumptionProofStepTextView proofStep={proofStep} />;
    case 'reductio':
      return <ReductioProofStepTextView proofStep={proofStep} />;
    case 'cases_start':
      return <CasesStartProofStepTextView proofStep={proofStep} />;
    case 'case':
      return <CaseProofStepTextView proofStep={proofStep} />;
    case 'qedcase':
      return <QedCaseProofStepTextView />;
    case 'cases_end':
      return <CasesEndProofStepTextView proofStep={proofStep} />;
    case 'comment':
      return <CommentProofStepTextView proofStep={proofStep} />;
    default:
      assertNever(proofStep);
      return null;
  }
};
ProofStepTextView.displayName = 'ProofStepTextView';

const KnownProofStepTextView: React.FC<{
  proofStep: KnownProofStep;
}> = ({
  proofStep,
}) => {
  return (
    <div>Known: {proofStep.term}</div>
  );
};
KnownProofStepTextView.displayName = 'KnownProofStepTextView';

const JustifiedProofStepTextView: React.FC<{
  proofStep: JustifiedProofStep;
}> = ({
  proofStep,
}) => {
  return (
    <div>{proofStep.term} ({proofStep.justification})</div>
  );
};
JustifiedProofStepTextView.displayName = 'JustifiedProofStepTextView';

const UnjustifiedProofStepTextView: React.FC<{
  proofStep: UnjustifiedProofStep;
}> = ({
  proofStep,
}) => {
  return (
    <div>{proofStep.term} (unjustified)</div>
  );
};
UnjustifiedProofStepTextView.displayName = 'UnjustifiedProofStepTextView';

const AssumptionProofStepTextView: React.FC<{
  proofStep: AssumptionProofStep;
}> = ({
  proofStep,
}) => {
  return (
    <div>Assume: {proofStep.term}</div>
  );
};
AssumptionProofStepTextView.displayName = 'AssumptionProofStepTextView';

const ReductioProofStepTextView: React.FC<{
  proofStep: ReductioProofStep;
}> = ({
  proofStep,
}) => {
  return (
    <div>{proofStep.term} (reductio)</div>
  );
};
ReductioProofStepTextView.displayName = 'ReductioProofStepTextView';

const CasesStartProofStepTextView: React.FC<{
  proofStep: CasesStartProofStep;
}> = ({
  proofStep,
}) => {
  return (
    <div>Start {proofStep.targetTerm} by cases {proofStep.casesTerm}:</div>
  );
};
CasesStartProofStepTextView.displayName = 'CasesStartProofStepTextView';

const CaseProofStepTextView: React.FC<{
  proofStep: CaseProofStep;
}> = ({
  proofStep,
}) => {
  return (
    <div>Case {proofStep.index}: {proofStep.term}</div>
  );
};
CaseProofStepTextView.displayName = 'CaseProofStepTextView';

const QedCaseProofStepTextView: React.FC = () => {
  return (
    <div>QED Case</div>
  );
};
QedCaseProofStepTextView.displayName = 'QedCaseProofStepTextView';

const CasesEndProofStepTextView: React.FC<{
  proofStep: CasesEndProofStep;
}> = ({
  proofStep,
}) => {
  return (
    <div>{proofStep.term} (cases)</div>
  );
};
CasesEndProofStepTextView.displayName = 'CasesEndProofStepTextView';

const CommentProofStepTextView: React.FC<{
  proofStep: CommentProofStep;
}> = ({
  proofStep,
}) => {
  return (
    <div>% {proofStep.text}</div>
  );
};
CommentProofStepTextView.displayName = 'CommentProofStepTextView';
