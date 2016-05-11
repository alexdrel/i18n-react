var ReactDOM = require('react-dom');
var React = require('react');
var T = require('i18n-react').default;

T.setTexts({
  greeting: "#Hello, World!\n My name is *{myName}*! \n {{howAreYou}}",
  howAreYou:  "_How do you do?_"
});

ReactDOM.render(
  <T.span text="greeting" myName="i18n-react"/>,
  document.getElementById('content')
);

