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

  it("supports context array", () => {
     var texts: any = {
       c: {
         A: {
          "0": "a0",
          "1": "a1",
          _: "ax"
         },
         B: {
          "1": "b1",
          _: "bx"
         },
       }
    };
    T.setTexts(texts);

    expect(T.translate('c', { context: [ 'A', 0]})).toBe("a0");
    expect(T.translate('c', { context: [ 'A', 1]})).toBe("a1");
    expect(T.translate('c', { context: [ 'A', 2]})).toBe("ax");

    expect(T.translate('c', { context: [ 'B', 1]})).toBe("b1");
    expect(T.translate('c', { context: [ 'B', 2]})).toBe("bx");

    expect(T.translate('c', { context: [ 'A' ]})).toBe("ax");
    expect(T.translate('c', { context: []})).toBe("ax");
    expect(T.translate('c', {})).toBe("ax");

    expect(T.translate('c', { context: [ 'B' ]})).toBe("bx");
  });

  it("range number context", () => {
     var texts: any = {
       c: {
         '0':     'none',
         '1':     'one',
         "2..3":  'a couple',
         "4..6":  'a few',
         "7..9":  'several',
         _:       'many'
       }
    };
    T.setTexts(texts);

    expect(T.translate('c', { context: 0})).toBe('none');
    expect(T.translate('c', { context: 1})).toBe('one');
    expect(T.translate('c', { context: 2})).toBe('a couple');
    expect(T.translate('c', { context: 3})).toBe('a couple');
    expect(T.translate('c', { context: 4})).toBe('a few');
    expect(T.translate('c', { context: 5})).toBe('a few');
    expect(T.translate('c', { context: 6})).toBe('a few');
    expect(T.translate('c', { context: 7})).toBe('several');
    expect(T.translate('c', { context: 8})).toBe('several');
    expect(T.translate('c', { context: 9})).toBe('several');
    expect(T.translate('c', { context: 10})).toBe('many');
    expect(T.translate('c', { context: 11})).toBe('many');
    expect(T.translate('c', { context: 11})).toBe('many');
  });
});
