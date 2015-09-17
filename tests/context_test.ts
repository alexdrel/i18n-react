/// <reference path="./jasmine.d.ts" />
/// <reference path="../src/reference.d.ts" />

import T = require('../src/i18n-react');

describe("i18n-react translate", () => {
  it("with context object", () => {
     var texts: any = {
       c: {
         __: "type.count",
         _: "{context.count} {context.type}(s)",
         star: {
          "0": "No stars",
          "1": "A single star",
          _: "{context.count} stars"
         },
         planet: {
          "1": "A planet",
          _: "{context.count} planets"
         }
       }
    };
    T.setTexts(texts);

    expect(T.translate('c', { context: { type: 'star', count: 0 }})).toBe("No stars");
    expect(T.translate('c', { context: { type: 'star', count: 1 }})).toBe("A single star");
    expect(T.translate('c', { context: { type: 'star', count: 2 }})).toBe("2 stars");
    expect(T.translate('c', { context: { type: 'star', count: 5 }})).toBe("5 stars");

    expect(T.translate('c', { context: { type: 'planet', count: 0 }})).toBe("0 planets");
    expect(T.translate('c', { context: { type: 'planet', count: 1 }})).toBe("A planet");
    expect(T.translate('c', { context: { type: 'planet', count: 2 }})).toBe("2 planets");

    expect(T.translate('c', { context: { type: 'ufo' }})).toBe(" ufo(s)");
    expect(T.translate('c', { context: { count: 0}})).toBe("0 (s)");


    expect(T.translate('c', { context: { type: 'ufo', count: 0 }})).toBe("0 ufo(s)");
    expect(T.translate('c', { context: { type: 'ufo', count: 1 }})).toBe("1 ufo(s)");
    expect(T.translate('c', { context: { type: 'ufo', count: 2 }})).toBe("2 ufo(s)");

    expect(T.translate('c', { context: { count: 1, type: 'star' }})).toBe("A single star");
    delete texts.c.__;
    expect(T.translate('c', { context: { count: 1, type: 'star' }})).not.toBe("A single star");
  });

  it("finds default in context object", () => {
     var texts: any = {
       c: {
         __: "type.count",
         object: {
          "0": "No objects",
          "1": "A single object",
          _: "{context.count} objects"
         },
         planet: {
          "1": "A planet",
          _: "{context.count} planets"
         }
       },
       d: "{context.count} {context.type}(s)"
    };
    T.setTexts(texts);

    expect(T.translate('c', { context: { type: 'ufo', count: 0 }})).toBe("No objects");
    expect(T.translate('c', { context: { type: 'ufo', count: 1 }})).toBe("A single object");
    expect(T.translate('c', { context: { type: 'ufo', count: 2 }})).toBe("2 objects");

    expect(T.translate('d', { context: { type: 'ufo', count: 0 }})).toBe("0 ufo(s)");
    expect(T.translate('d', { context: { type: 'ufo', count: 1 }})).toBe("1 ufo(s)");
    expect(T.translate('d', { context: { type: 'ufo', count: 2 }})).toBe("2 ufo(s)");
  });
});
