import * as ReactDOMServer from 'react-dom-server';

export default function renderElement(element: any): string {
  return ReactDOMServer.renderToStaticMarkup(element);
}
