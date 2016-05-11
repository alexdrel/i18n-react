var React = require('react');
var ReactDOM = require('react-dom');
var T = require('i18n-react');
var HelloBlock = require('./hello-block');

/* Initialize once - probably in entry point js somwehere near the router */
T.setTexts( require('./texts.yml'));

ReactDOM.render(
  <section>
    <HelloBlock name="World" style="formal" days={0}/>
    <HelloBlock name="State" style="normal" days={1}/>
    <HelloBlock name="City" style="informal" days={3}/>
    <HelloBlock name="Town" style="informal" days={5}/>
  </section>,
  document.getElementById('content')
);

