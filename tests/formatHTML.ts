import * as React from 'react';
import renderElement from './renderElement';
import T from '../src/i18n-react';

export default function formatHTML(text: string, o?: any): string {
  return renderElement(T.format(text, o));
}

export function textHTML(o?: any): string {
  return renderElement(React.createElement(T.text, o));
}
