import React = require('react');
import renderElement from './renderElement';
import { MDText } from '../src/i18n-react';

describe("i18n-react Flavor V1", () => {
  let T = new MDText({}, { MDFlavor: 1 });
  function formatHTML(text: string, o?: any): string {
    var s = renderElement(React.createElement('super', null, T.format(text, o)));
    return s.replace(/<\/?super>/g, '');
  }

  it("format renders <em> or <i>", () => {
    expect(formatHTML("an *italic* style")).toBe("an <em>italic</em> style");
    expect(formatHTML("an _italic_ style")).toBe("an <i>italic</i> style");
  });

  it("format renders <strong> or <b>", () => {
    expect(formatHTML("a **bold** move")).toBe("a <strong>bold</strong> move");
    expect(formatHTML("a __bold__ move")).toBe("a <b>bold</b> move");
  });

  it("format renders <strike> or <u>", () => {
    expect(formatHTML("an ~underline~ word")).toBe("an <u>underline</u> word");
    expect(formatHTML("a ~~strike~~ out")).toBe("a <strike>strike</strike> out");
  });

  it("format renders <br>", () => {
    expect(formatHTML("a\nb")).toBe("a<br/>b");
    expect(formatHTML("a\n  b")).toBe("a<br/>b");
    expect(formatHTML("a \t \n\t b")).toBe("a<br/>b");
    expect(formatHTML("a\n\n\n b")).toBe("a<br/><br/><br/>b");
  });

  it("format renders <p>", () => {
    expect(formatHTML("[a][b]")).toBe("<p>a</p><p>b</p>");
    expect(formatHTML("[a] [b]")).toBe("<p>a</p> <p>b</p>");
    expect(formatHTML("c [a] [b] d")).toBe("c <p>a</p> <p>b</p> d");
  });


  it("format renders <h1-4>", () => {
    expect(formatHTML("#Head\nText")).toBe("<h1>Head</h1>Text");
    expect(formatHTML("##Head\nText")).toBe("<h2>Head</h2>Text");
    expect(formatHTML("###Head\nText")).toBe("<h3>Head</h3>Text");
    expect(formatHTML("####Head\nText")).toBe("<h4>Head</h4>Text");

    expect(formatHTML("#Head#\nText")).toBe("<h1>Head</h1>Text");
    expect(formatHTML("##Head##\nText")).toBe("<h2>Head</h2>Text");
    expect(formatHTML("###Head###\nText")).toBe("<h3>Head</h3>Text");
    expect(formatHTML("####Head###\nText")).toBe("<h4>Head</h4>Text");

    expect(formatHTML("p\n#Head#\nText")).toBe("p<h1>Head</h1>Text");
    expect(formatHTML("p\n  ##Head\nText")).toBe("p<h2>Head</h2>Text");
    expect(formatHTML("p\n  ###Head###   \nText")).toBe("p<h3>Head</h3>Text");
    expect(formatHTML("p\n#Head #\nText")).toBe("p<h1>Head </h1>Text");
    expect(formatHTML("p\n#Head \nText")).toBe("p<h1>Head</h1>Text");
  });

  it("format renders multiple <h1-4> in a text block", () => {
    expect(formatHTML("# Lorem\nLorem ipsum dolor sit amet, consectetur adipiscing elit.\n## Quisque\nQuisque sit amet nisi quis eros cursus finibus quis sed nisl.\n"))
      .toContain('<h1>');
  });

  it("format ignores midline #", () => {
    expect(formatHTML("a#\nText")).toBe("a#<br/>Text");
    expect(formatHTML("ttt##xxx\nText")).toBe("ttt##xxx<br/>Text");

  });

  it("format renders React variables", () => {
    expect(formatHTML("z{R}z", { R: React.createElement('b', null, 'B') })).toBe("z<b>B</b>z");
  });

});

