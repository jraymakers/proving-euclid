import * as React from 'react';

import { defs } from '../../data';
import { cssClass } from '../../style';
import { DefTextView } from './DefTextView';

const rootClass = cssClass('AllDefsTextView', 'root', {
  padding: '12px',
});

export const AllDefsTextView: React.FC = () => {
  return (
    <div className={rootClass}>
      <div>Definitions</div>
      <div>
        {defs.map(def => <DefTextView key={`${def.kind}:${def.name}`} def={def} />)}
      </div>
    </div>
  );
};
AllDefsTextView.displayName = 'AllDefsTextView';
