import * as React from 'react';

import { thms } from '../../data';
import { cssClass } from '../../style';
import { ThmTextView } from './ThmTextView';

const rootClass = cssClass('AllThmsTextView', 'root', {
  padding: '12px',
});

export const AllThmsTextView: React.FC = () => {
  return (
    <div className={rootClass}>
      <div>Theorems</div>
      <div>
        {thms.map(thm => <ThmTextView key={`${thm.kind}:${thm.name}`} thm={thm} />)}
      </div>
    </div>
  );
};
AllThmsTextView.displayName = 'AllThmsTextView';
