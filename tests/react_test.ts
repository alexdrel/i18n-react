/// <reference path="./jasmine.d.ts" />
/// <reference path="../src/reference.d.ts" />

import React = require('react');
import T = require('../src/i18n-react');

describe("i18n-react", () => {

  function formatHTML(text: string, o?: any): string {
    var s =  React.renderToStaticMarkup(React.createElement('super', null, T.format(text, o)));
    return s.replace(/<\/?super>/g, '');
  }

  it("format renders <strong>", () => {
    expect(formatHTML("*bold*")).toBe("<strong>bold</strong>");
    expect(formatHTML("a *bold* move")).toBe("a <strong>bold</strong> move");
    expect(formatHTML("a *bold* move *nice*")).toBe("a <strong>bold</strong> move <strong>nice</strong>");
  });

  it("format ignores * mid-word", () => {
    expect(formatHTML("2*3")).toBe("2*3");
    expect(formatHTML("2*3*4")).toBe("2*3*4");
    expect(formatHTML("2*3* 4")).toBe("2*3* 4");
  });

  function html(o?: any): string {
    return  React.renderToStaticMarkup(React.createElement(T, o));
  }

  it("<T> renders <strong>", () => {
    T.setTexts({ bold: "*bold*", b2: "a *bold* move *nice*" });
    expect(html({ text: "bold"})).toBe("<span><strong>bold</strong></span>");
    expect(html({ text: "bold", tag: 'p'})).toBe("<p><strong>bold</strong></p>");
    expect(html({ text: "bold", tag: 'div'})).toBe("<div><strong>bold</strong></div>");
    expect(html({ text: "b2", tag: 'p'})).toBe("<p>a <strong>bold</strong> move <strong>nice</strong></p>");
  });

  it("format renders <em>", () => {
    expect(formatHTML("_it_")).toBe("<em>it</em>");
    expect(formatHTML("_it_ is")).toBe("<em>it</em> is");
    expect(formatHTML("is _it_?")).toBe("is <em>it</em>?");
  });

  it("format renders <br>", () => {
    expect(formatHTML("a\nb")).toBe("a<br>b");
    expect(formatHTML("a\n  b")).toBe("a<br>b");
    expect(formatHTML("a \t \n\t b")).toBe("a<br>b");
    expect(formatHTML("a\n\n\n b")).toBe("a<br><br><br>b");
  });

  it("format renders <p>", () => {
    expect(formatHTML("[a][b]")).toBe("<p>a</p><p>b</p>");
    expect(formatHTML("[a] [b]")).toBe("<p>a</p> <p>b</p>");
    expect(formatHTML("c [a] [b] d")).toBe("c <p>a</p> <p>b</p> d");
  });

  it("<T> renders <p>", () => {
    T.setTexts({ p3: "[a][b][c]" });
    expect(html({ text: "p3"})).toBe("<span><p>a</p><p>b</p><p>c</p></span>");;
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
    expect(formatHTML("a#\nText")).toBe("a#<br>Text");
    expect(formatHTML("ttt##xxx\nText")).toBe("ttt##xxx<br>Text");

  });

  it("<T> transfers html attributes", () => {
    T.setTexts({ a: "a", b: "{val}" });
    expect(html({ text: "a", className: "cl"})).toBe("<span class=\"cl\">a</span>");
    expect(html({ text: "a", tag: 'p', 'data-x': 'x'})).toBe("<p data-x=\"x\">a</p>");
    expect(html({ text: "a", tag: 'a', href: '#'})).toBe("<a href=\"#\">a</a>");

    expect(html({ text: "b", val: 'B', className: "cl"})).toBe("<span class=\"cl\">B</span>");
  });

  it("format renders React variables", () => {
    expect(formatHTML("z{R}z", { R: React.createElement('b', null, 'B')})).toBe("z<b>B</b>z");
  });

});

