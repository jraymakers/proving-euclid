import * as React from 'react';

import { AllDefsTextView } from '../../ui/components/AllDefsTextView';
import { AllThmsTextView } from '../../ui/components/AllThmsTextView';
import { AllProofsTextView } from '../../ui/components/AllProofsTextView';

export const Root: React.FC = () => {
  return (
    <div>
      <AllDefsTextView />
      <AllThmsTextView />
      <AllProofsTextView />
    </div>
  );
}
Root.displayName = 'Root';
