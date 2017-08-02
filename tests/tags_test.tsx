import React = require('react');
import renderElement from './renderElement';
import { MDText } from '../src/i18n-react';

describe("i18n-react", () => {

  it("renders <T.tags>", () => {
    let T = new MDText({ x: "X", y: "Y" });

    expect(renderElement(<T.text text="x" />)).toBe("<span>X</span>");
    expect(renderElement(<T.span text="x" />)).toBe("<span>X</span>");
    expect(renderElement(<T.p text="x" />)).toBe("<p>X</p>");
    expect(renderElement(<T.a text="x" href="#" />)).toBe('<a href="#">X</a>');
    expect(renderElement(<T.div text="y" />)).toBe("<div>Y</div>");
    expect(renderElement(<T.button text="y" id='B1' />)).toBe('<button id="B1">Y</button>');
  });

  it("renders factory <T.tags>", () => {
    let T = new MDText({ x: "X", y: "Y" });
    var TStrong = T.factory('strong');

    expect(renderElement(<TStrong text="x" />)).toBe("<strong>X</strong>");
    expect(renderElement(<TStrong text="y" id='B1' />)).toBe('<strong id="B1">Y</strong>');
  });

  it("renders tag type", () => {
    let T = new MDText({ x: "X", y: "Y" });
    var TStrong = T.factory('strong');

    expect(renderElement(<T.text tag="strong" text="x" />)).toBe("<strong>X</strong>");
    expect(renderElement(<T.text tag="strong" text={{ key: "x" }} />)).toBe("<strong>X</strong>");
    expect(renderElement(<T.text tag="strong" text={{ key: "y" }} id='B1' />)).toBe('<strong id="B1">Y</strong>');

    // Bound tag should not be replaced
    expect(renderElement(<TStrong text="x" tag="p" />)).toBe("<strong>X</strong>");
    expect(renderElement(<T.p text={{ key: "x", tag: "strong" }} />)).toBe("<p>X</p>");
  });

  it("known props are not leaked into DOM", () => {
    let T = new MDText({ x: { a: "Xa", b: "Xb" }, y: "Y" });
    // No react 15.2 errors should be caused

    expect(renderElement(<T.text tag="strong" text="x" context="b" />)).toBe("<strong>Xb</strong>");
    expect(renderElement(<T.text tag="p" text={{ key: "x", context: 'b' }} />)).toBe("<p>Xb</p>");

    expect(renderElement(<T.text text="xx" notFound="b" />)).toBe("<span>b</span>");
  });

  it(" ignores custom attributes", () => {
    let T = new MDText({ x: "X", y: "Y" });
    // supress react 15.2 warnings - Unknown prop `ZZ` on <span> tag.
    let cerror = console.error;
    console.error = () => { };
    try {
      expect(renderElement(<T.span text="x" ZZ='zz' />)).toBe("<span>X</span>");
      expect(renderElement(<T.span text="y" id='B1' zzz='zzz' />)).toBe('<span id="B1">Y</span>');
    } catch (e) { }
    console.error = cerror;
  });

  it(" renders data attributes", () => {
    let T = new MDText({ x: "X", y: "Y" });

    expect(renderElement(<T.span text="x" data-zinc='zz' />)).toBe('<span data-zinc="zz">X</span>');
    expect(renderElement(<T.span text="y" data-zinc='zz' id='B1' />)).toBe('<span data-zinc="zz" id="B1">Y</span>');
  });

  it(" handles missing text attribute in <T>", () => {
    let T = new MDText({ x: "X", y: "Y" });
    expect(renderElement(<T.span />)).toBe("<span></span>");
    expect(renderElement(<T.p id='q' />)).toBe('<p id="q"></p>');

    expect(renderElement(<T.p text="z" />)).toBe("<p>z</p>");
  });

  it(" handles notFound", () => {
    let T = new MDText({ x: "X", y: "Y" });
    expect(renderElement(<T.p text="z" />)).toBe("<p>z</p>");
    expect(renderElement(<T.p text="z" notFound='ZZ' />)).toBe("<p>ZZ</p>");
    expect(renderElement(<T.p text={{ key: "z", notFound: 'ZZ' }} />)).toBe("<p>ZZ</p>");

    T.notFound = '_NA_';
    expect(renderElement(<T.p text="z" />)).toBe("<p>_NA_</p>");
    T = new MDText({ x: "X", y: "Y" }, { notFound: '__' });
    expect(renderElement(<T.p text="z" />)).toBe("<p>__</p>");
  });
});

