i18n-react
===
React (JS) text internationalization and externalizing.

##Quick example

```js
var React = require('react');
var T = require('i18n-react');

T.setTexts({ 
  greeting: "Hello, World! My name is *{myName}*! \n {{howAreYou}}",
  howAreYou:  "_How do you do?_"
});

React.render(
  <T text="greeting" myName="i18n-react"/>,
  document.getElementById('content')
);
```

Unsurprisingly renders:
********
Hello, World! My name is **i18n-react**!

_How do you do?_

********

Usually texts are retrived from an extrenal source (I would recommend YAML format) but 
loading of the external files is out of scope for the library. 

Usage of npm compatible packeger (browserify/webpack) for JS/TS is assumed and required.

As documentation is non-existent you are welcomed to consult unit tests for usage details and examples.
   
#### Global npm modules dependencies for required for development
- typescript
- react-tools

#### Commands
Build dist folder:  ```$ npm run build```
Start dev server for examples: ```$ npm start```
Watch tests (Chrome): ```$ npm test```


