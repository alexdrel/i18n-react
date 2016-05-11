import React = require('react');
import ReactDOMServer = require('react-dom-server');

export default function formatHTML(element: any): string {
  return ReactDOMServer.renderToStaticMarkup(element);
}
