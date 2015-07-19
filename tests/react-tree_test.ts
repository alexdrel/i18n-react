/// <reference path="./jasmine.d.ts" />
/// <reference path="../src/reference.d.ts" />

import React = require('react');
import T = require('../src/i18n-react');

describe("i18n-react", () => {

  function formatHTML(text: string, o?: any): string {
    var s =  React.renderToStaticMarkup(React.createElement('super', null, T.format(text, o)));
    return s.replace(/<\/?super>/g, '');
  }

  function formatHTML_nospan(text: string, o?: any): string {
    var s =  React.renderToStaticMarkup(React.createElement('super', null, T.format(text, o)));
    return s.replace(/<\/?(super|span)>/g, '');
  }

  it("format renders tree 1", () => {
    expect(formatHTML_nospan("a *{v} _{q}_* z", {v: 1, q:2})).toBe("a <strong>1 <em>2</em></strong> z");
    expect(formatHTML_nospan("[a *{v} _{q}_* z]", {v: 1, q:2})).toBe("<p>a <strong>1 <em>2</em></strong> z</p>");
    expect(formatHTML_nospan("[a *{v} _{q}_* z][${q}]", {v: 1, q:2})).toBe("<p>a <strong>1 <em>2</em></strong> z</p><p>$2</p>");
  });

  it("format renders tree 2", () => {
    expect(formatHTML("_a *{v} {q}* z_", {v: 1, q:2})).toBe("<em>a <strong>1 2</strong> z</em>");
    expect(formatHTML_nospan("_a *{v} [{q}]* z_", {v: 1, q:2})).toBe("<em>a <strong>1 <p>2</p></strong> z</em>");
  });
});

