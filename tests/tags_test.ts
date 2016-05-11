/// <reference path="./reference.d.ts" />

import React = require('react');
import renderElement from './renderElement';
import * as T from '../src/i18n-react';

describe("i18n-react", () => {

  function formatHTML(element: any, o: any): string {
    return renderElement(React.createElement(element, o));
  }

  it(" renders <T.tags>", () => {
    T.setTexts({ x: "X", y: "Y" });

    expect(formatHTML(T.default, { text:"x" })).toBe("<span>X</span>");
    expect(formatHTML(T.span, { text:"x" })).toBe("<span>X</span>");
    expect(formatHTML(T.p, { text:"x" })).toBe("<p>X</p>");
    expect(formatHTML(T.a, { text:"x", href: "#"})).toBe('<a href="#">X</a>');
    expect(formatHTML(T.div, { text:"y" })).toBe("<div>Y</div>");
    expect(formatHTML(T.button, { text:"y", id: 'B1' })).toBe('<button id="B1">Y</button>');
  });

  it(" renders factory <T.tags>", () => {
    T.setTexts({ x: "X", y: "Y" });
    var TStrong = T.factory('strong');

    expect(formatHTML(TStrong, { text:"x" })).toBe("<strong>X</strong>");
    expect(formatHTML(TStrong, { text:"y", id: 'B1' })).toBe('<strong id="B1">Y</strong>');
  });

  it(" ignores custom attributes", () => {
    T.setTexts({ x: "X", y: "Y" });

    expect(formatHTML(T.span, { text:"x", ZZ: 'zz' })).toBe("<span>X</span>");
    expect(formatHTML(T.span, { text:"y", id: 'B1', zzz: 'zzz' })).toBe('<span id="B1">Y</span>');
  });

  it(" renders data attributes", () => {
    T.setTexts({ x: "X", y: "Y" });

    expect(formatHTML(T.span, { text:"x", "data-zinc": 'zz' })).toBe('<span data-zinc="zz">X</span>');
    expect(formatHTML(T.span, { text:"y", "data-zinc": 'zz', id: 'B1' })).toBe('<span data-zinc="zz" id="B1">Y</span>');
  });

  it(" handles missing text in <T>", () => {
    T.setTexts({ x: "X", y: "Y" });
    expect(formatHTML(T.span, {})).toBe("<span></span>");
    expect(formatHTML(T.p, { id:'q'})).toBe('<p id="q"></p>');
  });
});

