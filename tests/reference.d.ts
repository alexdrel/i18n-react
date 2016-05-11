/// <reference path="./jasmine.d.ts" />
/// <reference path="../src/reference.d.ts" />

declare module 'react-dom-server' {
  function renderToStaticMarkup(el: any): string;
  function isValidElement(e: any): boolean;
}
