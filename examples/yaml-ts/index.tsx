var React = require('react');
var ReactDOM = require('react-dom');
import { MDText } from '../../dist/i18n-react';
import HelloBlock from './hello-block';
import MDTextContext from './text-context';


/* Initialize once - probably in entry point js somwehere near the router */
var T = new MDText(require('./texts.yml'));

ReactDOM.render(
  <MDTextContext.Provider value={T}>
    <section>
      <HelloBlock name="World" style="formal" days={0} />
      <HelloBlock name="State" style="normal" days={1} />
      <HelloBlock name="City" style="informal" days={3} />
      <HelloBlock name="Town" style="informal" days={5} />
    </section>
  </MDTextContext.Provider>,
  document.getElementById('content')
);

