import React = require('react');
import ReactDOM = require('react-dom');
import T from '../../dist/i18n-react';


const styles = {
  em: "an *italic* style",
  i: "an _italic_ style",
  strong: "a **bold** move",
  b: "a __bold__ move",
  u: "an ~underlined~ word",
  strike: "a ~~strike~~ out",
  br: "New \n Line",
  p: "[Paragraph 1][Paragraph 2]",
  h1: "# Header\nText",
  h2: "## Header\nText",
  h3: "### Header\nText",
  h4: "#### Header\nText",
};

T.setTexts({
  title: "Supported Markdown syntax *(V1 flavor)*",
  styles: styles,
}, { MDFlavor: 1 });

ReactDOM.render(
  <article>
    <T.text tag="h2" text="title" />
    <ul>{
      Object.keys(styles).map(n =>
        <li key={n}>
          <T.div text={"styles." + n} />
          <em>{'"' + (styles as any)[n].replace('\n', "\\n") + '"  '}</em>
          <b>{` <${n}>`}</b> tag
        </li>
      )}
    </ul>
  </article>,
  document.getElementById('content')
);

