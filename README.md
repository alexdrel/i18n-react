[![Build Status](https://travis-ci.org/alexdrel/i18n-react.svg?branch=master)](https://travis-ci.org/alexdrel/i18n-react)

i18n-react
===
React (JS) text internationalization and externalizing.
Markdown-ish syntax with variables support (including of react element type).

### Quick example

```js
var ReactDOM = require('react-dom');
var React = require('react');
const { MDText } = require('i18n-react');

const T = new MDText({
  greeting: "#Hello, World!\n My name is **{myName}**! \n {{howAreYou}}",
  howAreYou:  "_How do you do?_"
}, { MDFlavor: 1 });

ReactDOM.render(
  <T.span text={{ key: "greeting", myName: "i18n-react" }}/>,
  document.getElementById('content')
);
```

Unsurprisingly renders:
********
### Hello, World!
My name is **i18n-react**!

_How do you do?_

********

### External yaml resource file
Usually texts are retrived from an extrenal source (I would recommend YAML format) but
loading of the external files is out of scope for the library.

```yaml
greetings:
  hello: Hi, {who}!
  howdy:
    formal: How do you do?
    normal: How are you, {who}?
    informal: "What's up?"
  bye: Bye

longTime:
  0: Not a day no see
  1: 1 day no see
  '2..4': A few days no see
  _: "[{context} days][Long time no see]"
```

Points of interest:
* {who} - variable interpolation
* formal/informal - context selectors
* longTime - pluralization and range
* [X days][...] - renders two paragraphs


## Usage
Npm compatible packager (browserify/webpack) is recommended, but ```Dist``` folder also contains UMD versions
(regular and minified) that can be used w/o commonJS packager.

### Global Singleton
```js
/* ES6 & TS */
import T from 'i18n-react';
/* commonJS */
var T = require('i18n-react').default;
/* when using UMD version w/o modules */
var T = window['i18n-react'].default;
```


Setup once - probably in an application entry point js:
```js
T.setTexts({
  greeting: "Hello, World! My name is *{myName}*! \n {{howAreYou}}",
  howAreYou:  "_How do you do?_"
}, { MDFlavor: 0 });
/* or if there is yaml/json loader */
var dictionary = require('../texts/texts-en.yml');
T.setTexts(dictionary);
```

Use it anywhere:
```xml
 <T.a text="path.to.string" href="a's href"/>
 <T.text tag='h1' text="path.to.string" context: "context-if-any"/>
 <T.p text={{ key: "path.to.string", var1: "string", var2: 2}} anyValidHtmlAttribute="p.will.have.it"/>
 <T.span text={{ key: "path.to.string", context: "context-if-any", var1: "string", var2: 2, var3: <span className="c">X</span>}}/>
 <h1>{T.translate("path.to.string", { context: "context", val: 1})}</h1>
```

### Creating new MDText object
In case you want to control lifecycle of the dictionary object (instead of default singleton)
it can be created with MDText constructor.
```js
import { MDText } from 'i18n-react';
let T = new MDText({...});
let x = T.translate("path.to.string");
<T.span text="path.to.string" />
```
### Passing in the React Context
MDText object can be passed in the react 16.3+ context. See examples/yaml for complete example.
```tsx
import { MDText } from 'i18n-react';
let MDTextContext = React.createContext();
let Texts = new MDText({...});

<MDTextContext.Provider value={Texts}>
    <MDTextContext.Consumer>{ (T) =>
      <T.span text="path.to.string" />
    }</MDTextContext.Consumer>
</MDTextContext.Provider>
```

### Difference between Keys and Context
Text attribute is a key that should point to string or JSON object, it has to be present in the language resource.
Then if needed the context is used to disambiguate betwen multiple texts according to the following rules:
1. Exact match for the context value.
1. For numeric context values - key with range, e.g. 2..4 that matches context value.
1. Explicit default - '_' key.
1. First key.

### Missing translations
By default if translation for the specified key is not present the key itself is returned
to help you find the missing translation.
This behaviour can be augmented by passing custom ``notFound`` value to setText options or MDText contructor.

This value can be either a string, or a function returning a string.
If it is a string, then it will be returned as is any time a key is missing.
If you provide a function, then the function will be run with the missing key
and context as arguments.

```js
// "Not Found!" will replace all missing translations
T.setTexts(translations, {
  notFound: 'Not Found!'
})

// "SomeKey <-- this guy" will appear instead
T.setTexts(translations, {
  notFound: key => `${key} <-- this guy`
})

// you can combine this solution with markdown!
T.setTexts(translations, {
  notFound: key => `**${key}**` // will render <strong>SomeKey</strong>
})
```

### Function in translation
Translation dictionaries can be extended with functions (as in notFound).

```js
T.setTexts({
    a: 'A',
    n: (_key, ctx) => ctx ? `Number ${ctx}` : '',
  });
T.translate('a')) // 'A'
T.translate('n', { context: 9 })) // 'Number 9'
```

## Markdown syntax

 + ``*italic*`` *italic*  - ``<em>`` **breaking change V1, ``<strong>`` in V0**
 + ``_italic_`` _italic_  - ``<i>`` **breaking change V1, ``<em>`` in V0**
 + ``**bold**`` **bold** ``<strong>`` *new - V1*
 + ``__bold__`` __bold__ ``<b>`` *new - V1*
 + ``~underlined~`` <u>underlined</u> ``<u>`` *new - V1*
 + ``~~strike~~`` ~~strike~~  ``<strike>`` *new - V1*
 + ``\n`` New Line ``<br>``
 + ``[Paragraph 1][Paragraph 2]`` Multiple paragraphs ``<p>``
 + ``#``-``####`` Headers ``<h1>-<h4>``
 + \`\` \*as\*\_[IS]\_ \`\`  Literal  *new - V1*

### Unit tests are half-loaf documentation
You are welcomed to consult examples folder and unit tests for usage details and examples.

## Breaking changes
### 0.6
##### Literal \`\` in V1 syntax
New \`\` syntax  \`\` (in V1 only) to disable MD processing.

### 0.5
##### React 16+ required
As React now allows fragments and strings in render the default behavior of ``<T.text>`` changed not to wrap the output into ``<span>`` when ``tag`` property is not specified.

### 0.4
##### New MD syntax
The new MD flavor (aligned with github's Markdown) is added : V1. Opt-in for this release, will become default in the next major release.
V1 introduces strike and underline, and rehabilitates ``<b>`` and ``<i>`` tags.

```yaml
  em: "an *italic* style"
  i: "an _italic_ style"
  strong: "a **bold** move"
  b: "a __bold__ move"
  u: "an ~underlined~ word"
  strike: "a ~~strike~~ out"
```
To opt-in for the new syntax:
```js
let T = new MDText(texts, { MDFlavor: 1 });
// or for the singelton
T.setTexts(require('../texts/texts-en.yml'), { MDFlavor: 1, notFound: 'NA' });
```
#### notFound Deprecation
MDText notFound property is deprecated - please switch to constructor or serTexts options.

### 0.3
##### Unknown Prop Warning
React 15.2 is preparing to stop filtering HTML properties (https://fb.me/react-unknown-prop) - the feature that i18n relied upon for
preventing interpolation variables from leaking into the DOM.

Thus new syntax for passing variables is introduced:
```xml
<T.span text={{ key: "greeting", myName: "i18n-react" }}/>
/* replaces */
<T.span text="greeting" myName="i18n-react"/>
```
All tags passing to T.* anything beside ```text```, ```tag``` and ```context``` properties have to be updated or React 15.2 will cry annoyingly.

##### typescript 2.0 / ts@next typings
Updated package.json contains all the info for the new typescript to get typings automatically.

### 0.2
* ES6 style export (use default export explicitly for commonJS/UMD)
* Stateless react components (shouldComponentUpdate optimization removed)
* Default export (T above) no longer can be used as a react component (use T.text or T.span instead)

## Development
#### Commands
* Watch commonJS build:  ```$ npm start```
* Build commonJS/UMD version:  ```$ npm run build```
* Start dev server for examples: ```$ npm run examples``` (http://localhost:1818/webpack-dev-server/examples/)
* Build examples: ```$ npm run build:examples```
* Run tests (Firefox): ```$ npm test```
* Watch tests (Chrome): ```$ npm run test:watch```

