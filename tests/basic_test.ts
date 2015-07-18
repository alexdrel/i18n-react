/// <reference path="./jasmine.d.ts" />
/// <reference path="../src/reference.d.ts" />

import T = require('../src/i18n-react');

describe("i18n-react", () => {

  beforeAll(() => {
    T.setTexts({
       a: "A",
       aa: {
         b: {
           c: "AABC"
         }
       },
       b: "B",
       c: {
         a: "CA",
         b: "CB",
         _: "CX" 
       },
       d: {
         a: "DA",
         b: "DB"
       },
       v: {
         a: "{val}",
         b: "b{val}",
         c: "{val}c", 
         d: "d{val}d",
         l: "{val,l}",                                 
       },
       plural: {
         "0": "No stars",
         "1": "A single star",
         _: "{context} stars"
       },
       self: {
        aabc: "{{aa.b.c}}",
        d: "{{d}}" 
       }
    });
  });

  it("loads plain string", () => {
    expect(T.translate('a')).toBe('A');
    expect(T.translate('aa.b.c')).toBe('AABC');    
    expect(T.translate('b')).toBe('B');
  });

  it("uses context (explicit default)", () => {
    expect(T.translate('c')).toBe('CX');
    expect(T.translate('c', {})).toBe('CX');
    
    expect(T.translate('c', { context: 'a'})).toBe('CA');
    expect(T.translate('c', { context: 'b'})).toBe('CB');
    expect(T.translate('c', { context: 'q'})).toBe('CX');
  });

  it("uses context (implicit - first as default)", () => {
    expect(T.translate('d')).toBe('DA');
    expect(T.translate('d', { context: 'a'})).toBe('DA');
    expect(T.translate('d', { context: 'b'})).toBe('DB');
    expect(T.translate('d', { context: 'q'})).toBe('DA');
  });
  
  it("ignores missing context", () => {
    expect(T.translate('b', { context: 'a'})).toBe('B');
  });
  
  it("interpolotes variable", () => {
    expect(T.translate('v.a', { val: 'x'})).toBe('x');
    expect(T.translate('v.b', { val: 'x'})).toBe('bx');
    expect(T.translate('v.c', { val: 'x'})).toBe('xc');
    expect(T.translate('v.d', { val: 'x'})).toBe('dxd');            
  });
  
  it("localizes numbers", () => {
    expect(T.translate('v.l', { val: 10000})).toMatch(/10[,']?000/);          
  });
  
  it("can do basic plurals", () => {
    expect(T.translate('plural', { context: 0})).toBe("No stars");          
    expect(T.translate('plural', { context: 1})).toBe("A single star");          
    expect(T.translate('plural', { context: 2})).toBe("2 stars");          
    expect(T.translate('plural', { context: 5})).toBe("5 stars");          
  });
  
  it("can reuse strings", () => {
    expect(T.translate('self.aabc')).toBe("AABC");          
    expect(T.translate('self.d', { context: 'a'})).toBe("DA");                
  });
});
