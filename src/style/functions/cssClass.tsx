import { style } from 'typestyle';

import { Style } from '../types/Style';

export function cssClass(namespace: string, localName: string, ...styles: Style[]): string {
  return style(...styles, {
    $debugName: `${namespace}_${localName}`,
    $unique: true,
  });
}
